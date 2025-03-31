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
        $validatedData = $request->validate([
            'job_title'            => 'required|string|max:255',
            'job_description'      => 'required|string',
            'job_location'         => 'required|string|max:255',
            'job_type'             => 'required|string|max:255',
            'min_salary'           => 'required|numeric',
            'max_salary'           => 'required|numeric',
            'min_experience_years' => 'required|integer',
            'company'            => 'required|string|max:255',
            'status_id'            => 'nullable|exists:job_statuses,id',
            'degree_id'            => 'nullable|exists:degrees,id',
            'certificate_id'       => 'nullable|exists:certificates,id',
            'skills'               => 'nullable|array',
            'skills.*'             => 'exists:skills,skill_id'
        ]);

        $skillIds = $validatedData['skills'] ?? [];
        unset($validatedData['skills']);
        $validatedData['user_id'] = auth()->id();

        $jobPost = JobPost::create($validatedData);

        if (!empty($skillIds)) {
            $jobPost->skills()->attach($skillIds);
        }

        return redirect()->route('job_posts.create')
            ->with('success', 'Job post created successfully.');
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
            'certificate_id'       => 'nullable|exists:certificates,id',

            'skills'               => 'nullable|array',
            'skills.*'             => 'exists:skills,skill_id'
        ]);


        $skillIds = $validatedData['skills'] ?? [];
        unset($validatedData['skills']);

        $jobPost->update($validatedData);
        $jobPost->skills()->sync($skillIds);
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
            'company'
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


