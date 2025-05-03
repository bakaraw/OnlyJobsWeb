import React, { useState } from 'react';
import SecondaryButton from '../SecondaryButton';
import TextInput from '../TextInput';

export default function MessageInput({ onSend }) {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        onSend(message); // Send just the raw text to the parent
        setMessage('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <TextInput
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 border px-3 w-full py-2 rounded"
                placeholder="Type a message..."
            />
            <SecondaryButton className="px-4 py-2 rounded">Send</SecondaryButton>
        </form>
    );
}

