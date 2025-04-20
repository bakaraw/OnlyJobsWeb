<?php

namespace App\Http\Controllers;

use App\Models\Requirement;
use Illuminate\Http\Request;

class RequirementController extends Controller
{


    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $requirement = new Requirement();
        $requirement->user_id = auth()->id();
        $requirement->title = $request->title;
        $requirement->description = $request->description;
        $requirement->save();

        return redirect()->back()->with('success', 'Requirement added!');
    }

}
