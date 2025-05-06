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
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rule;
use App\Models\Address;
use Illuminate\Support\Facades\DB;

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
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'suffix' => 'nullable|string|max:255',
            'birthdate' => 'required|date',
            'gender' => ['required', Rule::in(['male', 'female', 'others'])],
            'street' => 'required|string|max:255',
            'street2' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'postal_code' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'contact_number' => 'required|string|regex:/^[0-9+\-\s]+$/|max:20|unique:users',
            'email' => 'required|string|lowercase|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = DB::transaction(function () use ($validated) {
            // Create the address first
            $address = Address::create([
                'street' => $validated['street'],
                'street2' => $validated['street2'],
                'city' => $validated['city'],
                'province' => $validated['province'],
                'postal_code' => $validated['postal_code'],
                'country' => $validated['country'],
            ]);

            // Create the user and associate with the address
            $user = User::create([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'middle_name' => $validated['middle_name'] ?? null,
                'suffix' => $validated['suffix'] ?? null,
                'birthdate' => $validated['birthdate'],
                'gender' => $validated['gender'],
                'address_id' => $address->id,
                'contact_number' => $validated['contact_number'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            return $user;
        });

        /*$user->save();*/
        DB::afterCommit(fn() => event(new Registered($user)));

        // Log in the user
        Auth::login($user);

        event(new Registered($user));

        return redirect()->route('find_work');
    }
};
