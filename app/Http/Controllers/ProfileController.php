<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rule;
use App\Models\Address;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * Display the User's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = Auth::user()->load('address');
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'educations' => $user->educations,
            'work_histories' => $user->workHistories,
            'certifications' => $user->certifications,
            'user_skills' => $user->userSkills
        ]);
    }

    /**
     * Update the User's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        // Update user profile fields
        $request->user()->fill($validated);

        // If email is changed, mark it as unverified
        if ($request->has('email') && $request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        // Save user data
        $request->user()->save();

        // Update address if changed
        if ($request->has('street') || $request->has('city') || $request->has('province') || $request->has('postal_code') || $request->has('country')) {
            $address = $request->user()->address ?? new Address();
            $address->fill($request->only('street', 'street2', 'city', 'province', 'postal_code', 'country'));
            $address->id = $request->user()->address_id;  // assuming 'user_id' is the foreign key
            $address->save();
        }

        return Redirect::route('profile.edit')->with('success', 'Profile updated successfully.');
    }


    /**
     * Delete the User's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    public function show(Request $request)
    {
        return response()->json([
            'user' => $request->user()->load('address'), // Load user with address
        ]);
    }

    public function updateProfilePicture(Request $request)
    {
        $request->validate([
            'profile_picture' => ['required', 'image', 'max:2048'],
        ]);


        $user = $request->user();

        if ($request->hasFile('profile_picture')) {
            $file = $request->file('profile_picture');

            $uploadPath = Storage::disk('cloudinary')->putFile('/profile_pictures', $file);

            if ($user->profile_pic_public_id) {
                Storage::disk('cloudinary')->delete($user->profile_pic_public_id);
            }

            $url = Storage::disk('cloudinary')->url($uploadPath);
            $user->profile_pic_url = $url;
            $user->profile_pic_public_id = $uploadPath;

            $user->save();
        } else {
            return response()->json(['error' => 'No file received.'], 400);
        }

        return back();
    }
}
