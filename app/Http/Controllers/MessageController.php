<?php

// app/Http/Controllers/MessageController.php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use App\Models\JobPost;
use App\Events\MessageSent;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Carbon;
use App\Events\MessagesRead;
use App\Models\User;

class MessageController extends Controller
{
    public function getConversations(Request $request)
    {
        if ($request->user()->id == 1) {
            $conversations = Conversation::with(['job', 'messages'])
                ->has('messages')
                ->withCount(['messages as unread_count' => function ($query) {
                    $query->where('is_read', false)
                        ->where('sender_id', '!=', auth()->id());
                }])

                ->get();
        } else {
            $conversations = Conversation::with(['job', 'messages'])
                ->where('user_id', $request->user()->id)
                ->withCount(['messages as unread_count' => function ($query) {
                    $query->where('is_read', false)
                        ->where('sender_id', '!=', auth()->id());
                }])
                ->has('messages')
                ->get();
        }
        return response()->json($conversations);
    }

    public function getMessages($conversationId)
    {
        $userId = auth()->id();
        Message::where('conversation_id', $conversationId)
            ->where('sender_id', '!=', $userId)
            ->where('read_at', null)
            ->update(['read_at' => Carbon::now()]);

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
        $userId = $request->user()->id;

        // Retrieve the conversation with job and messages
        $conversation = Conversation::with(['job', 'messages'])->find($id);

        if (!$conversation) {
            return response()->json(['error' => 'Conversation not found'], 404);
        }

        // Mark unread messages from other users as read
        $unreadMessages = $conversation->messages->filter(function ($message) use ($userId) {
            return $message->sender_id !== $userId && is_null($message->read_at);
        });

        if ($unreadMessages->isNotEmpty()) {
            Message::whereIn('id', $unreadMessages->pluck('id'))
                ->update(['read_at' => Carbon::now()]);

            event(new MessagesRead($conversation->id, $unreadMessages));
        }

        // Add 'fromUser' flag to each message
        $conversation->messages->each(function ($message) use ($userId) {
            $message->fromUser = $message->sender_id === $userId;
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

    public function markAsRead($conversationId)
    {
        $userId = auth()->id();

        Message::where('conversation_id', $conversationId)
            ->where('sender_id', '!=', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => Carbon::now()]);

        return response()->json(['status' => 'marked']);
    }

    public function markAsReadJobSeeker(Conversation $conversation)
    {
        $userId = auth()->id();

        // Mark latest unread messages from others as read
        $conversation->messages()
            ->where('read_at', null)
            ->where('sender_id', '!=', $userId)
            ->latest()
            ->limit(1)
            ->update(['read_at' => now()]);

        return response()->noContent();
    }
}
