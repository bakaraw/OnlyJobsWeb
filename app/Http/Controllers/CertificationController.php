<?php

namespace App\Http\Controllers;

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
            'description' => 'nullable|string|max:255',
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
}
