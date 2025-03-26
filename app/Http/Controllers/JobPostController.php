<?php

namespace App\Http\Controllers;

use App\Models\JobPost;
use Illuminate\Http\Request;

class JobPostController extends Controller
{
    public function store(Request $request) {
        $request->validate([
            'job_title' => 'required|string|unique:job_post,job_title|regex:/^[a-zA-Z0-9\s\W]+$/',
            'job_description' => 'required|string|regex:/^[a-zA-Z0-9\s\W]+$/',
            'job_location' => 'required|string',
            'job_salary' => 'required|decimal',
            'job_type' => 'required|string',
            'min_Salary'=> 'required|decimal',
            'max_salary'=> 'required|decimal',
            'year_of_experience' => 'required|integer',
            'skill_id' => 'nullable|exists:skills,id',
            'job_post_certificate_id' => 'nullable|exists:certifications,id',
            'education_id' => 'nullable|exists:educations,id',
            'job_status' => 'nullable|string,id'
        ]);

        $jobPost = JobPost::create($request->all());

        return response()->json($jobPost, 201);
    }
    }
