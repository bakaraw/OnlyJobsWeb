<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\JobPost;
use App\Models\JobStatus;
use App\Models\Degree;
use App\Models\Placement;
use App\Models\Requirement;
use App\Models\Skill;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PHPUnit\Util\PHP\Job;
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
            'views'                => 'nullable|integer',
            'requirements'         => 'nullable|array',
            'requirements.*'       => 'exists:requirements,requirement_id',
            'skills'               => 'nullable|array',
            'skills.*'             => 'exists:skills,skill_id',
            'custom_skills'        => 'nullable|array',
            'custom_skills.*'      => 'string|max:255'
        ]);

        // Separate the arrays from validated data
        $requirementIds = $validatedData['requirements'] ?? [];
        $skillIds = $validatedData['skills'] ?? [];
        $customSkills = $validatedData['custom_skills'] ?? [];

        // Remove these fields from the validated data
        unset($validatedData['requirements'], $validatedData['skills'], $validatedData['custom_skills']);

        // Add the user_id to the validated data
        $validatedData['user_id'] = auth()->id();

        // Create the job post
        $jobPost = JobPost::create($validatedData);

        // Attach skills to the job post
        if (!empty($skillIds)) {
            $jobPost->skills()->attach($skillIds);
        }

        // Attach requirements to the job post
        if (!empty($requirementIds)) {
            $jobPost->requirements()->attach($requirementIds);
        }

        // Create and attach custom skills
        foreach ($customSkills as $customSkillName) {
            $newSkill = Skill::create(['skill_name' => $customSkillName]);
            $jobPost->skills()->attach($newSkill->skill_id);
        }

        // Redirect or return success message
        return redirect()->route('dashboard')->with('success', 'Job post created successfully.');
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
            'views',

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


    public function JobView($id)
    {
        $jobview = JobPost::with([
            'skills:skill_id,skill_name',
            'requirements:requirement_id,requirement_name',
            'degree',
            'status',
        ])
            ->select(
                'id',
                'job_title',
                'job_description',
                'job_location',
                'job_type',
                'min_salary',
                'max_salary',
                'min_experience_years',
                'company',
                'user_id',
                'status_id',
                'degree_id',
                'created_at'
            )
            ->findOrFail($id);

        return Inertia::render('JobView', [
            'jobview' => $jobview
        ]);
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
            'user_id',
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
            'jobs' => $jobs,
        ]);

    }


    public function showDashboard()
    {
        $totalViews = JobPost::sum('views');
        $totalUsers = User::count();
        $totalJob = JobPost::count();

        $applicants = Application::select(
            'id',
            'user_id',
            'job_post_id',
            'status',
            'created_at',
        )
            ->with([
                'user:id,first_name',
                'jobPost:id,job_title'
            ])
            ->get();

        $jobs = JobPost::select(
            'id',
            'job_title',
            'job_description',
            'job_location',
            'job_type',
            'created_at',
            'company',
            'views',
        )->get();



        return Inertia::render('dashboard', [
            'jobs' => $jobs,
            'applicants' => $applicants,


            'totalViews' => $totalUsers,
            'totalUsers' => $totalViews,
            'totalJob' => $totalJob,
        ]);
    }


}


