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
            'custom_skills.*'      => 'string|max:255',

             'custom_requirements'        => 'nullable|array',
            'custom_requirements.*'      => 'string|max:255'
        ]);

        // Separate the arrays from validated data
        $requirementIds = $validatedData['requirements'] ?? [];
        $skillIds = $validatedData['skills'] ?? [];
        $customSkills = $validatedData['custom_skills'] ?? [];
        $customRequirements = $validatedData['custom_requirements'] ?? [];


        // Remove these fields from the validated data
        unset($validatedData['requirements'], $validatedData['skills'], $validatedData['custom_skills'], $validatedData['custom_requirements']);

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

        foreach ($customRequirements as $customRequirementName) {
            $newRequirement = Requirement::create(['requirement_name' => $customRequirementName]);
            $jobPost->requirements()->attach($newRequirement->requirement_id);
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



    public function destroy($id)
    {
        $jobPost = JobPost::findOrFail($id);


        $jobPost->delete();

        return redirect()->route('dashboard')
            ->with('success', 'Job post deleted successfully.');
    }







    public function showDashboard()
    {

        $totalViews = JobPost::sum('views');
        $totalUsers = User::count();
        $totalJob = JobPost::count();
        $totalApplicants = Application::count();


        $applicants = Application::select(
            'id',
            'user_id',
            'job_post_id',
            'status',
            'remarks',
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
        )
            ->with([
                'applications' => function ($query) {
                    $query->select('id', 'job_post_id', 'status', 'remarks', 'created_at');
                }
                ])
            ->withCount([
                'applications',
                'applications as pending_count' => function ($query) {
                    $query->where('status', 'pending');
                },
                'applications as qualified_count' => function ($query) {
                    $query->where('status', 'qualified');
                },
                'applications as accepted_count' => function ($query) {
                    $query->where('status', 'accepted');
                },
                'applications as rejected_count' => function ($query) {
                    $query->where('status', 'rejected');
                },
            ])
            ->get();


        return Inertia::render('dashboard', [
            'jobs' => $jobs,
            'applicants' => $applicants,
            'auth' => [
                'user' => auth()->user(),
            ],
            'totalViews' => $totalViews,
            'totalApplicants' =>$totalApplicants,
            'totalUsers' => $totalUsers,
            'totalJob' => $totalJob,
        ]);
    }


}


