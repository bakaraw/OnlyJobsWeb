<?php

namespace App\Http\Controllers;

use App\Models\Certification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class CertificationController extends Controller
{
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'year' => 'nullable|integer|min:1900|max:' . date('Y'),
            'attached_file' => 'nullable|file|mimes:jpg,jpeg,png,mp4,pdf|max:10240',
        ]);

        if ($request->hasFile('attached_file')) {
            $file = $request->file('attached_file');

            $uploadPath = Storage::disk('cloudinary')->putFile('/user_certifications', $file);

            $url = Storage::disk('cloudinary')->url($uploadPath);

            $validated['file_url'] = $url;
            $validated['file_public_id'] = $uploadPath;
        }

        unset($validated['attached_file']);

        Auth::user()->certifications()->create($validated);

        return Redirect::back();
    }

    public function update(Request $request, Certification $certification): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'year' => 'nullable|integer|min:1900|max:' . date('Y'),
            'attached_file' => 'nullable|file|mimes:jpg,jpeg,png,mp4,pdf|max:10240',
        ]);

        if ($certification->user_id !== auth()->id()) {
            abort(403);
        }

        if ($request->hasFile('attached_file')) {
            if ($certification->file_public_id) {
                Storage::disk('cloudinary')->delete($certification->file_public_id);
            }

            $file = $request->file('attached_file');

            // Upload to Cloudinary
            $uploadedPath = Storage::disk('cloudinary')->putFile('/certifications/documents', $file);

            $validated['file_url'] = Storage::disk('cloudinary')->url($uploadedPath);
            $validated['file_public_id'] = $uploadedPath;
        }

        $certification->update($validated);

        return Redirect::back();
    }

    public function destroy(Certification $certification): RedirectResponse
    {
        if ($certification->user_id !== auth()->id()) {
            abort(403);
        }

        if ($certification->file_public_id) {
            // Call Cloudinary to delete the file using the public ID
            Storage::disk('cloudinary')->delete($certification->file_public_id);
        }

        $certification->delete();

        return Redirect::back()->with('success', 'Certification record deleted successfully');
    }
}
