<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\JobPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
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

        if ($applicant->status == 'Pending') {
            $applicant->status = 'Qualified';
            $applicant->save();
            return response()->json(['success' => true, 'message' => 'Application submitted successfully']);
        }
        return response()->json(['success' => false, 'message' => 'Application already submitted']);
    }


    public function finalApplicant(Request $request) {

            $validated = $request->validate([
                'application_id' => 'required|integer',
            ]);

            $applicant = Application::findOrFail($validated['application_id']);

            if ($applicant->status == 'Qualified') {
                $applicant->status = 'Accepted';
                $applicant->save();
                return response()->json(['success' => true, 'message' => 'Application submitted successfully']);
            }
            return response()->json(['success' => false, 'message' => 'Application already submitted']);

    }

    public function rejectApplicant(Request $request) {
        $user = Auth::user();

        $user->appliedJobs()
            ->where('job_post_id', $request->job_post_id)
            ->where('user_id', $request->user_id)
            ->update(['rejected' => true]);
    }

    public function pipeLineData(Request $request) {

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

