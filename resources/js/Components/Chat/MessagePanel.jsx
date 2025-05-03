import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';

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
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(conversation);

    // Fetch conversation data based on conversationId when MessagePanel opens
    //useEffect(() => {
    //    if (conversation) {
    //        axios.get(`/conversations/${conversation.id}`)
    //            .then((response) => {
    //                setSelectedConversation(response.data);
    //            })
    //            .catch((error) => {
    //                console.error("Error fetching conversation:", error);
    //            });
    //    }
    //}, [conversation]);

    useEffect(() => {
        if (selectedConversation?.id) {
            axios.get(`/conversations/${selectedConversation.id}`)
                .then((response) => {
                    setSelectedConversation(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching selected conversation:", error);
                });
        }
    }, [selectedConversation?.id]);

    useEffect(() => {
        axios.get('/conversations')
            .then((response) => {
                console.log("Conversations fetched:", response.data);
                setConversations(response.data);
            })
            .catch((error) => {
                console.error("Error fetching conversations:", error);
            });
    }, []);

    // Update the conversation state when a new message is sent
    const updateSelectedConversation = (newMessage) => {
        if (!selectedConversation) return;

        const updatedConversation = {
            ...selectedConversation,
            messages: [...selectedConversation.messages, newMessage],
        };
        setSelectedConversation(updatedConversation);
    };

    const onSend = async (messageText) => {
        try {
            const response = await axios.post(
                `/conversations/${conversation.id}/send`,
                { text: messageText },
                { withCredentials: true }
            );

            // Append the new message to the UI
            const newMsg = response.data;

            setSelectedConversation((prev) => ({
                ...prev,
                messages: [...prev.messages, {
                    id: newMsg.id,
                    text: newMsg.text,
                    fromUser: true, // you may confirm from response if it came from the user
                }],
            }));
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };


    return (
        <>
            <motion.div
                className="fixed bottom-6 right-6 w-full max-w-5xl h-[70vh] bg-white border border-gray-200 shadow-2xl rounded-2xl z-50 flex overflow-hidden"
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
                />
            </motion.div>
        </>
    );
}

