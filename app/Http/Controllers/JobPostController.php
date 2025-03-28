<?php

namespace App\Http\Controllers;

use App\Models\JobPost;
use App\Models\Certificate;
use App\Models\Education;
use App\Models\JobStatus;
use App\Models\Skills;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class JobPostController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'job_title' => 'required|string',
            'job_description' => 'required|string',
            'job_location' => 'required|string',
            'job_type' => 'required|string',
            'min_salary' => 'required|numeric',
            'max_salary' => 'required|numeric',
            'min_experience_years' => 'required|integer',
            'job_status_id' => 'nullable|exists:job_statuses,id',
            'education_id' => 'nullable|exists:education_levels,id',
            'certificate_id' => 'nullable|exists:certificates,id',
            'skills' => 'nullable|array',
            'skills.*' => 'exists:skills,id',
        ]);

        $jobPost = JobPost::create($validatedData);

        if (!empty($request->skills)) {
            $jobPost->skills()->attach($request->skills);
        }

        return response()->json([
            'message' => 'Job post created successfully!',
            'job_post' => $jobPost->load('skills', 'jobStatus', 'education', 'certificate'),
        ], 201);
    }
}
