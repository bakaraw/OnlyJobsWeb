<?php

namespace App\Http\Controllers;

use App\Models\Certification;
use App\Models\Education;
use App\Models\JobPost;
use App\Models\skills;
use Illuminate\Http\Request;

class JobPostController extends Controller
{



    //post request gamita ni for UI
    public function store(Request $request) {

        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
                'message' => 'You must be logged in to post a job.'
            ], 401);
        }

        $validatedData = $request->validate([


            'job_title' => 'required|string|unique:job_post,job_title|regex:/^[a-zA-Z0-9\s\W]+$/',
            'job_description' => 'required|string|regex:/^[a-zA-Z0-9\s\W]+$/',
            'job_location' => 'required|string',
            'job_salary' => 'required|numeric',
            'job_type' => 'required|string',
            'min_Salary'=> 'required|numeric',
            'max_salary'=> 'required|numeric',
            'year_of_experience' => 'required|integer',
            'skill_id' => 'nullable|exists:skills,id',
            'job_post_certificate_id' => 'nullable|exists:certification,certificate_id',
            'education_id' => 'nullable|exists:education,education_id',
            'job_status' => 'nullable|string,id'


        ]);



        try {
            //201 kay http status code na succes
            //500 http error code
          $jobPost = JobPost::create($validatedData);


           if($request->filled(['skill_id', 'education_id', 'job_post_certificate_id', 'status_id'])) {
               //getting the name using ID of the table
               $find_skill = Skills::find($request->input('skill_id'));
               $skill_name = $find_skill ? $find_skill->skill_name : null;

               $find_certification = Certification::find($request->input('certification_id'));
               $certification_name = $find_certification ? $find_certification->certification_name : null;

               $find_education = Education::find($request->input('education_id'));
               $education_name = $find_education ? $find_education->education_name : null;

           }
            return response()->json($jobPost, 201);

        }catch (\Exception $exception){
            return response()->json(['message' => $exception->getMessage()], 500);

        }



    }

          //search method using gamit title
        public function index(Request $request) {
            $jobTitle = $request->input('job_title');
            $jobs = JobPost::where('job_title',$jobTitle)->get();
            return response()->json($jobs, 201);
        }

}
