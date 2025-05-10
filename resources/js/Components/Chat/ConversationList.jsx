import React from 'react';
import { Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { usePage } from '@inertiajs/react';

export default function ConversationList({ conversations, selected, onSelect, loading }) {
    const { auth } = usePage().props;
    console.log("Conversation List: ", conversations);
    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
            </div>
        );
    }
    return (

        <div className="w-1/3 border-r overflow-y-auto p-4">
            {conversations
                .filter((conv) => conv.messages?.length > 0 || selected?.id === conv.id)
                .map((conv) => (
                    <div
                        key={conv.id}
                        onClick={() => onSelect(conv)}
                        className={`cursor-pointer p-2 rounded mb-2 hover:bg-gray-100
        ${selected?.id === conv.id ? 'bg-blue-100' : ''}`}
                    >
                        <p className="font-semibold">{conv.job?.job_title}</p>
                        <div className={`flex justify-between items-center text-sm ${conv.messages?.[conv.messages.length - 1]?.read_at === null && conv.messages?.[conv.messages.length - 1]?.sender_id != auth.user.id ? 'font-bold text-dark' : 'text-gray-500'}`}>
                            <p className="truncate">
                                {conv.messages?.[conv.messages.length - 1]?.text || 'No messages yet'}
                            </p>
                            <span className={`ml-2 whitespace-nowrap`}>
                                {conv.messages?.length > 0 && conv.messages[conv.messages.length - 1]?.created_at
                                    ? formatDistanceToNow(new Date(conv.messages[conv.messages.length - 1].created_at), { addSuffix: true })
                                    : ''}
                            </span>
                        </div>
                    </div>
                ))}
        </div>
    );
}


