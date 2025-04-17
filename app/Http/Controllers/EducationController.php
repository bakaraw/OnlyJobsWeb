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
use Illuminate\Support\Facades\Storage;
use Illuminate\Contracts\Auth\MustVerifyEmail;


class EducationController extends Controller
{
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit');
    }
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'education_level' => ['required', Rule::in(['Elementary', 'High School', 'Undergraduate', 'Graduate', 'Vocational', 'Others'])],
            'school' => 'required|string|max:255',
            'degree' => 'nullable|string|max:255',
            'start_year' => 'nullable|integer|min:1900|max:' . date('Y'),
            'end_year' => 'nullable|integer|min:1900|max:' . date('Y') . '|gte:start_year',
            'attached_file' => 'nullable|file|mimes:jpg,jpeg,png,mp4,pdf|max:10240',
        ]);

        if ($request->hasFile('attached_file')) {
            $file = $request->file('attached_file');

            // Save to cloudinary disk
            $uploadedPath = Storage::disk('cloudinary')->putFile('/education_files/documents', $file);

            // Get full URL
            $url = Storage::disk('cloudinary')->url($uploadedPath);

            $validated['attached_file_url'] = $url;
            $validated['attached_file_public_id'] = $uploadedPath; // optional if you want to delete later
        }

        unset($validated['attached_file']);

        Auth::user()->educations()->create($validated);

        return redirect()->route('profile.edit')->with('success', 'Education updated successfully');
    }


    public function update(Request $request, Educations $education): RedirectResponse
    {
        // Validate the incoming request data
        $validated = $request->validate([
            'education_level' => ['required', Rule::in(['Elementary', 'High School', 'Undergraduate', 'Graduate', 'Vocational', 'Others'])],
            'school' => 'required|string|max:255',
            'degree' => 'nullable|string|max:255',
            'start_year' => 'nullable|integer',
            'end_year' => 'nullable|integer|gte:start_year',
            'attached_file' => 'nullable|file|mimes:jpg,jpeg,png,mp4,pdf|max:10240',
            'attached_file' => 'nullable|file|max:2048', // Accepts file input
        ]);

        // Ensure the education record belongs to the authenticated user
        if ($education->user_id !== auth()->id()) {
            abort(403);
        }

        // Handle file upload
        if ($request->hasFile('attached_file')) {
            if ($education->attached_file_public_id) {
                Storage::disk('cloudinary')->delete($education->attached_file_public_id);
            }

            $file = $request->file('attached_file');

            // Upload to Cloudinary
            $uploadedPath = Storage::disk('cloudinary')->putFile('/education_files/documents', $file);

            $validated['attached_file_url'] = Storage::disk('cloudinary')->url($uploadedPath);
            $validated['attached_file_public_id'] = $uploadedPath;
        }

        // Update the education record using validated data
        $education->update($validated);

        return Redirect::back()->with('success', 'Education updated.');
    }

    public function destroy(Educations $education): RedirectResponse
    {
        // Ensure the education record belongs to the authenticated user
        if ($education->user_id !== auth()->id()) {
            abort(403); // Forbidden if user is not the owner
        }

        if ($education->attached_file_public_id) {
            // Call Cloudinary to delete the file using the public ID
            Storage::disk('cloudinary')->delete($education->attached_file_public_id);
        }

        $education->delete();

        return Redirect::back()->with('success', 'Education record deleted successfully.');
    }
}
