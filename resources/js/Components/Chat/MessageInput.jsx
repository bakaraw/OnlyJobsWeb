import React, { useState } from 'react';

export default function MessageInput({ onSend }) {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        onSend({ id: Date.now(), text: message, fromUser: true });
        setMessage('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 border px-3 py-2 rounded"
                placeholder="Type a message..."
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
        </form>
    );
}

