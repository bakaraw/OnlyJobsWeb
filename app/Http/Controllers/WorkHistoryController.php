<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class WorkHistoryController extends Controller
{

    public function store(Request $request): RedirectResponse
    {

        $user = Auth::user();

        $validated = $request->validate([
            'job_title' => 'required|string|max:255',
            'job_description' => 'required|string',
            'employer' => 'required|string|max:255',
            'start_date' => 'nullable|date_format:Y-m',
            'end_date' => 'nullable|date_format:Y-m|after_or_equal:start_date',
        ]);

        if ($request->filled('start_date')) {
            $validated['start_date'] = Carbon::createFromFormat('Y-m', $request->start_date)->startOfMonth();
        }

        if ($request->filled('end_date')) {
            $validated['end_date'] = Carbon::createFromFormat('Y-m', $request->end_date)->startOfMonth();
        }

        $user->workHistories()->create($validated);

        return Redirect::back();
    }
}
