import React from 'react';

export default function ConversationList({ conversations, selected, onSelect }) {
    return (
        <div className="w-1/3 border-r overflow-y-auto p-4">
            {conversations.map((conv) => (
                <div
                    key={conv.id}
                    onClick={() => onSelect(conv)}
                    className={`cursor-pointer p-2 rounded mb-2 hover:bg-gray-100 ${selected?.id === conv.id ? 'bg-blue-100' : ''
                        }`}
                >
                    <p className="font-semibold">{conv.name}</p>
                    <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                </div>
            ))}
        </div>
    );
}

