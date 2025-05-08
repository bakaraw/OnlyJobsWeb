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
        const fetchConversations = async () => {
            try {
                setLoadingConversation(true);
                const response = await axios.get('/conversations');

                // Inject fromUser into each message based on sender_id
                const conversationsWithFromUser = response.data.map(conv => ({
                    ...conv,
                    messages: conv.messages?.map(msg => ({
                        ...msg,
                        fromUser: msg.sender_id === auth.user.id
                    })) || []
                }));

                setConversations(conversationsWithFromUser);
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

        channel.listen('MessageSent', (e) => {
            const incomingMsg = {
                id: e.id,
                text: e.text,
                fromUser: e.sender_id === auth.user.id,
            };

            setSelectedConversation((prev) => ({
                ...prev,
                messages: prev.messages ? [...prev.messages, incomingMsg] : [incomingMsg],
            }));
        });

        return () => {
            channel.stopListening('MessageSent');
            window.Echo.leave(`conversations.${selectedConversation.id}`);
        };
    }, [selectedConversation?.id]);  // Ensure selectedConversation is valid

    const onSend = async (messageText) => {
        try {
            if (!selectedConversation?.id) throw new Error("No conversation selected.");

            await axios.post(
                `/conversations/${selectedConversation.id}/send`,
                { text: messageText },
                { withCredentials: true }
            );

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

