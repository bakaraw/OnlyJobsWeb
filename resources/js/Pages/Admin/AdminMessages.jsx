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


    useEffect(() => {
        axios.get("/admin/messages/conversations")
            .then((res) => {
                setConversations(res.data);
                if (res.data.length > 0) {
                    setSelectedConversation(res.data[0]);
                }
            })
            .finally(() => setLoadingConversations(false));
    }, []);

    //Fetch messages when a conversation is selected
    //useEffect(() => {
    //    if (!selectedConversation) return;
    //    setLoadingMessages(true);
    //    axios.get(`/admin/messages/${selectedConversation.id}`)
    //        .then((res) => {
    //            console.log("Fetched messages:", res.data);
    //            setMessages(res.data.messages);
    //
    //            // 👇 Optimistically update read_at in conversations list
    //            setConversations((prevConvs) =>
    //                prevConvs.map((conv) => {
    //                    if (conv.id === selectedConversation.id) {
    //                        const updated = { ...conv };
    //                        if (updated.messages?.[0]) {
    //                            updated.messages[0].read_at = new Date().toISOString();
    //                        }
    //                        return updated;
    //                    }
    //                    return conv;
    //                })
    //            );
    //        })
    //        .finally(() => setLoadingMessages(false));
    //
    //}, [selectedConversation]);

    //useEffect(() => {
    //    if (!selectedConversation) return;
    //    setLoadingMessages(true);
    //    axios.get(`/admin/messages/${selectedConversation.id}`)
    //        .then((res) => {
    //            setMessages(res.data.messages);
    //            // Refresh conversations to reflect read status
    //            return axios.get("/admin/messages/conversations");
    //        })
    //        .then((res) => setConversations(res.data))
    //        .finally(() => setLoadingMessages(false));
    //}, [selectedConversation]);

    useEffect(() => {
        if (!selectedConversation) return;

        setLoadingMessages(true);

        // 🔹 Step 1: Mark messages as read (this will update read_at on the server)
        axios.post(`/admin/messages/${selectedConversation.id}/mark-read`)
            .then(() => {
                // 🔹 Step 2: Fetch messages after marking as read
                return axios.get(`/admin/messages/${selectedConversation.id}`);
            })
            .then((res) => {
                setMessages(res.data.messages);

                // 🔹 Step 3: Optimistically update read_at in conversation list
                setConversations((prevConvs) =>
                    prevConvs.map((conv) => {
                        if (conv.id === selectedConversation.id) {
                            const updated = { ...conv };
                            if (updated.messages?.[0]) {
                                updated.messages[0].read_at = new Date().toISOString();
                            }
                            return updated;
                        }
                        return conv;
                    })
                );
            })
            .finally(() => setLoadingMessages(false));
    }, [selectedConversation]);


    useEffect(() => {
        if (!selectedConversation || typeof window.Echo === 'undefined') {
            console.error("Echo is not initialized");
            return;
        }

        const channel = window.Echo.private(`conversations.${selectedConversation.id}`);

        channel.listen('MessageSent', (e) => {
            // Prevent adding the message if it's already in the state
            setMessages((prev) => {
                if (!prev.find((msg) => msg.id === e.id)) {
                    return [...prev, { ...e, fromAdmin: false }];
                }
                return prev;
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
            // Check if message already exists in the state to prevent duplicates
            setMessages((prev) => {
                if (!prev.find((msg) => msg.id === res.data.id)) {
                    return [...prev, { ...res.data, fromAdmin: true }];
                }
                return prev;
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
                <h2 className="text-lg font-semibold mb-4">Conversations</h2>

                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full mb-4 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

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

