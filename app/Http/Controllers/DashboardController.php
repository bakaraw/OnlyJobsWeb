<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function jobseeker()
    {
        return Inertia::render('JobSeekerDashboard', [
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }

    public function company()
    {
        return Inertia::render('CompanyDashboard', [
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }
}
