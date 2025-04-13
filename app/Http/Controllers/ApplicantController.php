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

        // Create a new application record with the desired status
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

//        // Optionally, ensure the authenticated user owns this application
//        if ($application->user_id !== Auth::id()) {
//            return response()->json(['message' => 'Unauthorized'], 403);
//        }

        $application->update(['remarks' => $request->remarks]);

        return response()->json(['success' => true, 'message' => 'Remark updated successfully']);
    }

    public function qualifiedAccepted(Request $request) {
        $user = Auth::user();

        $user->appliedJobs()
            ->where('job_post_id', $request->job_post_id)
            ->where('user_id', $request->user_id)
            ->update(['qualified' => true]);
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

//    public function updateRemark(Request $request)
//    {
//        $request->validate([
//            'job_post_id' => 'required|integer',
//            'user_id' => 'required|integer',
//            'remarks' => 'nullable|string',
//        ]);
//
//        $user = Auth::user();
//
//        $job = $user->appliedJobs()
//            ->where('job_post_id', $request->job_post_id)
//            ->where('user_id', $request->user_id)
//            ->first();
//
//        if ($job) {
//            $user->appliedJobs()
//                ->where('job_post_id', $request->job_post_id)
//                ->where('user_id', $request->user_id)
//                ->update(['remarks' => $request->remarks]);
//
//            return response()->json(['message' => 'Remark updated successfully']);
//        } else {
//            return response()->json(['message' => 'Application not found'], 404);
//        }
//    }
}

