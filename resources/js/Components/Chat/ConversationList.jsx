import React from 'react';

export default function ConversationList({ conversations, selected, onSelect }) {
    return (
        <div className="w-1/3 border-r overflow-y-auto p-4">
            {/* Map through the conversations and display each one */}
            {conversations.map((conv) => (
                <div
                    key={conv.id}
                    onClick={() => onSelect(conv)}  // When a conversation is clicked, update the selected conversation
                    className={`cursor-pointer p-2 rounded mb-2 hover:bg-gray-100
                        ${selected?.id === conv.id ? 'bg-blue-100' : ''}`}  // Highlight selected conversation
                >
                    <p className="font-semibold">{conv.job.job_title}</p>  {/* Show conversation name */}
                    <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>  {/* Show last message */}
                </div>
            ))}
        </div>
    );
}

