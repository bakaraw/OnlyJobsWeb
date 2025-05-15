<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\JobPost;
use Illuminate\Http\Request;
use App\Models\User;
use App\Notifications\ApplicantAccepted;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Notifications\ApplicantQualified;
use App\Notifications\ApplicantRejected;
use App\Notifications\ApplicantRemarks;

class ApplicantController extends Controller
{

    //    public function apply(Request $request)
    //    {
    //        $request->validate([
    //            'job_post_id' => 'required|integer',
    //            // add other validation if needed
    //        ]);
    //
    //        $user = Auth::user();
    //
    //        $application = Application::create([
    //            'user_id'     => $user->id,
    //            'job_post_id' => $request->job_post_id,
    //            'status'      => 'pending', // or a dynamic value if needed
    //            'remarks'     => $request->remarks,
    //        ]);
    //
    //        return response()->json(['message' => 'Application submitted successfully', 'application' => $application]);
    //    }

    public function rejectApplicant(Request $request)
    {
        $validated = $request->validate([
            'application_id' => 'required|integer',
        ]);

        $applicant = Application::with('user', 'jobPost')->findOrFail($validated['application_id']);

        if ($applicant->status !== 'Reject') {
            $applicant->status = 'Reject';
            $applicant->save();


            $applicant->user->notify(
                new ApplicantRejected($applicant->jobPost)
            );

            return response()->json(['success' => true, 'message' => 'Application rejected successfully']);
        }

        return response()->json(['success' => false, 'message' => 'Application already rejected']);
    }
    public function getApplicantDetails($applicationId)
    {
        try {
            $application = Application::findOrFail($applicationId);
            $applicant = User::with([
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
                'educations',
                'workHistories',
                'certifications',
                'userSkills.skill',
                'requirements'
            ])->findOrFail($application->user_id);

            // Format response to match expected structure in DocumentViewModal
            $formattedApplicant = [
                'id' => $applicant->id,
                'first_name' => $applicant->first_name,
                'last_name' => $applicant->last_name,
                'email' => $applicant->email,
                'phone' => $applicant->phone,
                'address' => $applicant->address,
                // Map values to match expected keys in frontend
                'user_skills' => $applicant->userSkills,
                'educations' => $applicant->educations,
                'work_histories' => $applicant->workHistories,
                'certifications' => $applicant->certifications,
                'applications' => $applicant->applications,
                'requirements' => $applicant->requirements
            ];

            return response()->json([
                'success' => true,
                'applicant' => $formattedApplicant,
                'application' => $application
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load applicant details: ' . $e->getMessage()
            ], 404);
        }
    }
    public function show($id)
    {
        $application = \App\Models\Application::with([
            'user',
            'user.educations',

            'user.workHistories',
            'user.certifications',
            'user.userSkills.skill',
            'jobPost',
            'jobPost.skills',
            'jobPost.requirements',
            'jobPost.degree'
        ])->findOrFail($id);

        return Inertia::render('ApplicantDetails', [
            'application' => $application
        ]);
    }
    public function updateRemark(Request $request)
    {
        $request->validate([
            'application_id' => 'required|integer',
            'remarks' => 'nullable|string',
        ]);

        $application = Application::findOrFail($request->application_id);
        $application->update(['remarks' => $request->remarks]);

        $application->user->notify(
            new ApplicantRemarks($application->jobPost, $request->remarks)
        );

        return response()->json(['success' => true, 'message' => 'Remark updated successfully']);
    }

    /*public function qualifiedAccepted(Request $request)*/
    /*{*/
    /*    $validated = $request->validate([*/
    /*        'application_id' => 'required|integer',*/
    /*    ]);*/
    /**/
    /*    $applicant = Application::findOrFail($validated['application_id']);*/
    /**/
    /*    if ($applicant->status == 'Pending') {*/
    /*        $applicant->status = 'Qualified';*/
    /*        $applicant->save();*/
    /*        return response()->json(['success' => true, 'message' => 'Application submitted successfully']);*/
    /*    }*/
    /**/
    /*    return response()->json(['success' => false, 'message' => 'Application already submitted']);*/
    /*}*/
    public function qualifiedAccepted(Request $request)
    {
        $validated = $request->validate([
            'application_id' => 'required|integer',
        ]);

        $applicant = Application::with('user', 'jobPost')->findOrFail($validated['application_id']);
        /*$applicant = Application::findOrFail($validated['application_id']);*/

        if ($applicant->status == 'Pending') {
            $applicant->status = 'Qualified';
            $applicant->save();

            // Broadcast the notification to the user
            $applicant->user->notify(
                new ApplicantQualified($applicant->jobPost)
            );

            return response()->json([
                'success' => true,
                'message' => 'Application marked as qualified and notification sent.'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Application already processed.'
        ]);
    }


    public function finalApplicant(Request $request)
    {

        $validated = $request->validate([
            'application_id' => 'required|integer',
        ]);

        $applicant = Application::with('user', 'jobPost')->findOrFail($validated['application_id']);

        if ($applicant->status == 'Qualified') {
            $applicant->status = 'Accepted';
            $applicant->save();

            $jobPost = $applicant->jobPost;
            $jobPost->decrement('remaining');

            $applicant->user->notify(
                new ApplicantAccepted($applicant->jobPost)
            );

            return response()->json(['success' => true, 'message' => 'Application submitted successfully']);
        }
        return response()->json(['success' => false, 'message' => 'Application already submitted']);
    }



    public function pipeLineData(Request $request)
    {

        $pipeline = [
            'total' => Application::count(),
            'pending' => Application::where('status', 'Pending')->count(),
            'qualified' => Application::where('status', 'Qualified')->count(),
            'accepted' => Application::where('status', 'Accepted')->count(),
            'rejected' => Application::where('status', 'Rejected')->count(),
        ];

        if ($pipeline['total'] > 0) {
            $pipeline['pending_percentage'] = round(($pipeline['pending'] / $pipeline['total']) * 100);
            $pipeline['qualified_percentage'] = round(($pipeline['qualified'] / $pipeline['total']) * 100);
            $pipeline['accepted_percentage'] = round(($pipeline['accepted'] / $pipeline['total']) * 100);
            $pipeline['rejected_percentage'] = round(($pipeline['rejected'] / $pipeline['total']) * 100);
        }
        return response()->json(['pipeline' => $pipeline]);
    }




    //
}
