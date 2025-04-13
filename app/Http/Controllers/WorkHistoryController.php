<?php

namespace App\Http\Controllers;

use App\Models\WorkHistory;
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
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d|after_or_equal:start_date',
        ]);

        if ($request->filled('start_date')) {
            $validated['start_date'] = Carbon::createFromFormat('Y-m-d', $request->start_date)->startOfMonth();
        }

        if ($request->filled('end_date')) {
            $validated['end_date'] = Carbon::createFromFormat('Y-m-d', $request->end_date)->startOfMonth();
        }

        $user->workHistories()->create($validated);

        return Redirect::back();
    }

    public function update(Request $request, WorkHistory $workHistory): RedirectResponse
    {
        $validated = $request->validate([
            'job_title' => 'required|string|max:255',
            'job_description' => 'required|string',
            'employer' => 'required|string|max:255',
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d|after_or_equal:start_date',
        ]);

        if ($workHistory->user_id !== auth()->id()) {
            abort(403);
        }

        $workHistory->update($request->only([
            'job_title',
            'job_description',
            'employer',
            'start_date',
            'end_date'
        ]));

        return Redirect::back()->with('success', 'Work History Updated');
    }
}
