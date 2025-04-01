<?php

namespace App\Http\Controllers;

use App\Models\JobPost;
use App\Models\Placement;
use App\Models\User;
use Illuminate\Http\Request;

class PlacementController extends Controller
{
    public function index()
    {
        $placements = Placement::with('jobPost', 'user')->latest()->get();

        return view('placement.index', compact('placements'));
    }

    public function create()
    {

        $jobPost = JobPost::all();
        $candidate = User::all();

        return view('placement.create');

    }

    public function store(Request $request) {

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'job_post_id' => 'required|exists:job_posts,id',
            'placement_status' => 'required|string|max:255',
            'date_placed' => 'required|date',
            'remarks' => 'nullabcle|string|max:255'
        ]);

        Placement::create($validated);

        return redirect()->route('placement.index');

    }

    public function show($id) {
        $placement = Placement::with('jobPost', 'user')->findOrFail($id);

        return view('placement.show', compact('placement'));
    }

    public function edit($id) {
        $placement = Placement::with('jobPost', 'user')->findOrFail($id);
        $jobPost = JobPost::all();
        $candidate = User::all();

        return view('placement.edit', compact('placement', 'jobPost', 'candidate'));

    }

    public function update(Request $request, $id) {
        $placement = Placement::findOrFail($id);
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'job_post_id' => 'required|exists:job_posts,id',
            'placement_status' => 'required|string|max:255',
            'date_placed' => 'required|date',
            'remarks' => 'nullable|string|max:255'
        ]);
        $placement->update($validated);

        return redirect()->route('placement.index')->with('success', 'Placement updated successfully.');
    }

    public function destroy($id) {
        $placement = Placement::findOrFail($id);
        $placement->delete();

        return redirect()->route('placement.index');

    }



}
