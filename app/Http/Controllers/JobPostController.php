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
    /**
     * Display the form for creating a new job post.
     */
    public function create()
    {
        $statuses = JobStatus::all();
        $degrees = Degree::all();
        $certificates = Certificate::all();
        $skills = Skill::all();

        // Return a Blade view (resources/views/job_posts/create.blade.php)
        return view('job_posts.create', compact('statuses', 'degrees', 'certificates', 'skills'));
    }

    /**
     * Store a newly created job post in storage.
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
            'skill_id'             => 'nullable|exists:skills,id'
        ]);

        // Create the job post record.
        $jobPost = JobPost::create($validatedData);

        // Redirect back (or to an index) with a success message.
        return redirect()->route('job_posts.index')
            ->with('success', 'Job post created successfully.');
    }

    /**
     * (Optional) Display a listing of job posts.
     */
    public function index()
    {
        $jobPosts = JobPost::with(['status', 'degree', 'certificate', 'skill'])->get();
        return view('job_posts.index', compact('jobPosts'));
    }
}
