<?php

namespace App\Http\Controllers;

use App\Models\JobPost;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
        if (Auth::check()) {
            $user = Auth::user();

            // Start query
            $jobQuery = JobPost::with(['skills', 'requirements'])->latest();

            // Apply filters to query before fetching data
            if ($request->filled('experience')) {
                $expFilters = (array) $request->input('experience');
                $jobQuery->whereIn('min_experience_years', $expFilters);
            }

            if ($request->filled('job_type')) {
                $jobTypes = (array) $request->input('job_type');
                $jobQuery->whereIn('job_type', $jobTypes);
            }

            // Fetch filtered jobs
            $filteredJobs = $jobQuery->get();

            // Score the jobs
            $scoredJobs = app('App\Services\JobMatcher')->scoreJobs($user, $filteredJobs);

            // Take top 10 based on score
            $jobs = $scoredJobs->sortByDesc('match_score')->take(10)->values();
        } else {
            // Guest users just get the latest jobs
            $jobQuery = JobPost::with(['skills', 'requirements'])->latest();

            if ($request->filled('experience')) {
                $expFilters = (array) $request->input('experience');
                $jobQuery->whereIn('min_experience_years', $expFilters);
            }

            if ($request->filled('job_type')) {
                $jobTypes = (array) $request->input('job_type');
                $jobQuery->whereIn('job_type', $jobTypes);
            }

            // Fetch filtered jobs
            $jobs = $jobQuery->get()->take(10)->values();
        }

        // Format for frontend
        $formattedJobs = $jobs->map(function ($job) {
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

        return Inertia::render('FindWork', [
            'jobs' => $formattedJobs,
            'filters' => $request->only(['experience', 'job_type']),
        ]);
    }
}
