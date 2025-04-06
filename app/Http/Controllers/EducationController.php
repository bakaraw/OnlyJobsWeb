<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Educations;
use Illuminate\Contracts\Auth\MustVerifyEmail;


class EducationController extends Controller
{
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit');
    }
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'education_level' => ['required', Rule::in(['Elementary', 'High School', 'Undergraduate', 'Graduate', 'Vocational', 'Others'])],
            'school' => 'required|string|max:255',
            'degree' => 'nullable|string|max:255',
            'start_year' => 'nullable|integer|min:1900|max:' . date('Y'),
            'end_year' => 'nullable|integer|min:1900|max:' . date('Y') . '|gte:start_year',
            'attached_file' => 'nullable|string|max:2083',
        ]);

        Auth::user()->educations()->create($request->all());

        return Redirect::route('profile.edit')->with('success', 'Education updated successfully');
    }

    /*public function update(Request $request, Educations $educations): RedirectResponse*/
    /*{*/
    /*    $request->validate([*/
    /*        'education_level' => ['required', Rule::in(['elementery', 'junior_high', 'senior_high', 'college'])],*/
    /*        'school' => 'required|string|max:255',*/
    /*        'degree' => 'nullable|string|max:255',*/
    /*        'start_year' => 'nullable|integer|min:1900|max:' . date('Y'),*/
    /*        'end_year' => 'nullable|integer|min:1900|max:' . date('Y') . '|gte:start_year',*/
    /*        'attached_file' => 'nullable|string|max:2083',*/
    /*    ]);*/
    /**/
    /*    // Optional: Ensure the education belongs to the authenticated user*/
    /*    if ($educations->user_id !== auth()->id()) {*/
    /*        abort(403);*/
    /*    }*/
    /**/
    /*    $educations->update($request->all());*/
    /**/
    /*    return Redirect::back()->with('success', 'Education updated.');*/
    /*}*/
    public function update(Request $request, Educations $education): RedirectResponse
    {
        // Validate the incoming request data
        $request->validate([
            'education_level' => ['required', Rule::in(['Elementary', 'High School', 'Undergraduate', 'Graduate', 'Vocational', 'Others'])],
            'school' => 'required|string|max:255',
            'degree' => 'nullable|string|max:255',
            'start_year' => 'nullable|integer',
            'end_year' => 'nullable|integer|gte:start_year',  // Ensure end year is greater than or equal to start year
        ]);

        // Ensure the education record belongs to the authenticated user
        if ($education->user_id !== auth()->id()) {
            abort(403);  // Forbidden if user is not the owner of the education record
        }

        // Update the education record with the validated data
        $education->update($request->only([
            'education_level',
            'school',
            'degree',
            'start_year',
            'end_year',
        ]));

        // Redirect back with a success message
        /*return redirect()->route('education.edit')->with('success', 'Education updated successfully.');*/

        return Redirect::back()->with('success', 'Education updated.');
    }

    public function destroy(Educations $education): RedirectResponse
    {
        // Ensure the education record belongs to the authenticated user
        if ($education->user_id !== auth()->id()) {
            abort(403); // Forbidden if user is not the owner
        }

        $education->delete();

        return Redirect::back()->with('success', 'Education record deleted successfully.');
    }
}
