import React, { useEffect, useRef, useState } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Link } from "@inertiajs/react";

export default function AdminMessages({ onJobSelect }) {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sendMessageLoading, setSendMessageLoading] = useState(false);

    const { auth } = usePage().props;
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const markMessagesAsRead = (conversationId) => {
        if (!conversationId) return;

        // Optimistically update in the conversations list
        setConversations(prevConvs =>
            prevConvs.map(conv => {
                if (conv.id === conversationId) {
                    const updated = { ...conv };
                    if (updated.messages?.[0]) {
                        updated.messages[0].read_at = new Date().toISOString();
                    }
                    return updated;
                }
                return conv;
            })
        );

        // Update in the messages list
        setMessages(prevMessages =>
            prevMessages.map(msg => {
                if (!msg.read_at && msg.sender_id !== auth.user.id) {
                    return { ...msg, read_at: new Date().toISOString() };
                }
                return msg;
            })
        );

        // Call the API endpoint
        axios.post(`/admin/messages/${conversationId}/mark-read`);
    };

    useEffect(() => {
        axios.get("/admin/messages/conversations")
            .then((res) => {
                const sorted = res.data.sort((a, b) => {
                    const dateA = new Date(a.messages?.[0]?.created_at || 0);
                    const dateB = new Date(b.messages?.[0]?.created_at || 0);
                    return dateB - dateA; // earliest to oldest
                });
                setConversations(sorted);
                if (sorted.length > 0) {
                    setSelectedConversation(sorted[0]);
                }
            })
            .finally(() => setLoadingConversations(false));
    }, []);

    useEffect(() => {
        if (!selectedConversation) return;

        setLoadingMessages(true);

        // Mark messages as read first
        markMessagesAsRead(selectedConversation.id);

        // Then fetch messages
        axios.get(`/admin/messages/${selectedConversation.id}`)
            .then((res) => {
                setMessages(res.data.messages);
            })
            .finally(() => setLoadingMessages(false));
    }, [selectedConversation]);

    useEffect(() => {
        if (typeof window.Echo === 'undefined') {
            console.error("Echo is not initialized");
            return;
        }

        const globalChannel = window.Echo.private('admin.conversations');

        globalChannel.listen('NewConversationStarted', (e) => {
            setConversations((prevConvs) => {
                const exists = prevConvs.find((conv) => conv.id === e.conversation.id);
                if (!exists) {
                    const updated = [e.conversation, ...prevConvs];
                    return updated.sort((a, b) => new Date(b.messages?.[0]?.created_at) - new Date(a.messages?.[0]?.created_at));
                }
                return prevConvs;
            });
        });

        return () => {
            window.Echo.leave('private-admin.conversations');
        };
    }, []);
    const fetchConversations = async () => {
        try {
            const response = await axios.get('/admin/messages/conversations');
            const sortedConversations = response.data.sort((a, b) => {
                const dateA = new Date(a.messages?.[0]?.created_at || 0);
                const dateB = new Date(b.messages?.[0]?.created_at || 0);
                return dateB - dateA; // Sort from latest to oldest
            });
            setConversations(sortedConversations);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    useEffect(() => {
        fetchConversations(); // initial load

        const interval = setInterval(() => {
            fetchConversations();
        }, 5000); // every 5 seconds

        return () => clearInterval(interval); // cleanup on unmount
    }, []);

    useEffect(() => {
        if (!selectedConversation || typeof window.Echo === 'undefined') return;

        const channel = window.Echo.private(`conversations.${selectedConversation.id}`);

        channel.listen('MessageSent', (e) => {
            // Mark messages as read when receiving new ones
            markMessagesAsRead(selectedConversation.id);

            setMessages((prev) => {
                if (!prev.find((msg) => msg.id === e.id)) {
                    return [...prev, { ...e, fromAdmin: false }];
                }
                return prev;
            });

            setConversations((prevConvs) => {
                const updated = prevConvs.map((conv) =>
                    conv.id === selectedConversation.id
                        ? { ...conv, messages: [{ ...e }] }
                        : conv
                );
                return updated.sort((a, b) =>
                    new Date(b.messages?.[0]?.created_at) - new Date(a.messages?.[0]?.created_at)
                );
            });
        });

        return () => {
            channel.stopListening('MessageSent');
            window.Echo.leave(`conversations.${selectedConversation.id}`);
        };
    }, [selectedConversation]);

    const handleSend = () => {
        if (newMessage.trim() === "") return;
        setSendMessageLoading(true);

        axios.post(`/admin/messages/${selectedConversation.id}`, {
            text: newMessage,
        }).then((res) => {
            const newMsg = { ...res.data, fromAdmin: true };

            setMessages((prev) => {
                if (!prev.find((msg) => msg.id === newMsg.id)) {
                    return [...prev, newMsg];
                }
                return prev;
            });

            // 🟡 Update the conversation list
            setConversations((prevConvs) => {
                const updated = prevConvs.map((conv) =>
                    conv.id === selectedConversation.id
                        ? { ...conv, messages: [newMsg] }
                        : conv
                );
                // Re-sort the list so the updated conversation moves to top
                return updated.sort((a, b) => new Date(b.messages?.[0]?.created_at) - new Date(a.messages?.[0]?.created_at));
            });

            setNewMessage("");
        }).finally(() => {
            setSendMessageLoading(false);
        });

    };

    const filteredConversations = conversations.filter((conv) =>
        conv.user.first_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-full bg-white rounded-lg shadow overflow-hidden">
            {/* Sidebar for Conversations */}
            <div className="w-1/3 p-4 overflow-y-auto border-r border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Inbox</h2>
                {loadingConversations ? (
                    <p className="text-sm text-gray-500">Loading...</p>
                ) : (
                    <ul className="space-y-2">
                        {filteredConversations.map((conv) => (
                            <li
                                key={conv.id}
                                onClick={() => setSelectedConversation(conv)}
                                className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition ${selectedConversation?.id === conv.id ? "bg-gray-200" : ""
                                    }`}
                            >
                                <div className="font-medium">{conv.user.first_name} {conv.user.last_name} - {conv.job.job_title}</div>
                                <div className="flex text-sm text-gray-600">
                                    <p className="truncate">{conv.messages?.[0]?.text || "No messages yet"}</p>
                                    <p className="ml-auto">
                                        {conv.messages?.[0]?.created_at
                                            ? formatDistanceToNow(parseISO(conv.messages[0].created_at), { addSuffix: true })
                                            : ""}
                                    </p>
                                </div>
                                {conv.messages?.[0]?.read_at === null && (
                                    <span className="text-xs text-blue-500 font-semibold">
                                        new
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {/* Chat Window */}
            <div className="w-2/3 h-screen flex flex-col">
                {/* Header */}
                <div className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 border-b border-gray-200">
                    {selectedConversation
                        ? `Chat with ${selectedConversation.user.first_name} ${selectedConversation.user.last_name} about ${selectedConversation.job.job_title}`
                        : "Select a conversation"}
                </div>
                {selectedConversation && (
                    <div className="px-4 py-3 border-b border-gray-200 bg-white text-sm text-gray-700 space-y-1">
                        <div>
                            <span className="font-medium">Job:</span>{" "}
                            <button
                                //href={`/job/${selectedConversation.job.id}`}
                                onClick={() => onJobSelect(selectedConversation.job.id)}
                                className="text-blue-600 hover:underline"
                            >
                                {selectedConversation.job.job_title}
                            </button>
                        </div>
                        <div>
                            <span className="font-medium">User:</span>{" "}
                            {selectedConversation.user.first_name} {selectedConversation.user.last_name} ({selectedConversation.user.email})
                        </div>
                    </div>
                )}

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-2">
                    {loadingMessages ? (
                        <p className="text-sm text-gray-500">Loading messages...</p>
                    ) : (
                        Array.isArray(messages) && messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`w-fit max-w-xs px-4 py-2 break-words overflow-y-auto rounded-lg text-sm ${msg.sender_id == auth.user.id
                                    ? "bg-primary text-white self-end ml-auto"
                                    : "bg-gray-200 text-gray-800"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>
                {/* Input */}
                {selectedConversation && (
                    <div className="p-3 flex gap-2 bg-gray-50 border-t border-gray-200">
                        <input
                            type="text"
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />
                        <PrimaryButton
                            className="text-sm px-4 py-2 rounded-lg"
                            onClick={handleSend}
                            disabled={sendMessageLoading}
                        >
                            Send
                        </PrimaryButton>
                    </div>
                )}
            </div>
        </div>
    );
}

