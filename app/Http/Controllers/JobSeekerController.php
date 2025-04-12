<?php

namespace App\Http\Controllers;

use App\Models\JobPost;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JobSeekerController extends Controller
{


    public function apply($jobPostId) {

        $user = Auth::user();

        if($user->appliedJobs()->where('job_post_id', $jobPostId)->exists()) {
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

        $authUser = auth()->user();
        if (!$authUser) {
            return  redirect()->route('login');
        }
        $jobview = JobPost::with([
            'skills:skill_id,skill_name',
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

        $authUser = auth()->user();

        return Inertia::render('JobView', [
            'jobview' => $jobview,
            'authUser' => $authUser,
        ]);
    }






    public function show()
    {
        $jobs = JobPost::select(
            'id',
            'job_title',
            'user_id',
            'job_description',
            'job_location',
            'job_type',
            'created_at',
            'min_experience_years',
            'degree_id',
            'company',


        )
            ->with([
                'skills' => function ($query) {
                    $query->select('skills.skill_id', 'skills.skill_name');
                },
                'requirements' => function ($query) {
                    $query->select('requirements.requirement_id', 'requirements.requirement_name');
                }
            ])
            ->get()

            ->toArray();


        return Inertia::render('FindWork', [
            'jobs' => $jobs,
        ]);

    }




}


