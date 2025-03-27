<?php

namespace App\Http\Controllers;

use App\Models\Certification;
use App\Models\Education;
use App\Models\JobPost;
use App\Models\skills;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class JobPostController extends Controller
{



    //post request gamita ni for UI
    public function store(Request $request) {
        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'You must be logged in to post a job.'
            ], 401);
        }

        $validatedData = $request->validate([
            'job_id' => 'required',
            'job_title' => 'required|string|unique:job_post,job_title|regex:/^[a-zA-Z0-9\s\W]+$/',
            'job_description' => 'required|string|regex:/^[a-zA-Z0-9\s\W]+$/',
            'job_location' => 'required|string',
            'job_salary' => 'required|numeric',
            'job_type' => 'required|string',
            'min_Salary'=> 'required|numeric',
            'max_salary'=> 'required|numeric',
            'year_of_experience' => 'required|integer',
            'skill_id' => 'nullable|array',   // ✅ Fix: Accepts multiple skill IDs
            'job_post_certificate_id' => 'nullable|exists:certification,certificate_id',
            'education_id' => 'nullable|exists:education,education_id',
            'job_status' => 'nullable|string'
        ]);

        try {
            $jobPost = JobPost::create($validatedData);

            if ($request->has('skill_id')) {
                $jobPost->skills()->attach($request->input('skill_id'));  // Insert into skill_required
            }

            return response()->json([
                'success' => true,
                'job_post' => $jobPost->load('skills')  // Ensure skills are returned
            ], 201);

        } catch (\Exception $exception) {
            return response()->json(['message' => $exception->getMessage()], 500);
        }
    }
}
dd(JobPost::with('skills')->find(4));
