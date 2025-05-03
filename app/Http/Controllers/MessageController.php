<?php

// app/Http/Controllers/MessageController.php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use App\Models\JobPost;
use App\Models\User;

class MessageController extends Controller
{
    public function getConversations(Request $request)
    {
        $conversations = Conversation::with('job')  // Eager load job relationship
            ->where('user_id', $request->user()->id)  // Example filter for current user
            ->get();

        return response()->json($conversations);
    }

    public function getMessages($conversationId)
    {
        // Get all messages in a conversation
        $messages = Message::where('conversation_id', $conversationId)->get();

        return response()->json($messages);
    }

    public function sendMessage(Request $request, $conversationId)
    {
        // Validate the request data
        $request->validate([
            'text' => 'required|string',
        ]);

        // Get the conversation or fail with 404
        $conversation = Conversation::findOrFail($conversationId);

        // Optional: Check if the user is a participant of the conversation
        // (assuming you have such logic)
        // if (!$conversation->participants->contains($request->user()->id)) {
        //     return response()->json(['error' => 'Unauthorized'], 403);
        // }

        // Create a new message
        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $request->user()->id,  // This requires authentication middleware
            'text' => $request->text,
        ]);

        return response()->json($message, 201);
    }

    // Method to create a new conversation (if it doesn't exist)
    public function createConversation(Request $request, $jobId)
    {
        // Ensure the job exists
        $job = JobPost::findOrFail($jobId);

        // Check if a conversation already exists between this user and the admin for this job
        $existingConversation = Conversation::where('user_id', $request->user()->id)
            ->where('job_id', $jobId)
            ->first();

        if ($existingConversation) {
            // If a conversation exists, return it
            return response()->json($existingConversation);
        }

        // Otherwise, create a new conversation
        $conversation = Conversation::create([
            'user_id' => $request->user()->id, // Associate the conversation with the logged-in user
            'job_id' => $jobId, // Associate the conversation with the job
        ]);

        // Return the created conversation with a 201 status
        return response()->json($conversation, 201);
    }

    public function show($id)
    {
        $conversation = Conversation::with(['job', 'messages'])->find($id);

        if (!$conversation) {
            return response()->json(['error' => 'Conversation not found'], 404);
        }

        return response()->json($conversation);
    }
}
