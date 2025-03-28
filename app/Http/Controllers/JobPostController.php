<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\JobPost;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class JobPostController extends Controller
{
    public function create()
    {
        $response = Http::get('http://universities.hipolabs.com/search', [
            'limit' => 100
        ]);

        $universities = $response->successful()
            ? collect($response->json())->pluck('name')
            : [];

        $certificates = Certificate::all();
        $skills = Skill::all();

        return Inertia::render('JobPostForm', [
            'universities' => $universities,
            'certificates' => $certificates,
            'skills' => $skills,
        ]);
    }
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
            'university_name' => 'nullable|string',
            'certificate_id' => 'nullable|exists:certificates,id',
            'skills' => 'nullable|array',
            'skills.*' => 'exists:skills,id',
        ]);

        $jobPost = JobPost::create($validatedData);

        if (!empty($request->skills)) {
            $jobPost->skills()->attach($request->skills);
        }



        return redirect()->route('job.create')->with('success', 'Job post created successfully!');
    }
}
