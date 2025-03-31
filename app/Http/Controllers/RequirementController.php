<?php

namespace App\Http\Controllers;

use App\Models\Requirement;
use Illuminate\Http\Request;

class RequirementController extends Controller
{
    public function index()
    {
        $requirements = Requirement::latest()->get();
        return view('requirements.index', compact('requirements'));
    }

    public function create()
    {
        return view('requirements.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'requirement_name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'validity_period' => 'required|date',
        ]);

        Requirement::create($validated);

        return redirect()->route('requirements.index');
    }

    public function show($id)
    {
        $requirement = Requirement::findOrFail($id);
        return view('requirement.show', compact('requirement'));
    }

    public function edit($id)
    {
        $requirement = Requirement::findOrFail($id);
        return view('requirement.edit', compact('requirement'));
    }

    public function update(Request $request, $id)
    {
        $requirement = Requirement::findOrFail($id);
        $validated = $request->validate([
            'requirement_name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'validity_period' => 'required|date',
        ]);

        $requirement->update($validated);

        return redirect()->route('requirement.index')->with('success', 'Requirement updated successfully.');
    }

    public function destroy($id)
    {
        $requirement = Requirement::findOrFail($id);
        $requirement->delete();

        return redirect()->route('requirements.index');
    }
}
