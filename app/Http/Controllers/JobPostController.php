<?php

namespace App\Http\Controllers;

use App\Models\JobPost;
use App\Models\JobStatus;
use App\Models\Degree;
use App\Models\Certificate;
use App\Models\Skill;
use Illuminate\Http\Request;

class JobPostController extends Controller
{

    public function index()
    {
        $statuses = JobStatus::all();
        $degrees = Degree::all();
        $certificates = Certificate::all();
        $skills = Skill::all();

        return view('job_posts.create', compact('statuses', 'degrees', 'certificates', 'skills'));
    }


    public function create()
    {
        $statuses     = JobStatus::all();
        $degrees      = Degree::all();
        $certificates = Certificate::all();
        $skills       = Skill::all();

        return view('job_posts.create', compact('statuses', 'degrees', 'certificates', 'skills'));
    }


    public function store(Request $request)
    {
        // Validate incoming data.
        $validatedData = $request->validate([
            'job_title'            => 'required|string|max:255',
            'job_description'      => 'required|string',
            'job_location'         => 'required|string|max:255',
            'job_type'             => 'required|string|max:255',
            'min_salary'           => 'required|numeric',
            'max_salary'           => 'required|numeric',
            'min_experience_years' => 'required|integer',
            'status_id'            => 'nullable|exists:job_statuses,id',
            'degree_id'            => 'nullable|exists:degrees,id',
            'certificate_id'       => 'nullable|exists:certificates,id',

            'skills'               => 'nullable|array',
            'skills.*'             => 'exists:skills,skill_id'
        ]);

        $skillIds = $validatedData['skills'] ?? [];
        unset($validatedData['skills']);

        $jobPost = JobPost::create($validatedData);

        // mao ni ang pag attach sa skills sa as a seperate tables
        if (!empty($skillIds)) {
            $jobPost->skills()->attach($skillIds);
        }

        return redirect()->route('job_posts.create')
            ->with('success', 'Job post created successfully.');
    }


    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'job_title'            => 'required|string|max:255',
            'job_description'      => 'required|string',
            'job_location'         => 'required|string|max:255',
            'job_type'             => 'required|string|max:255',
            'min_salary'           => 'required|numeric',
            'max_salary'           => 'required|numeric',
            'min_experience_years' => 'required|integer',
            'status_id'            => 'nullable|exists:job_statuses,id',
            'degree_id'            => 'nullable|exists:degrees,id',
            'certificate_id'       => 'nullable|exists:certificates,id',

            'skills'               => 'nullable|array',
            'skills.*'             => 'exists:skills,skill_id'
        ]);

        $jobPost = JobPost::findOrFail($id);

        $skillIds = $validatedData['skills'] ?? [];
        unset($validatedData['skills']);

        $jobPost->update($validatedData);
        $jobPost->skills()->sync($skillIds);
    }


    public function destroy($id)
    {
        $jobPost = JobPost::findOrFail($id);
        $jobPost->delete();
    }
}
