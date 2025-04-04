<?php

namespace App\Http\Controllers;

use App\Models\JobPost;
use App\Models\JobStatus;
use App\Models\Degree;
use App\Models\Placement;
use App\Models\Requirement;
use App\Models\Skill;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class JobPostController extends Controller
{

    public function index()
    {
        return Inertia::render('CreateJobPost', [
            'statuses' => JobStatus::all(),
            'degrees' => Degree::all(),
            'requirements' => Requirement::all(),
            'skills' => Skill::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('CreateJobPost', [
            'statuses' => JobStatus::all(),
            'degrees' => Degree::all(),
            'requirements' => Requirement::all(),
            'skills' => Skill::all(),
        ]);
    }


    public function store(Request $request)
    {
        // Validate input data
        $validatedData = $request->validate([
            'job_title'            => 'required|string|max:255',
            'job_description'      => 'required|string',
            'job_location'         => 'required|string|max:255',
            'job_type'             => 'required|string|max:255',
            'min_salary'           => 'required|numeric',
            'max_salary'           => 'required|numeric',
            'min_experience_years' => 'required|integer',
            'company'              => 'required|string|max:255',
            'status_id'            => 'nullable|exists:job_statuses,id',
            'degree_id'            => 'nullable|exists:degrees,id',
            'requirements'          => 'nullable|array',
            'requirements.*'        => 'exists:requirements,requirement_id',  // Validate requirement IDs
            'skills'               => 'nullable|array',
            'skills.*'             => 'exists:skills,skill_id'  // Validate skill IDs
        ]);

        // Extract and unset the `skills` and `requirements` fields
        $requirementIds = $validatedData['requirements'] ?? [];
        unset($validatedData['requirements']);

        $skillIds = $validatedData['skills'] ?? [];
        unset($validatedData['skills']);

        $validatedData['user_id'] = auth()->id();  // Add the user ID

        // Create a new job post
        $jobPost = JobPost::create($validatedData);

        // Attach skills and requirements if they exist
        if (!empty($skillIds)) {
            $jobPost->skills()->attach($skillIds);
        }
        if (!empty($requirementIds)) {
            $jobPost->requirements()->attach($requirementIds);
        }

        // Redirect or return a success message
        return Inertia::render('CreateJobPost')->with('success', 'Job post created successfully.');
    }



    public function update(Request $request, $id)
    {
        $jobPost = JobPost::findOrFail($id);

        if ($jobPost->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }
        $validatedData = $request->validate([
            'job_title'            => 'required|string|max:255',
            'job_description'      => 'required|string',
            'job_location'         => 'required|string|max:255',
            'job_type'             => 'required|string|max:255',
            'min_salary'           => 'required|numeric',
            'max_salary'           => 'required|numeric',
            'min_experience_years' => 'required|integer',
            'company'              => 'required|string|max:255',
            'status_id'            => 'nullable|exists:job_statuses,id',
            'degree_id'            => 'nullable|exists:degrees,id',

            'requirements'          => 'nullable|array',
            'requirements.*'        => 'exists:requirements,requirement_id',

            'skills'               => 'nullable|array',
            'skills.*'             => 'exists:skills,skill_id'
        ]);

        $requirementIds = $validatedData['requirements'] ?? [];
        unset($validatedData['requirements']);

        $skillIds = $validatedData['skills'] ?? [];
        unset($validatedData['skills']);

        $jobPost->update($validatedData);
        $jobPost->skills()->sync($skillIds);
        $jobPost->requirement()->sync($requirementIds);
    }


    public function destroy($id)
    {
        $jobPost = JobPost::findOrFail($id);

        if ($jobPost->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $jobPost->delete();

        return redirect()->route('job_posts.create')
            ->with('success', 'Job post deleted successfully.');
    }
    public function show()
    {
        $jobs = JobPost::select(
            'id',
            'job_title',
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
            'jobs' => $jobs
        ]);

    }

    public function showDashboard()
    {
        $placements = Placement::select(
            'id',
            'user_id',
            'job_post_id',
            'placement_status',
            'date_placed',
            'additional_remarks'
        )
            ->with([
                'user:id,first_name', // Eager load user with only 'id' and 'first_name'
                'jobPost:id,job_title' // Eager load job post with only 'id' and 'job_title'
            ])
            ->get();

        // Fetch job posts for the dashboard
        $jobs = JobPost::select(
            'id',
            'job_title',
            'job_description',
            'job_location',
            'job_type',
            'created_at',
            'company'
        )->get();

        // Returning both jobs and placements to the frontend
        return Inertia::render('dashboard', [
            'jobs' => $jobs,       // Pass jobs to the frontend
            'placements' => $placements,  // Pass placements to the frontend
        ]);
    }
}


