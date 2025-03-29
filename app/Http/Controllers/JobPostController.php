<?php

// Job Post Controller (app/Http/Controllers/JobPostController.php)
namespace App\Http\Controllers;

use App\Models\JobPost;
use App\Models\JobStatus;
use App\Models\Degree;
use App\Models\Certificate;
use App\Models\Skill;
use Illuminate\Http\Request;

class JobPostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $jobPosts = JobPost::with(['status', 'degree', 'certificate', 'skills'])->get();
        return view('job_posts.index', compact('jobPosts'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $statuses = JobStatus::all();
        $degrees = Degree::all();
        $certificates = Certificate::all();
        $skills = Skill::all();

        return view('job_posts.create', compact('statuses', 'degrees', 'certificates', 'skills'));
    }

    /**
     * Store a newly created resource in storage.
     */
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

        // Remove skills from the data to be used for JobPost creation
        $skillIds = $validatedData['skills'] ?? [];
        unset($validatedData['skills']);

        // Create the job post record.
        $jobPost = JobPost::create($validatedData);

        // Attach skills to the job post
        if (!empty($skillIds)) {
            $jobPost->skills()->attach($skillIds);
        }

        // Redirect back (or to an index) with a success message.
        return redirect()->route('job_posts.index')
            ->with('success', 'Job post created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $jobPost = JobPost::with(['status', 'degree', 'certificate', 'skills'])->findOrFail($id);
        return view('job_posts.show', compact('jobPost'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $jobPost = JobPost::with('skills')->findOrFail($id);
        $statuses = JobStatus::all();
        $degrees = Degree::all();
        $certificates = Certificate::all();
        $skills = Skill::all();

        return view('job_posts.edit', compact('jobPost', 'statuses', 'degrees', 'certificates', 'skills'));
    }

    /**
     * Update the specified resource in storage.
     */
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

        // Remove skills from the data to be used for JobPost update
        $skillIds = $validatedData['skills'] ?? [];
        unset($validatedData['skills']);

        // Update the job post
        $jobPost->update($validatedData);

        // Sync skills to the job post
        $jobPost->skills()->sync($skillIds);

        return redirect()->route('job_posts.index')
            ->with('success', 'Job post updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $jobPost = JobPost::findOrFail($id);
        $jobPost->delete();

        return redirect()->route('job_posts.index')
            ->with('success', 'Job post deleted successfully.');
    }
}
