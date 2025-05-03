import React from 'react';
import { Loader2 } from 'lucide-react';

export default function ConversationList({ conversations, selected, onSelect, loading }) {
    console.log("Conversion List: ", conversations)
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
                        <p className="text-sm text-gray-500 truncate">
                            {conv.messages?.[conv.messages.length - 1]?.text || 'No messages yet'}
                        </p>
                    </div>
                ))}
        </div>
    );
}


