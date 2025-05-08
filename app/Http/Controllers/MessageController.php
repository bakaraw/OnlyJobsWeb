<?php

// app/Http/Controllers/MessageController.php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use App\Models\JobPost;
use App\Events\MessageSent;
use Illuminate\Support\Facades\Log;
use App\Models\User;

class MessageController extends Controller
{
    public function getConversations(Request $request)
    {
        if ($request->user()->id == 1) {
            // Admin sees all conversations
            $conversations = Conversation::with(['job', 'messages'])->has('messages')->get();
        } else {
            // Regular user sees only their own
            $conversations = Conversation::with(['job', 'messages'])
                ->where('user_id', $request->user()->id)
                ->has('messages')
                ->get();
        }

        return response()->json($conversations);
    }

    public function getMessages($conversationId)
    {
        // Get all messages in a conversation
        $messages = Message::where('conversation_id', $conversationId)->get();

        return response()->json($messages);
    }

    /*public function sendMessage(Request $request, $conversationId)*/
    /*{*/
    /*    // Validate the request data*/
    /*    $request->validate([*/
    /*        'text' => 'required|string',*/
    /*    ]);*/
    /**/
    /*    // Get the conversation or fail with 404*/
    /*    $conversation = Conversation::findOrFail($conversationId);*/
    /**/
    /*    // Optional: Check if the user is a participant of the conversation*/
    /*    // (assuming you have such logic)*/
    /*    // if (!$conversation->participants->contains($request->user()->id)) {*/
    /*    //     return response()->json(['error' => 'Unauthorized'], 403);*/
    /*    // }*/
    /**/
    /*    // Create a new message*/
    /*    $message = Message::create([*/
    /*        'conversation_id' => $conversation->id,*/
    /*        'sender_id' => auth()->id(),  // This requires authentication middleware*/
    /*        'text' => $request->text,*/
    /*    ]);*/
    /**/
    /*    broadcast(new MessageSent($message))->toOthers();*/
    /**/
    /*    return response()->json($message, 201);*/
    /*}*/
    public function sendMessage(Request $request, $conversationId)
    {
        // Log request data for debugging
        Log::info('Request Data:', $request->all());

        // Validate the request data
        $request->validate([
            'text' => 'required|string',
        ]);

        try {
            // Get the conversation or fail with 404
            $conversation = Conversation::findOrFail($conversationId);

            // Log the conversation for debugging
            Log::info('Conversation:', $conversation->toArray());

            // Create a new message
            $message = Message::create([
                'conversation_id' => $conversation->id,
                'sender_id' => auth()->id(),
                'text' => $request->text,
            ]);

            // Broadcast the message
            broadcast(new MessageSent($message))->toOthers();

            return response()->json($message, 201);
        } catch (\Exception $e) {
            // Log the error
            Log::error('Error sending message:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
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

    public function show($id, Request $request)
    {
        // Get the current user's ID
        $userId = $request->user()->id;

        // Retrieve the conversation along with the related job and messages
        $conversation = Conversation::with(['job', 'messages'])->find($id);

        // If the conversation is not found, return a 404 error
        if (!$conversation) {
            return response()->json(['error' => 'Conversation not found'], 404);
        }

        // Add 'fromUser' to each message
        $conversation->messages->each(function ($message) use ($userId) {
            $message->fromUser = $message->sender_id === $userId; // Check if the sender is the current user
        });

        // Return the conversation with the messages including the 'fromUser' field
        return response()->json($conversation);
    }

    public function adminConversations()
    {
        $conversations = Conversation::with(['user', 'job', 'messages' => fn($q) => $q->latest()->take(1)])
            ->has('messages')
            ->get();

        return response()->json($conversations);
    }
}
