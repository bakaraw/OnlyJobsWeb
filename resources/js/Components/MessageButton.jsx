import { useState, useEffect } from "react";
import axios from "axios"; // Ensure axios is imported
import MessagePanel from "./Chat/MessagePanel";
import { AnimatePresence, motion } from "framer-motion";

export default function MessageButton({ show, onClick, onClose, conversation }) {
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch initial unread count when component mounts
    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const response = await axios.get('/conversation/unread-count');
                console.log('UnreadCount: ', response.data);
                setUnreadCount(response.data.unread_count);
            } catch (error) {
                console.error("Failed to fetch unread count", error);
            }
        };

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <button
                onClick={onClick}
                className="fixed bottom-8 right-8 bg-primary hover:bg-dark text-white rounded-full w-14 h-14 shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
            >
                💬
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {show && (
                    <motion.div>
                        <MessagePanel
                            onClose={onClose}
                            conversation={conversation}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

