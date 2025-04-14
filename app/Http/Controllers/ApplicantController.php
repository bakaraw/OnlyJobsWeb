<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ApplicantController extends Controller
{

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

}

