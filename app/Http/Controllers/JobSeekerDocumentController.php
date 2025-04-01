<?php

namespace App\Http\Controllers;

use App\Models\JobSeekerDocument;
use Illuminate\Http\Request;

class JobSeekerDocumentController extends Controller
{
    public function index()
    {
        $documents = JobSeekerDocument::with('user')->latest()->get();
        return view('documents.index', compact('documents'));

    }

    public function create() {
        return view('documents.create');
    }

    public function store(Request $request)
    {

        $validated = $request->validate([
            'document_type'      => 'required|string|max:255',
            'file'               => 'required|file',
        ]);

        $filePath = $request->file('file')->store('documents', 'public');

        $validated['file_path'] = $filePath;
        $validated['user_id'] = auth()->id();

        JobSeekerDocument::create($validated);

        return redirect()->route('documents.index');


    }

    public function show($id) {
        $document = JobSeekerDocument::with('user')->findOrFail($id);
        return view('jobseekerdocument.show', compact('document'));
    }



}
