import React, { useEffect, useState } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import axios from "axios";
import { usePage } from "@inertiajs/react";

export default function AdminMessages() {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);

    const { auth } = usePage().props;
    console.log("User: " + auth);

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

    // Fetch messages when a conversation is selected
    useEffect(() => {
        if (!selectedConversation) return;
        setLoadingMessages(true);
        axios.get(`/admin/messages/${selectedConversation.id}`)
            .then((res) => {
                console.log("Fetched messages:", res.data);
                setMessages(res.data.messages);
            })
            .finally(() => setLoadingMessages(false));
    }, [selectedConversation]);

    const handleSend = () => {
        if (newMessage.trim() === "") return;

        axios.post(`/admin/messages/${selectedConversation.id}`, {
            text: newMessage,
        }).then((res) => {
            setMessages((prev) => [...prev, { ...res.data, fromAdmin: true }]);
            setNewMessage("");
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
                                <div className="text-sm text-gray-600 truncate">
                                    {conv.messages?.[0]?.text || "No messages yet"}
                                </div>
                                {conv.unread_count > 0 && (
                                    <span className="text-xs text-blue-500 font-semibold">
                                        {conv.unread_count} new
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Chat Window */}
            <div className="w-2/3 flex flex-col">
                {/* Header */}
                <div className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 border-b border-gray-200">
                    {selectedConversation
                        ? `Chat with ${selectedConversation.user.first_name} ${selectedConversation.user.last_name} about ${selectedConversation.job.job_title}`
                        : "Select a conversation"}
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-2">
                    {loadingMessages ? (
                        <p className="text-sm text-gray-500">Loading messages...</p>
                    ) : (
                        Array.isArray(messages) && messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`max-w-xs px-4 py-2 rounded-full text-sm ${msg.sender_id == auth.user.id
                                    ? "bg-primary text-white self-end ml-auto"
                                    : "bg-gray-200 text-gray-800"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        ))
                    )}
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
                        >
                            Send
                        </PrimaryButton>
                    </div>
                )}
            </div>
        </div>
    );
}

