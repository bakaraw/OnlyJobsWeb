<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
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
            'slot'                => 'nullable|integer',
            'remaining'                => 'nullable|integer|default:0',
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
        $validatedData['remaining'] = $validatedData['slot'] ?? 0; // Add this line

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
        'views'                => 'nullable',
        'slot'                => 'nullable| integer',
        'remaining'                => 'nullable|integer|default:0',

        'requirements'          => 'nullable|array',
        'requirements.*'        => 'exists:requirements,requirement_id',

        'skills'                => 'nullable|array',
        'skills.*.skill_id'     => 'present|string', // Changed to present|string instead of requiring it to exist
        'skills.*.skill_name'   => 'required|string|max:100'
    ]);

    $requirementIds = $validatedData['requirements'] ?? [];
    unset($validatedData['requirements']);

    $skillData = $validatedData['skills'] ?? [];
    unset($validatedData['skills']);

    $validatedData['remaining'] = $validatedData['slot'] ?? 0;
    $jobPost->update($validatedData);
    $jobPost->requirements()->sync($requirementIds);

    $jobPost->skills()->delete();

    foreach ($skillData as $skill) {
        try {
            $jobPost->skills()->create([
                'skill_id' => $skill['skill_id'], // Don't use null as default, use the provided value
                'skill_name' => $skill['skill_name']
            ]);
        } catch (\Exception $e) {
            \Log::error('Error creating skill:', [
                'skill' => $skill,
                'error' => $e->getMessage()
            ]);
        }
    }

    return response()->json(['success' => true, 'message' => 'Job updated successfully']);
}

    public function edit($id) {
        $editJob = JobPost::with(['skills', 'requirements', 'degree', 'status'])
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
                'remaining',
                'salary_type',
                'status_id',
                'degree_id',
                'user_id'
            )
            ->findOrFail($id);

        if ($editJob->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('JobDetails', [
            'editJob' => $editJob,
        ]);
    }


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

                'user:id,first_name,last_name,middle_name,suffix,email,contact_number,birthdate,gender,address_id,created_at',
                'user.address',
                'user.educations:id,user_id,education_level',
                'user.workHistories',
                'user.certifications',
                'user.userSkills.skill',
                'user.requirements',
                'jobPost',
                'jobPost.skills',
                'jobPost.requirements',
                'jobPost.status',
                'jobPost.degree',
                'address',



            ])





//            ->with([
//                'degrees:id,name',
//            ])
            ->get();

        $jobs = JobPost::select(
            'id',
            'job_title',
            'job_description',
            'job_location',
            'job_type',
            'created_at',
            'slot',
            'remaining',
            'company',
            'views',
            'status_id'
        )
            ->with([
                'applications' => function ($query) {
                    $query->select('id', 'job_post_id', 'status', 'remarks', 'created_at');
                },
                 'status'

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
                'userSkills.skill',
                'requirements'
            ])
            ->get();

        return $users;
    }

    public function getJobPostData()
    {
        $jobpostData = JobPost::with(['skills', 'requirements', 'degree', 'status'])
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
                'slot',
                'remaining',
                'views',
                'salary_type',
                'status_id',
                'degree_id',
            )
            ->get();


        return $jobpostData;
    }


    public function incrementJobViews($id)
    {
        $job = JobPost::findOrFail($id);
        $job->increment('views');

        return $job->fresh(['created_at']);
    }
    public function viewJobPost($id)
    {
        $job = $this->incrementJobViews($id);

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
                'slot',
                'remaining',
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


        $applicants = $job->applications;

        return Inertia::render('JobDetails', [
            'job_details' => $job,
            'applicants'   => $applicants,
        ]);
    }

    public function exportPdf($id)
    {
        $user = User::select(
            'id','first_name','last_name','middle_name','suffix',
            'email','contact_number','birthdate','gender','address_id'
        )
            ->with([
                'address',
                'applications',
                'applications.jobPost',
                'applications.jobPost.requirements',
                'requirements',
                'educations',
                'workHistories',
                'certifications',
                'userSkills.skill',
            ])
            ->findOrFail($id);

        $pdf = Pdf::loadView('pdf.applicant-details', ['user' => $user]);
        return $pdf->download('applicant-details.pdf');
    }
    public function exportPDFApplicant($id)
    {
        $user = User::with([
            'address',
            'applications',
            'applications.jobPost',
            'applications.jobPost.requirements',
            'requirements',
            'educations',
            'workHistories',
            'certifications',
            'userSkills.skill',
        ])->findOrFail($id);

        $pdf = Pdf::loadView('pdf.applicant-details', ['user' => $user]);
        return $pdf->download("applicant-{$id}-profile.pdf");
    }
    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status_id' => 'required|exists:job_statuses,id']);

        $job = JobPost::findOrFail($id);
        $job->status_id = $request->status_id;
        $job->save();

        return response()->json(['success' => true, 'job' => $job]);
    }




}
