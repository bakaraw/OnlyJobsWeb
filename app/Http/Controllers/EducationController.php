<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
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
            'education_level' => ['required', Rule::in(['elementary', 'junior_high', 'senior_high', 'college'])],
            'school' => 'required|string|max:255',
            'degree' => 'nullable|string|max:255',
            'start_year' => 'nullable|integer|min:1900|max:' . date('Y'),
            'end_year' => 'nullable|integer|min:1900|max:' . date('Y') . '|gte:start_year',
            'attached_file' => 'nullable|string|max:2083',
        ]);

        Auth::user()->educations()->create($request->all());

        return Redirect::route('profile.edit')->with('success', 'Education updated successfully');
    }

    public function destroy(Request $request): RedirectResponse
    {
        return Redirect::back();
    }
}
