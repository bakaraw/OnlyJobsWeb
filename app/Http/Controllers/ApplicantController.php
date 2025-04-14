<?php

namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ApplicantController extends Controller
{

    public function apply(Request $request)
    {
        $request->validate([
            'job_post_id' => 'required|integer',
            // add other validation if needed
        ]);

        $user = Auth::user();

        $application = Application::create([
            'user_id'     => $user->id,
            'job_post_id' => $request->job_post_id,
            'status'      => 'pending', // or a dynamic value if needed
            'remarks'     => $request->remarks,
        ]);

        return response()->json(['message' => 'Application submitted successfully', 'application' => $application]);
    }



    public function updateRemark(Request $request)
    {
        $request->validate([
            'application_id' => 'required|integer',
            'remarks' => 'nullable|string',
        ]);

        $application = Application::findOrFail($request->application_id);
        $application->update(['remarks' => $request->remarks]);

        return response()->json(['success' => true, 'message' => 'Remark updated successfully']);
    }

    public function qualifiedAccepted(Request $request)
    {
        $validated = $request->validate([
            'application_id' => 'required|integer',
        ]);

        $applicant = Application::findOrFail($validated['application_id']);

        if ($applicant->status == 'pending') {
            $applicant->status = 'qualified';
            $applicant->save();
            return response()->json(['success' => true, 'message' => 'Application submitted successfully']);
        }
        return response()->json(['success' => false, 'message' => 'Application already submitted']);
    }


    public function finalApplicant(Request $request) {
        $user = Auth::user();

        $user->appliedJobs()
            ->where('job_post_id', $request->job_post_id)
            ->where('user_id', $request->user_id)
            ->update(['accepted' => true]);
    }

    public function rejectApplicant(Request $request) {
        $user = Auth::user();

        $user->appliedJobs()
            ->where('job_post_id', $request->job_post_id)
            ->where('user_id', $request->user_id)
            ->update(['rejected' => true]);
    }

//
}

