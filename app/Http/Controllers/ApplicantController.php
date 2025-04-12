<?php

namespace App\Http\Controllers;

use App\Models\JobPost;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Educations;
use Illuminate\Support\Facades\Storage;
use Illuminate\Contracts\Auth\MustVerifyEmail;


class ApplicantController extends Controller
{

    public function pendingAccepted() {

        $user = Auth::user();

        $user->appliedJobs()->where('job_post_id', null)->update([
            'accepted' => true
        ])

    }



}

