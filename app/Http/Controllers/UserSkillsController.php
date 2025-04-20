<?php

namespace App\Http\Controllers;

use App\Models\UserSkill;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Auth;

class UserSkillsController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'skill_id' => 'required|string|max:255',
            'skill_name' => 'required|string|max:255'
        ]);

        Auth::user()->userSkills()->create($validated);

        return Redirect::back();
    }

    public function destroy(UserSkill $userSkill): RedirectResponse
    {
        if ($userSkill->user_id !== auth()->id()) {
            abort(403);
        }

        $userSkill->delete();

        return Redirect::back();
    }
}
