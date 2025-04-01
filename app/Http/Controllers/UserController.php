<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('documents', 'placement')->get();
        return view('users.index', compact('users'));
    }

    public function show(User $user)
    {
        return Inertia::render('UserProfile', [
            'user' => $user->load('address') // Load user with their address
        ]);
    }
}
