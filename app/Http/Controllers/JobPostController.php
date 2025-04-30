<?php

namespace App\Http\Controllers;

use Illuminate\Validation\Rule;
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
use Illuminate\Support\Facades\Redirect;

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
            'salary_type'          => ['required', Rule::in(['Fixed', 'Range'])],
            'min_salary'           => 'required|numeric',
            'max_salary'           => 'nullable|numeric',
            'min_experience_years' => 'required|integer',
            'company'              => 'required|string|max:255',
            'status_id'            => 'nullable|exists:job_statuses,id',
            'degree_id'            => 'nullable|exists:degrees,id',
            'views'                => 'nullable|integer',
            'requirements'         => 'nullable|array',
            'requirements.*'       => 'exists:requirements,requirement_id',
            'skills'               => 'nullable|array',
            'skills.*.skill_id' => 'required',
            'skills.*.skill_name' => 'required',
            'custom_skills'        => 'nullable|array',
            'custom_skills.*'      => 'string|max:255',
            'custom_requirements'  => 'nullable|array',
            'custom_requirements.*' => 'string|max:255',
        ]);

        $requirementIds     = $validatedData['requirements'] ?? [];
        $skills             = $validatedData['skills'] ?? [];
        $customSkills       = $validatedData['custom_skills'] ?? [];
        $customRequirements = $validatedData['custom_requirements'] ?? [];

        unset(
            $validatedData['requirements'],
            $validatedData['skills'],
            $validatedData['custom_skills'],
            $validatedData['custom_requirements']
        );

        $validatedData['user_id'] = auth()->id();

        // Create the job post
        $jobPost = JobPost::create($validatedData);

        // Save existing skills using JobPostSkill
        foreach ($skills as $skill) {
            $jobPost->skills()->create([
                'skill_id'   => $skill['skill_id'],
                'skill_name' => $skill['skill_name']
            ]);
        }

        // Attach existing requirements
        if (!empty($requirementIds)) {
            $jobPost->requirements()->attach($requirementIds);
        }

        // Handle custom skills (create then attach via JobPostSkill)
        foreach ($customSkills as $customSkillName) {
            $newSkill = Skill::create(['skill_name' => $customSkillName]);
            $jobPost->skills()->create([
                'skill_id'   => $newSkill->skill_id,
                'skill_name' => $newSkill->skill_name
            ]);
        }

        // Handle custom requirements (create then attach)
        foreach ($customRequirements as $customRequirementName) {
            $newRequirement = Requirement::create(['requirement_name' => $customRequirementName]);
            $jobPost->requirements()->attach($newRequirement->requirement_id);
        }

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

    /*public function destroy($id)*/
    /*{*/
    /*    $jobPost = JobPost::findOrFail($id);*/
    /**/
    /**/
    /*    $jobPost->delete();*/
    /**/
    /*    return redirect()->route('dashboard')*/
    /*        ->with('success', 'Job post deleted successfully.');*/
    /*}*/

    /*public function destroy(JobPost $job)*/
    /*{*/
    /*    if (!$job) {*/
    /*        return response()->json(['error' => 'Job not found'], 404);*/
    /*    }*/
    /*    $job->delete();*/
    /*    return response()->json(['success' => 'Deleted Successfully']);*/
    /*}*/
    public function destroy($id)
    {
        $job = JobPost::find($id);

        if (!$job) {
            return response()->json(['error' => 'Job not found'], 404);
        }

        $job->delete();
        return response()->json(['success' => 'Deleted successfully']);
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


        $users = $this->getUsersData();
        $getJobPostData = $this->getJobPostData();

        return Inertia::render('dashboard', [
            'jobs' => $jobs,
            'applicants' => $applicants,
            'users' => $users,
            'auth' => [
                'user' => auth()->user(),
            ],
            'totalViews' => $totalViews,
            'totalApplicants' => $totalApplicants,
            'totalUsers' => $totalUsers,
            'totalJob' => $totalJob,

            'statuses' => JobStatus::all(),
            'degrees' => Degree::all(),
            'requirements' => Requirement::all(),
            'skills' => Skill::all(),
            'getJobPostData' => $getJobPostData,
        ]);
    }

    public function getUsersData()
    {
        $users = User::select(
            'id',
            'first_name',
            'last_name',
            'middle_name',
            'suffix',
            'email',
            'contact_number',
            'birthdate',
            'gender',
            'address_id',
            'created_at'
        )
            ->where('id', '!=', 1)
            ->with([
                'address',
                'applications' => function ($query) {
                    $query->select(
                        'id',
                        'user_id',
                        'job_post_id',
                        'status',
                        'remarks',
                        'created_at'
                    );
                },
                'applications.jobPost' => function ($query) {
                    $query->select(
                        'id',
                        'job_title',
                        'job_type',
                        'company'
                    );
                },

                'applications.jobPost.requirements', // Get job post requirements
                'requirements',   // Load user's own requirements
                'educations',     // Load user education history
                'workHistories',   // Load user work history
                'certifications',
                'userSkills.skill'
            ])
            ->get();

        return $users;
    }

    public function getJobPostData()
    {
        $jobpostData = JobPost::with([ 'skills','requirements' ,'degree', 'status'])
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
                'views',
                'salary_type',
                'status_id',
                'degree_id',
            )
            ->get();

        return $jobpostData;
    }
//    public function getJobPostData()
//    {
//        $jobpostData = JobPost::with([
//            'degree',
//        ])
//            ->select(
//                'id',               // always include the PK
//                'job_title',
//                'job_description',
//                'job_location',
//                'job_type',
//                'min_salary',
//                'max_salary',
//                'min_experience_years',
//                'company',
//                'views',
//                'salary_type',
//                'status_id',        // include FK for eager load
//                'degree_id',
//                'JobPostSkill.skill'
//            )
//            ->get();
//
//        return $jobpostData;
//    }
    public function viewJobPost($id)
    {
        $job = JobPost::with([
            'skills',
            'requirements:requirement_id,requirement_name',
            'degree',
            'status',
            'applications.user:id,first_name,last_name',
            'applications'
        ])
            ->select(
                'id',
                'job_title',
                'job_description',
                'job_location',
                'job_type',
                'salary_type',
                'min_salary',
                'max_salary',
                'min_experience_years',
                'company',
                'user_id',
                'status_id',
                'degree_id',
                'views',
                'created_at',
            )
            ->findOrFail($id);

        // Increment the view count
        $job->increment('views');

        // Pull out the applications as a top-level prop
        $applicants = $job->applications;

        return Inertia::render('JobDetails', [
            'job_details' => $job,
            'applicants'   => $applicants,
        ]);
    }
}
