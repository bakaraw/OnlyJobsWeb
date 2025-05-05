<?php

namespace App\Http\Controllers;

use App\Models\JobPost;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Pagination\LengthAwarePaginator;

class JobSeekerController extends Controller
{
    public function apply($jobPostId)
    {

        $user = Auth::user();
        /*if (!$user) {*/
        /*    redirect()->route('login');*/
        /*}*/

        if ($user->appliedJobs()->where('job_post_id', $jobPostId)->exists()) {
            return redirect()->route('find_work')->with('You have already applied for this job');
        }

        $user->appliedJobs()->attach($jobPostId, [
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        return redirect()->route('find_work')->with('success');
    }


    public function incrementViews($id)
    {

        $jobPost = JobPost::findOrFail($id);
        $jobPost->increment('views');
        return response()->json(['success' => true]);
    }

    public function JobView($id)
    {

        $jobview = JobPost::with([
            'skills',
            'requirements:requirement_id,requirement_name',
            'degree',
            'status',
        ])
            ->select(
                'id',
                'job_title',
                'job_description',
                'job_location',
                'job_type',
                'salary_type',
                'min_salary',
                'max_salary',
                'min_experience_years',
                'company',
                'user_id',
                'status_id',
                'degree_id',
                'created_at'
            )
            ->findOrFail($id);

        return Inertia::render('JobView', [
            'jobview' => $jobview,
        ]);
    }

    /*public function show(Request $request)*/
    /*{*/
    /*    if (Auth::check()) {*/
    /*        $user = Auth::user();*/
    /**/
    /*        // Optional: You can still use JobMatcher if it returns a query*/
    /*        $jobQuery = app('App\Services\JobMatcher')->matchJobs($user);*/
    /*    } else {*/
    /*        $jobQuery = JobPost::with(['skills', 'requirements'])->latest();*/
    /*    }*/
    /**/
    /*    // Apply filters directly to the query*/
    /*    if ($request->filled('experience')) {*/
    /*        $expFilters = $request->input('experience');*/
    /*        if (!is_array($expFilters)) {*/
    /*            $expFilters = [$expFilters];*/
    /*        }*/
    /*        $jobQuery->whereIn('min_experience_years', $expFilters);*/
    /*    }*/
    /**/
    /*    if ($request->filled('job_type')) {*/
    /*        $jobTypes = $request->input('job_type');*/
    /*        if (!is_array($jobTypes)) {*/
    /*            $jobTypes = [$jobTypes];*/
    /*        }*/
    /*        $jobQuery->whereIn('job_type', $jobTypes);*/
    /*    }*/
    /**/
    /*    // Only take 10 jobs **after** filtering*/
    /*    $jobs = $jobQuery->take(10)->get();*/
    /**/
    /*    // Format for frontend*/
    /*    $formattedJobs = $jobs->map(function ($job) {*/
    /*        return [*/
    /*            'id' => $job->id,*/
    /*            'job_title' => $job->job_title,*/
    /*            'user_id' => $job->user_id,*/
    /*            'job_description' => $job->job_description,*/
    /*            'job_location' => $job->job_location,*/
    /*            'job_type' => $job->job_type,*/
    /*            'created_at' => $job->created_at,*/
    /*            'min_experience_years' => $job->min_experience_years,*/
    /*            'degree_id' => $job->degree_id,*/
    /*            'company' => $job->company,*/
    /*            'match_score' => $job->match_score ?? null,*/
    /*            'skills' => $job->skills->map(fn($skill) => [*/
    /*                'skill_id' => $skill->skill_id ?? $skill->pivot->skill_id ?? null,*/
    /*                'skill_name' => $skill->skill_name ?? $skill->pivot->skill_name ?? null,*/
    /*            ]),*/
    /*            'requirements' => $job->requirements->map(fn($req) => [*/
    /*                'requirement_id' => $req->requirement_id,*/
    /*                'requirement_name' => $req->requirement_name,*/
    /*            ]),*/
    /*        ];*/
    /*    });*/
    /**/
    /*    return Inertia::render('FindWork', [*/
    /*        'jobs' => $formattedJobs,*/
    /*        'filters' => $request->only(['experience', 'job_type']),*/
    /*    ]);*/
    /*}*/
    public function show(Request $request)
    {
        $jobQuery = JobPost::with(['skills', 'requirements']);
        $searchTerm = $request->input('search');

        // Filters
        if ($request->filled('experience')) {
            $expFilters = (array) $request->input('experience');
            $jobQuery->whereIn('min_experience_years', $expFilters);
        }

        if ($request->filled('job_type')) {
            $jobTypes = (array) $request->input('job_type');
            $jobQuery->whereIn('job_type', $jobTypes);
        }

        if ($request->filled('salary')) {
            $salary = $request->input('salary');

            $minSalary = $salary['min'] ?? null;
            $maxSalary = $salary['max'] ?? null;

            if ($minSalary !== null) {
                $jobQuery->where('max_salary', '>=', $minSalary); // must offer at least this much
            }

            if ($maxSalary !== null) {
                $jobQuery->where('min_salary', '<=', $maxSalary); // must start no higher than this
            }
        }

        if ($request->filled('location')) {
            $location = $request->input('location');
            $jobQuery->where('job_location', 'like', "%{$location}%");
        }


        if ($request->filled('search')) {
            $jobQuery->where(function ($query) use ($searchTerm) {
                $query->where('job_title', 'like', "%{$searchTerm}%")
                    ->orWhereHas('skills', fn($q) => $q->where('skill_name', 'like', "%{$searchTerm}%"));
            });
        }
        if ($request->filled('sort_by')) {
            $sortOrder = $request->input('sort_by'); // Could be 'newest' or 'oldest'

            if ($sortOrder == 'oldest') {
                $jobQuery->oldest(); // Sort by oldest (ascending)
            } else {
                $jobQuery->latest(); // Sort by newest (descending)
            }
        } else {
            $jobQuery->latest(); // Default to sorting by newest if no sort is selected
        }

        // Get all jobs
        $jobs = $jobQuery->get();

        // Score jobs if user is authenticated
        if (Auth::check()) {
            $scoredJobs = app('App\Services\JobMatcher')->scoreJobs(Auth::user(), $jobs);
            $jobs = $scoredJobs->sortByDesc('match_score')->values(); // Sorted collection
        }

        // Manual pagination
        $perPage = 10;
        $page = (int) $request->input('page', 1);
        $paginatedJobs = $jobs->forPage($page, $perPage);

        // Format jobs
        $formattedJobs = $paginatedJobs->map(function ($job) {
            return [
                'id' => $job->id,
                'job_title' => $job->job_title,
                'user_id' => $job->user_id,
                'job_description' => $job->job_description,
                'job_location' => $job->job_location,
                'job_type' => $job->job_type,
                'created_at' => $job->created_at,
                'min_experience_years' => $job->min_experience_years,
                'degree_id' => $job->degree_id,
                'company' => $job->company,
                'match_score' => $job->match_score ?? null,
                'skills' => $job->skills->map(fn($skill) => [
                    'skill_id' => $skill->skill_id ?? $skill->pivot->skill_id ?? null,
                    'skill_name' => $skill->skill_name ?? $skill->pivot->skill_name ?? null,
                ]),
                'requirements' => $job->requirements->map(fn($req) => [
                    'requirement_id' => $req->requirement_id,
                    'requirement_name' => $req->requirement_name,
                ]),
            ];
        });

        // AJAX "Load More" JSON response
        if ($request->wantsJson()) {
            $totalJobs = $jobs->count();
            $lastPage = (int) ceil($totalJobs / $perPage);

            return response()->json([
                'jobs' => array_values($formattedJobs->toArray()),
                'meta' => [
                    'current_page' => $page,
                    'last_page' => $lastPage,
                    'total' => $totalJobs,
                    'per_page' => $perPage,
                ],
                'links' => [
                    'next' => $page < $lastPage ? $request->url() . '?' . http_build_query(array_merge($request->all(), ['page' => $page + 1])) : null,
                ]
            ]);
        }

        // Initial Inertia render
        return Inertia::render('FindWork', [
            'user' => Auth::user(),
            'jobs' => $formattedJobs,
            'filters' => $request->only(['experience', 'job_type', 'search', 'salary', 'location', 'sort_by']),
            'search' => $searchTerm,
            'hasMore' => $paginatedJobs->count() === $perPage,
            'currentPage' => $page,
        ]);
    }

    public function updateProfilePicture(Request $request)
    {
        $request->validate([
            'profile_picture' => ['required', 'image', 'max:2048'],
        ]);


        $user = $request->user();

        if ($request->hasFile('profile_picture')) {
            $file = $request->file('profile_picture');

            $uploadPath = Storage::disk('cloudinary')->putFile('/profile_pictures', $file);

            if ($user->profile_pic_public_id) {
                Storage::disk('cloudinary')->delete($user->profile_pic_public_id);
            }

            $url = Storage::disk('cloudinary')->url($uploadPath);
            $user->profile_pic_url = $url;
            $user->profile_pic_public_id = $uploadPath;

            $user->save();
        }

        return back();
    }
}
