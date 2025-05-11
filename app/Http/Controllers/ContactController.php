<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;

class ContactController extends Controller
{
    //
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'email' => 'required|email',
            'message' => 'required|string',
        ]);

        Contact::create($validated);

        return response()->json(['message' => 'Message sent successfully']);
    }

    public function showMessages()
    {
        $contacts = Contact::all();
        return response()->json($contacts);
    }
}
