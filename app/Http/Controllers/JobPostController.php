<?php

namespace App\Http\Controllers;

use App\Models\JobPost;
use App\Models\Skill;
use App\Models\Certificate;
use App\Models\Educations;
use App\Models\JobStatus;
use App\Models\Skills;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class JobPostController extends Controller
{
    /**
     * Show the form for creating a new job post
     */
    public function create()
    {
        // Fetch all options for dropdowns
        $skills = Skills::pluck('skill_name');
        $certificates = Certificate::pluck('certificate_name');
        $educations = Educations::pluck('school_name');
        $statuses = JobStatus::pluck('status_name');

            //add og return para sa view diri
        //return view('job-post.create', compact('skills', 'certificates', 'educations', 'statuses'));

    }

    /**
     * Store a newly created job post in storage
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'job_title' => 'required|string|max:255',
            'job_description' => 'required|string',
            'job_location' => 'required|string|max:255',
            'job_type' => 'required|string|max:100',
            'min_Salary' => 'required|numeric|min:0',
            'max_salary' => 'required|numeric|min:0|gte:min_Salary',
            'year_of_experience' => 'required|integer|min:0',

            // Custom validation sa model ni ha, dili sa database, same ra name sa function
            'skill_name' => [
                'nullable',
                function ($attribute, $value, $fail) {
                    if ($value && !Skills::where('skill_name', $value)->exists()) {
                        $fail("The selected skill does not exist.");
                    }
                }
            ],
            'certificate_name' => [
                'nullable',
                function ($attribute, $value, $fail) {
                    if ($value && !Certificate::where('certificate_name', $value)->exists()) {
                        $fail("The selected certificate does not exist.");
                    }
                }
            ],
            'school_name' => [
                'nullable',
                function ($attribute, $value, $fail) {
                    if ($value && !Educations::where('school_name', $value)->exists()) {
                        $fail("The selected education does not exist.");
                    }
                }
            ],
            'job_status' => [
                'nullable',
                function ($attribute, $value, $fail) {
                    if ($value && !JobStatus::where('status_name', $value)->exists()) {
                        $fail("The selected job status does not exist.");
                    }
                }
            ]
        ]);

        // If validation fails
        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        // Start a database transaction
        DB::beginTransaction();

        try {
            // Create the job post
            $jobPost = JobPost::create([
                'job_title' => $request->job_title,
                'job_description' => $request->job_description,
                'job_location' => $request->job_location,
                'job_type' => $request->job_type,
                'job_salary' => $request->min_Salary . ' - ' . $request->max_salary,
                'min_Salary' => $request->min_Salary,
                'max_salary' => $request->max_salary,
                'year_of_experience' => $request->year_of_experience,

                // Only add if they exist in their respective tables
                'skill_name' => $request->skill_name ?
                    (Skills::where('skill_name', $request->skill_name)->exists() ? $request->skill_name : null) : null,

                'certificate_name' => $request->certificate_name ?
                    (Certificate::where('certificate_name', $request->certificate_name)->exists() ? $request->certificate_name : null) : null,

                'school_name' => $request->school_name ?
                    (Educations::where('school_name', $request->school_name)->exists() ? $request->school_name : null) : null,

                'job_status' => $request->job_status ?
                    (JobStatus::where('status_name', $request->job_status)->exists() ? $request->job_status : null) : null
            ]);

            // Commit the transaction
            DB::commit();

            //wala pani route,
            return redirect()->route('route ni diri dapat')
                ->with('success', 'Job post created successfully.');

        } catch (\Exception $e) {
            // Rollback the transaction
            DB::rollBack();

            // Redirect back with error message
            return redirect()->back()
                ->with('error', 'Failed to create job post: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Optional: Method to list all job posts
     */
    public function index()
    {
        $jobPosts = JobPost::with(['skill', 'certificate', 'education', 'status'])->get();
        return view('job-post.index', compact('jobPosts'));
    }
}
