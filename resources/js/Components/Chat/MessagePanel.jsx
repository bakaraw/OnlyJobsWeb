import React, { useState } from 'react';
import { motion } from 'framer-motion';
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

export default function MessagePanel({ onClose }) {
    const [conversations, setConversations] = useState([
        {
            id: 1,
            name: 'Employer A',
            lastMessage: 'Looking forward to working with you!',
            messages: [
                { id: 1, text: 'Hi! Is the job available?', fromUser: true },
                { id: 2, text: 'Yes, are you free to start this week?', fromUser: false },
            ],
        },
    ]);
    const [selected, setSelected] = useState(conversations[0]);

    const updateSelectedConversation = (newMessage) => {
        const updatedConversations = conversations.map((conv) =>
            conv.id === selected.id
                ? {
                    ...conv,
                    messages: [...conv.messages, newMessage],
                    lastMessage: newMessage.text,
                }
                : conv
        );
        setConversations(updatedConversations);
        setSelected((prev) => ({
            ...prev,
            messages: [...prev.messages, newMessage],
        }));
    };

    return (
        <motion.div
            className="fixed bottom-6 right-6 w-full max-w-5xl h-[70vh] bg-white border border-gray-200 shadow-2xl rounded-2xl z-50 flex overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={panelVariants}
        >
            <ConversationList
                conversations={conversations}
                selected={selected}
                onSelect={setSelected}
            />
            <ChatWindow
                conversation={selected}
                onSend={updateSelectedConversation}
                onClose={onClose}
            />
        </motion.div>
    );
}

