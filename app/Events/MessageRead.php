<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;
use App\Models\Message;

class MessagesRead implements ShouldBroadcastNow
{
    use SerializesModels;

    public $messages;
    public $conversationId;

    public function __construct($conversationId, $messages)
    {
        $this->conversationId = $conversationId;
        $this->messages = $messages;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('conversations.' . $this->conversationId);
    }

    public function broadcastWith()
    {
        return [
            'conversation_id' => $this->conversationId,
            'message_ids' => $this->messages->pluck('id'),
        ];
    }
}
