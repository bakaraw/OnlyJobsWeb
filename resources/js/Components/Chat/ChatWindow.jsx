import React, { useRef, useEffect } from 'react';
import MessageInput from './MessageInput';
import { Link, usePage } from "@inertiajs/react";
import { Loader2 } from 'lucide-react';

export default function ChatWindow({ conversation, onSend, onClose, loading, fetchConversations }) {
    const { auth } = usePage().props;

    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [conversation?.messages]);

    return (
        <div className="w-2/3 p-4 flex flex-col">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h2 className="font-regular">
                    {conversation?.job?.job_title}
                </h2>
                <button onClick={onClose} className="text-red-500">✖</button>
            </div>

            {/* Display Messages */}
            {
                loading === false ? auth.user ? (
                    <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                        {conversation?.messages?.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.fromUser ? 'justify-end' : 'justify-start'} transition-all duration-150`}>
                                <div
                                    className={`inline-block break-words w-fit max-w-xs px-4 py-2 rounded ${msg.fromUser ? 'bg-primary text-white' : 'bg-gray-200'}`}

                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                ) : (
                    <div className='flex-1 overflow-y-auto space-y-2 mb-4 items-center'>
                        <div className="h-full w-full flex flex-col items-center justify-center gap-3 py-8">
                            <div className="flex flex-col items-center">
                                <p className="text-center w-64 text-sm text-gray-600">
                                    Once you start a new conversation, you’ll see it listed here.
                                </p>
                            </div>

                            <div className="flex gap-2 text-sm text-blue-600">
                                <Link href={route('login')}>Login</Link>
                                <span>|</span>
                                <Link href={route('register')}>Sign up</Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
                    </div>
                )
            }

            {/* Message Input */}
            <MessageInput onSend={onSend} />
        </div>
    );
}

