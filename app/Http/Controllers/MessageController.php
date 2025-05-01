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
        // Get the conversations for the authenticated user (only those with messages)
        $conversations = Conversation::where('user_id', $request->user()->id)->get();

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

        // Get the conversation
        $conversation = Conversation::findOrFail($conversationId);

        // Create a new message
        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $request->user()->id,
            'text' => $request->text,
        ]);

        return response()->json($message, 201);
    }

    // Method to create a new conversation (if it doesn't exist)
    public function createConversation(Request $request, $jobId)
    {
        // Ensure the job exists (and belongs to an admin)
        $job = JobPost::findOrFail($jobId);
        $admin = User::findOrFail($job->admin_id);

        // Check if a conversation already exists between this user and the admin for this job
        $existingConversation = Conversation::where('user_id', $request->user()->id)
            ->where('job_id', $jobId)
            ->first();

        if ($existingConversation) {
            return response()->json($existingConversation);
        }

        // Otherwise, create a new conversation
        $conversation = Conversation::create([
            'user_id' => $request->user()->id,
            'job_id' => $jobId,
        ]);

        return response()->json($conversation, 201);
    }
}
