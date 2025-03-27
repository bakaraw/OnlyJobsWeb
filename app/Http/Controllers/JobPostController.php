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
    public function index()
{
    $jobPosts = JobPost::with([
        'jobStatus',
        'educationLevel',
        'certificate',
        'skills'
    ])->get();

    return response()->json($jobPosts);
}

    public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'job_title' => 'required|string|max:255',
        'job_description' => 'required|string',
        'job_location' => 'required|string|max:255',
        'job_type' => 'required|string|max:255',
        'min_salary' => 'required|numeric|min:0',
        'max_salary' => 'required|numeric|min:0|gte:min_salary',
        'min_experience_years' => 'required|integer|min:0',
        'job_status_id' => 'nullable|exists:job_statuses,id',
        'education_id' => 'nullable|exists:education_levels,id',
        'certificate_id' => 'nullable|exists:certificates,id',
        'skills' => 'nullable|array',
        'skills.*' => 'exists:skills,id'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'errors' => $validator->errors()
        ], 422);
    }

    $jobPost = JobPost::create($request->except('skills'));

    // Attach skills if provided
    if ($request->has('skills')) {
        $jobPost->skills()->sync($request->input('skills'));
    }

    // Load relationships
    $jobPost->load([
        'jobStatus',
        'educationLevel',
        'certificate',
        'skills'
    ]);

    return response()->json($jobPost, 201);
}

    public function show($id)
{
    $jobPost = JobPost::with([
        'jobStatus',
        'educationLevel',
        'certificate',
        'skills'
    ])->findOrFail($id);

    return response()->json($jobPost);
}

    public function update(Request $request, $id)
{
    $jobPost = JobPost::findOrFail($id);

    $validator = Validator::make($request->all(), [
        'job_title' => 'sometimes|string|max:255',
        'job_description' => 'sometimes|string',
        'job_location' => 'sometimes|string|max:255',
        'job_type' => 'sometimes|string|max:255',
        'min_salary' => 'sometimes|numeric|min:0',
        'max_salary' => 'sometimes|numeric|min:0|gte:min_salary',
        'min_experience_years' => 'sometimes|integer|min:0',
        'job_status_id' => 'nullable|exists:job_statuses,id',
        'education_id' => 'nullable|exists:education_levels,id',
        'certificate_id' => 'nullable|exists:certificates,id',
        'skills' => 'nullable|array',
        'skills.*' => 'exists:skills,id'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'errors' => $validator->errors()
        ], 422);
    }

    $jobPost->update($request->except('skills'));

    // Sync skills if provided
    if ($request->has('skills')) {
        $jobPost->skills()->sync($request->input('skills'));
    }

    // Load relationships
    $jobPost->load([
        'jobStatus',
        'educationLevel',
        'certificate',
        'skills'
    ]);

    return response()->json($jobPost);
}

    public function destroy($id)
{
    $jobPost = JobPost::findOrFail($id);
    $jobPost->delete();

    return response()->json(null, 204);
}
}
