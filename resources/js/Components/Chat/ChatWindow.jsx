import React from 'react';
import MessageInput from './MessageInput';

export default function ChatWindow({ conversation, onSend, onClose }) {
    return (
        <div className="w-2/3 p-4 flex flex-col">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h2 className="font-regular">
                    {
                        conversation?.job?.job_title
                    }
                </h2>
                <button onClick={onClose} className="text-red-500">✖</button>
            </div>

            {/* Display Messages */}
            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                {conversation?.messages?.map((msg) => (
                    <div key={msg.id} className={`text-${msg.fromUser ? 'right' : 'left'}`}>
                        <div
                            className={`inline-block px-4 py-2 rounded ${msg.fromUser ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Message Input */}
            <MessageInput onSend={onSend} />
        </div>
    );
}


