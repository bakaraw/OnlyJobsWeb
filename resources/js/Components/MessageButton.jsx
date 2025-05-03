import { useState } from "react";
import MessagePanel from "./Chat/MessagePanel";
import { AnimatePresence, motion } from "framer-motion";

export default function MessageButton({ show, onClick, onClose, conversation }) {
    return (
        <div>
            {/* The floating message button */}
            <button
                onClick={onClick} // Trigger the onClick prop to toggle visibility of the message panel
                className="fixed bottom-8 right-8 bg-primary hover:bg-dark text-white rounded-full w-14 h-14 shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
            >
                💬
            </button>

            {/* Message panel with animation */}
            <AnimatePresence>
                {show && (
                    <motion.div
                    >
                        {/* Pass conversationId to MessagePanel */}
                        <MessagePanel
                            onClose={onClose}
                            conversation={conversation}  // Pass conversationId prop here
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

