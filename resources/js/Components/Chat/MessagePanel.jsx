import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import { usePage } from '@inertiajs/react';

const panelVariants = {
    hidden: { opacity: 0, y: 80, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30,
        },
    },
    exit: {
        opacity: 0,
        y: 80,
        scale: 0.95,
        transition: {
            duration: 0.2,
            ease: 'easeInOut',
        },
    },
};

export default function MessagePanel({ onClose, conversation }) {
    const { auth } = usePage().props;
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(conversation);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [loadingConversation, setLoadingConversation] = useState(false);
    const panelRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const sortConversations = (convs) => {
        return convs.sort((a, b) => {
            const aTime = new Date(a.messages?.[a.messages.length - 1]?.created_at || 0).getTime();
            const bTime = new Date(b.messages?.[b.messages.length - 1]?.created_at || 0).getTime();
            return bTime - aTime; // Newest first
        });
    };


    const fetchConversations = () => {
        setLoadingConversation(true);
        axios.get('/conversations')
            .then((response) => {
                setConversations(response.data);
            })
            .catch((error) => {
                console.error("Error fetching conversations:", error);
            })
            .finally(() => {
                setLoadingConversation(false);
            });
    }

    useEffect(() => {
        if (!selectedConversation?.id || !selectedConversation.messages?.length) return;

        const unreadMessages = selectedConversation.messages.filter(
            (msg) => !msg.read_at && msg.sender_id !== auth.user.id
        );

        if (unreadMessages.length === 0) return;

        const markMessagesAsRead = async () => {
            try {
                await axios.post(`/conversations/${selectedConversation.id}/mark-read`);

                // Update local state
                setSelectedConversation((prev) => ({
                    ...prev,
                    messages: prev.messages.map((msg) =>
                        msg.sender_id !== auth.user.id
                            ? { ...msg, read_at: new Date().toISOString() }
                            : msg
                    ),
                }));

                setConversations((prevConvs) =>
                    prevConvs.map((c) => {
                        if (c.id === selectedConversation.id) {
                            return {
                                ...c,
                                messages: c.messages.map((msg) =>
                                    msg.sender_id !== auth.user.id
                                        ? { ...msg, read_at: new Date().toISOString() }
                                        : msg
                                ),
                            };
                        }
                        return c;
                    })
                );
            } catch (error) {
                console.error("Failed to mark messages as read:", error);
            }
        };

        markMessagesAsRead();
    }, [selectedConversation?.messages]);


    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setLoadingConversation(true);
                const response = await axios.get('/conversations');

                const conversationsWithFromUser = response.data.map(conv => ({
                    ...conv,
                    messages: conv.messages?.map(msg => ({
                        ...msg,
                        fromUser: msg.sender_id === auth.user.id
                    })) || []
                }));

                setConversations(sortConversations(conversationsWithFromUser));
            } catch (error) {

                console.error("Error fetching conversations:", error);
            } finally {
                setLoadingConversation(false);
            }
        };

        fetchConversations();
    }, []);

    useEffect(() => {
        if (!selectedConversation?.id) return;

        const channel = window.Echo.private(`conversations.${selectedConversation.id}`);
        //
        //channel.listen('MessageSent', (e) => {
        //    const incomingMsg = {
        //        id: e.id,
        //        text: e.text,
        //        fromUser: e.sender_id === auth.user.id,
        //        created_at: e.created_at, // Make sure this is provided from backend
        //    };
        //
        //    // Update selected conversation
        //    setSelectedConversation((prev) => ({
        //        ...prev,
        //        messages: prev.messages ? [...prev.messages, incomingMsg] : [incomingMsg],
        //    }));
        //
        //    // Update conversations list
        //    setConversations((prevConvs) => {
        //        const updated = prevConvs.map((conv) => {
        //            if (conv.id === selectedConversation.id) {
        //                return {
        //                    ...conv,
        //                    messages: [...(conv.messages || []), incomingMsg],
        //                };
        //            }
        //            return conv;
        //        });
        //
        //        return sortConversations(updated);
        //    });
        //});
        channel.listen('MessageSent', (e) => {
            if (e.sender_id === auth.user.id) return; // Skip if the sender is the current user

            const incomingMsg = {
                id: e.id,
                text: e.text,
                fromUser: e.sender_id === auth.user.id,
                created_at: e.created_at,
            };

            setSelectedConversation((prev) => {
                const alreadyExists = prev.messages?.some((msg) => msg.id === incomingMsg.id);
                if (alreadyExists) return prev;

                return {
                    ...prev,
                    messages: [...(prev.messages || []), incomingMsg],
                };
            });

            setConversations((prevConvs) => {
                const updated = prevConvs.map((conv) => {
                    if (conv.id === selectedConversation.id) {
                        const alreadyExists = conv.messages?.some((msg) => msg.id === incomingMsg.id);
                        if (alreadyExists) return conv;

                        return {
                            ...conv,
                            messages: [...(conv.messages || []), incomingMsg],
                        };
                    }
                    return conv;
                });

                return sortConversations(updated);
            });
        });


        return () => {
            channel.stopListening('MessageSent');
            window.Echo.leave(`conversations.${selectedConversation.id}`);
        };
    }, [selectedConversation?.id]);  // Ensure selectedConversation is valid

    const onSend = async (messageText) => {
        try {
            if (!selectedConversation?.id) throw new Error("No conversation selected.");

            const response = await axios.post(`/conversations/${selectedConversation.id}/send`, {
                text: messageText
            });

            const newMsg = {
                id: response.data.id, // or fallback to Date.now()
                text: messageText,
                fromUser: true,
                created_at: new Date().toISOString(), // ideally use response.data.created_at
            };

            // Update selectedConversation
            setSelectedConversation((prev) => ({
                ...prev,
                messages: [...(prev.messages || []), newMsg],
            }));

            // Update conversations list
            setConversations((prev) => {
                const updated = prev.map(conv => {
                    if (conv.id === selectedConversation.id) {
                        return {
                            ...conv,
                            messages: [...(conv.messages || []), newMsg],
                        };
                    }
                    return conv;
                });

                return sortConversations(updated);
            });

        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };


    const handleSelectConversation = async (conv) => {
        setSelectedConversation(conv);

        // Update read_at only if the last message is from another user and unread
        const lastMsg = conv.messages?.[conv.messages.length - 1];
        const isUnread = lastMsg && !lastMsg.read_at && lastMsg.sender_id !== auth.user.id;

        if (isUnread) {
            try {
                await axios.post(`/conversations/${conv.id}/mark-read`);

                // Update local state
                setConversations((prevConvs) =>
                    prevConvs.map((c) => {
                        if (c.id === conv.id) {
                            const updated = { ...c };
                            const last = updated.messages?.[updated.messages.length - 1];
                            if (last) {
                                last.read_at = new Date().toISOString();
                            }
                            return updated;
                        }
                        return c;
                    })
                );
            } catch (error) {
                console.error("Failed to mark as read:", error);
            }
        }
    };

    useEffect(() => {
        if (!selectedConversation?.id) return;

        const fetchMessages = async () => {
            try {
                setLoadingMessages(true);
                const response = await axios.get(`/conversations/${selectedConversation.id}/messages`);

                setSelectedConversation(prev => ({
                    ...prev,
                    messages: response.data.map(msg => ({
                        ...msg,
                        fromUser: msg.sender_id === auth.user.id,
                    })),
                }));
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            } finally {
                setLoadingMessages(false);
            }
        };

        fetchMessages();
    }, [selectedConversation?.id]); // Trigger when conversation ID changes

    return (
        <div className="fixed inset-0 z-40 pointer-events-none">
            <motion.div
                ref={panelRef}
                className="absolute bottom-6 right-6 w-full max-w-5xl h-[70vh] bg-white border border-gray-200 shadow-2xl rounded-2xl z-50 flex overflow-hidden pointer-events-auto"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={panelVariants}
            >
                <ConversationList
                    conversations={conversations}
                    selected={selectedConversation}
                    onSelect={handleSelectConversation}
                    loading={loadingConversation}
                />
                <ChatWindow
                    conversation={selectedConversation}
                    onSend={onSend}
                    onClose={onClose}
                    loading={loadingMessages}
                    fetchConversations={fetchConversations}
                />
            </motion.div>
        </div>
    );
}

