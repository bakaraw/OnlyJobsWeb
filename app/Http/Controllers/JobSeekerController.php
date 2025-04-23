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

    public function show(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $page = $request->input('page', 1);

        if (Auth::check()) {
            $user = Auth::user();
            // If your JobMatcher returns a query or paginated collection, modify here accordingly
            $jobQuery = app('App\Services\JobMatcher')->getQuery($user);
        } else {
            $jobQuery = JobPost::with(['skills', 'requirements'])->latest();
        }

        // Apply filters server-side
        if ($request->filled('experience')) {
            $expFilters = $request->input('experience');
            if (!is_array($expFilters)) {
                $expFilters = [$expFilters];
            }
            $jobQuery = $jobQuery->whereIn('min_experience_years', $expFilters);
        }

        if ($request->filled('job_type')) {
            $jobTypes = $request->input('job_type');
            if (!is_array($jobTypes)) {
                $jobTypes = [$jobTypes];
            }
            $jobQuery = $jobQuery->whereIn('job_type', $jobTypes);
        }

        $paginated = $jobQuery->paginate($perPage, ['*'], 'page', $page);

        $formattedJobs = $paginated->getCollection()->map(function ($job) {
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
            'pagination' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'next_page_url' => $paginated->nextPageUrl(),
            ],
            'filters' => $request->only(['experience', 'job_type']),
        ]);
    }
}
