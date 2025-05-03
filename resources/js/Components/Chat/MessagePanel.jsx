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

    useEffect(() => {
        if (selectedConversation?.id) {
            setLoadingMessages(true); // Start loading messages

            axios.get(`/conversations/${selectedConversation.id}`, { withCredentials: true })
                .then((response) => {
                    setSelectedConversation(response.data); // No need to map 'fromUser' in the frontend anymore
                })
                .catch((error) => {
                    console.error("Error fetching selected conversation:", error);
                })
                .finally(() => {
                    setLoadingMessages(false); // Stop loading
                });
        }
    }, [selectedConversation?.id]);

    useEffect(() => {
        axios.get('/conversations')
            .then((response) => {
                setConversations(response.data);
            })
            .catch((error) => {
                console.error("Error fetching conversations:", error);
            });
    }, []);

    const onSend = async (messageText) => {
        try {
            const response = await axios.post(
                `/conversations/${conversation.id}/send`,
                { text: messageText },
                { withCredentials: true }
            );

            const newMsg = response.data;

            setSelectedConversation((prev) => ({
                ...prev,
                messages: [...prev.messages, {
                    id: newMsg.id,
                    text: newMsg.text,
                    fromUser: true,
                }],
            }));
        } catch (error) {
            console.error("Failed to send message:", error);
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
                    onSelect={setSelectedConversation}
                />
                <ChatWindow
                    conversation={selectedConversation}
                    onSend={onSend}
                    onClose={onClose}
                    loading={loadingMessages}
                />
            </motion.div>
        </div>
    );
}

