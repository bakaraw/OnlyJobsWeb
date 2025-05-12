import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "@radix-ui/react-dropdown-menu";
import { Bell } from "lucide-react";
import axios from "axios";

export default function NotificationDropdown({ notifications = [], setNotifications, className = "" }) {
    const unreadCount = notifications.filter(n => !n.read).length;

    const handleOpenChange = (open) => {
        if (open && unreadCount > 0) {
            axios.post("/notifications/mark-as-read").then(() => {
                // Update only the read status locally
                setNotifications(prev =>
                    prev.map(n => ({ ...n, read: true }))
                );
            });
        }
    };

    return (
        <DropdownMenu onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger className="relative mr-2">
                <Bell className="text-white hover:text-primary transition" size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className={`w-96 max-h-80 overflow-y-auto bg-white rounded-xl shadow-lg p-2 ${className}`}
            >
                {notifications.length === 0 ? (
                    <div className="text-sm text-center text-gray-500 p-4">No notifications</div>
                ) : (
                    notifications.map((note, index) => (
                        <DropdownMenuItem
                            key={index}
                            className="w-full px-3 py-2 rounded hover:bg-gray-100 cursor-pointer"
                        >
                            <div className="flex flex-col w-full gap-1">
                                <div className="flex justify-between w-full">
                                    <span className="font-semibold text-sm text-gray-800">
                                        {note.title}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {note.timeAgo}
                                    </span>
                                </div>
                                <p
                                    className={`text-sm break-words whitespace-normal ${note.read ? 'text-gray-600' : 'text-black font-bold'}`}
                                >
                                    {note.message}
                                </p>

                            </div>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

