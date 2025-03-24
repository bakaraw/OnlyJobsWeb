<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\JobSeeker;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'account_type' => 'required|in:jobseeker,company',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'account_type' => $request->account_type,
        ]);

        // Store JobSeeker or Company data
        if ($request->account_type === 'jobseeker') {
            $jobSeeker = JobSeeker::create([
                'jobSeeker_name' => $user->name,
                'jobSeeker_email' => $user->email,
                'jobSeeker_phone' => $request->phone ?? null,
                'jobSeeker_address' => $request->address ?? null,
                'user_id' => $user->id,
            ]);
            $user->account_id = $jobSeeker->id;
        } elseif ($request->account_type === 'company') {
            $company = Company::create([
                'company_name' => $user->name,
                'company_email' => $user->email,
                'company_phone' => $request->phone ?? null,
                'company_address' => $request->address ?? null,
                'user_id' => $user->id,
            ]);
            $user->account_id = $company->id;
        }

        $user->save();

        event(new Registered($user));

        Auth::login($user); // Ensure the user is logged in

        // ✅ Redirect based on user type
        return redirect()->route($user->account_type === 'jobseeker' ? 'jobseeker.dashboard' : 'company.dashboard');
    }
};
