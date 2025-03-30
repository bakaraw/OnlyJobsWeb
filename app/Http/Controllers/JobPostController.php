<?php

namespace App\Http\Controllers;

use App\Models\JobPost;
use App\Models\JobStatus;
use App\Models\Degree;
use App\Models\Certificate;
use App\Models\Skill;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
    public function show()
    {
        $jobs = JobPost::select(
            'id',
            'job_title',
            'job_description',
            'job_location',
            'job_type',
            'created_at',
        )
        ->with(['skills' => function ($query) {
                $query->select('skills.skill_id', 'skills.skill_name');
            }])
            ->get()
            ->toArray();

        return Inertia::render('FindWork', [
            'jobs' => $jobs
        ]);

    }

}



//this is for authentication with id

//
//namespace App\Http\Controllers;
//
//use App\Models\Company;
//use App\Models\JobPost;
//use App\Models\JobStatus;
//use App\Models\Degree;
//use App\Models\Certificate;
//use App\Models\Skill;
//use Illuminate\Http\Request;
//use Illuminate\Support\Facades\Auth;
//
//class JobPostController extends Controller
//{
//    public function index()
//    {
//        $statuses = JobStatus::all();
//        $degrees = Degree::all();
//        $certificates = Certificate::all();
//        $skills = Skill::all();
//
//        return view('job_posts.create', compact('statuses', 'degrees', 'certificates', 'skills'));
//    }
//
//    public function create()
//    {
//        $statuses = JobStatus::all();
//        $degrees = Degree::all();
//        $certificates = Certificate::all();
//        $skills = Skill::all();
//
//        return view('job_posts.create', compact('statuses', 'degrees', 'certificates', 'skills'));
//    }
//
//    public function store(Request $request)
//    {
//        // Validate incoming data
//        $validatedData = $request->validate([
//            'job_title' => 'required|string|max:255',
//            'job_description' => 'required|string',
//            'job_location' => 'required|string|max:255',
//            'job_type' => 'required|string|max:255',
//            'min_salary' => 'required|numeric',
//            'max_salary' => 'required|numeric',
//            'min_experience_years' => 'required|integer',
//            'status_id' => 'nullable|exists:job_statuses,id',
//            'degree_id' => 'nullable|exists:degrees,id',
//            'certificate_id' => 'nullable|exists:certificates,id',
//            'skills' => 'nullable|array',
//            'skills.*' => 'exists:skills,skill_id'
//        ]);
//
//        // Get the company associated with the logged-in user
//        $company = Company::where('user_id', Auth::id())->first();
//        if (!$company) {
//            return redirect()->back()->with('error', 'Company not found.');
//        }
//
//        $skillIds = $validatedData['skills'] ?? [];
//        unset($validatedData['skills']);
//
//        // Add company_id when creating job post
//        $jobPost = JobPost::create(array_merge($validatedData, [
//            'company_id' => $company->company_id,
//        ]));
//
//        // Attach skills
//        if (!empty($skillIds)) {
//            $jobPost->skills()->attach($skillIds);
//        }
//
//        return redirect()->route('job_posts.index')->with('success', 'Job post created successfully.');
//    }
//
//    public function update(Request $request, $id)
//    {
//        $validatedData = $request->validate([
//            'job_title' => 'required|string|max:255',
//            'job_description' => 'required|string',
//            'job_location' => 'required|string|max:255',
//            'job_type' => 'required|string|max:255',
//            'min_salary' => 'required|numeric',
//            'max_salary' => 'required|numeric',
//            'min_experience_years' => 'required|integer',
//            'status_id' => 'nullable|exists:job_statuses,id',
//            'degree_id' => 'nullable|exists:degrees,id',
//            'certificate_id' => 'nullable|exists:certificates,id',
//            'skills' => 'nullable|array',
//            'skills.*' => 'exists:skills,skill_id'
//        ]);
//
//        $company = Company::where('user_id', Auth::id())->first();
//        if (!$company) {
//            return redirect()->back()->with('error', 'Company not found.');
//        }
//
//        $jobPost = JobPost::where('id', $id)->where('company_id', $company->company_id)->first();
//        if (!$jobPost) {
//            return redirect()->back()->with('error', 'Job post not found or unauthorized.');
//        }
//
//        $skillIds = $validatedData['skills'] ?? [];
//        unset($validatedData['skills']);
//
//        $jobPost->update($validatedData);
//        $jobPost->skills()->sync($skillIds);
//
//        return redirect()->route('job_posts.index')->with('success', 'Job post updated successfully.');
//    }
//
//    public function destroy($id)
//    {
//        $company = Company::where('user_id', Auth::id())->first();
//        if (!$company) {
//            return redirect()->back()->with('error', 'Company not found.');
//        }
//
//        $jobPost = JobPost::where('id', $id)->where('company_id', $company->company_id)->first();
//        if (!$jobPost) {
//            return redirect()->back()->with('error', 'Job post not found or unauthorized.');
//        }
//
//        $jobPost->delete();
//
//        return redirect()->route('job_posts.index')->with('success', 'Job post deleted successfully.');
//    }
//}
