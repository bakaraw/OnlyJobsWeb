import React, { useState } from "react";
import { Package } from "lucide-react";
import DangerButton from "@/Components/DangerButton.jsx";
import { router } from "@inertiajs/react";
import { useEffect } from "react";

export default function Sidebar({ auth, setActiveView }) {

    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch initial unread count when component mounts
    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const response = await axios.get('messages/unread-count');
                setUnreadCount(response.data.unread_count);
            } catch (error) {
                console.error("Failed to fetch unread count", error);
            }
        };

        fetchUnreadCount();

        // Optional: Polling for unread count (every 10 seconds)
        const interval = setInterval(fetchUnreadCount, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
            {/* Profile Section */}
            <div className="flex flex-col items-center py-6 border-b border-gray-200">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-2 border-4 border-gray-300 ring-2 ring-white">
                    <img
                        src={auth?.user?.profile_pic_url || 'images/default-profile.webp'}
                        alt="Image"
                        className="w-full h-full object-cover"
                    />
                </div>
                <h2 className="text-sm font-medium">{`${auth?.user?.first_name} ${auth?.user?.last_name}`}</h2>
                <p className="text-xs text-gray-500 mb-4">{auth?.user?.email}</p>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 py-4">
                <ul>
                    <li>
                        <button
                            onClick={() => setActiveView("dashboard")}
                            className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-gray-100 focus:outline-none"
                        >
                            📊 Dashboard
                        </button>
                    </li>

                    <li>
                        <button
                            onClick={() => setActiveView("joblist")}
                            className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-gray-100 focus:outline-none"
                        >
                            💼 Jobs
                        </button>
                    </li>

                    <li>
                        <button
                            onClick={() => setActiveView("applicants")}
                            className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-gray-100 focus:outline-none"
                        >
                            🤵🏻 Applicants
                        </button>
                    </li>
                    <li className="relative">
                        <button
                            onClick={() => setActiveView("messages")}
                            className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-gray-100 focus:outline-none"
                        >
                            💬 Job Inquiries
                            {unreadCount > 0 && (
                                <span className="absolute right-4 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    </li>
                    <li className="relative">
                        <button
                            onClick={() => setActiveView("contact_us_messages")}
                            className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-gray-100 focus:outline-none"
                        >
                            💬 Contact Us Messages
                            {unreadCount > 0 && (
                                <span className="absolute right-4 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    </li>

                </ul>
            </nav>
            <div className="mt-auto mb-4 px-6">
                <DangerButton
                    onClick={() => router.post(route('logout'))}
                >
                    Log Out
                </DangerButton>
            </div>
        </div>
    );
}
