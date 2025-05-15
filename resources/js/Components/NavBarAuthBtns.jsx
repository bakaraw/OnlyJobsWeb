import { Link, usePage } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import Dropdown from '@/Components/Dropdown';
import NotificationDropdown from "./NotificationDropdown";
import { useState, useEffect } from "react";

export default function NavBarAuthBtns() {
    const { auth } = usePage().props;
    const [notifications, setNotifications] = useState([]);

    console.log("Auth props:", auth); // Debugging

    // Check if `auth` exists and contains a `user`
    const isAuthenticated = auth && auth.user;
    //useEffect(() => {
    //    if (!auth?.user) return;
    //    axios.get("/notifications").then(res => {
    //        setNotifications(res.data);
    //        console.log("notif: ", res.data);
    //    });
    //
    //    // Listen for broadcasts
    //    window.Echo.private(`App.Models.User.${auth.user.id}`)
    //        .notification((notification) => {
    //            setNotifications(prev => [notification, ...prev]);
    //        });
    //}, [auth?.user?.id]);
    useEffect(() => {
        if (!auth?.user?.id) return;

        // Initial fetch
        axios.get("/notifications").then(res => {
            setNotifications(res.data);
            console.log("Initial notif: ", res.data);
        });

        // Polling every 10 seconds
        const interval = setInterval(() => {
            axios.get("/notifications").then(res => {
                setNotifications(res.data);
                console.log("Polling notif: ", res.data);
            });
        }, 10000); // 10 seconds

        // Listen for broadcasts
        const channel = window.Echo.private(`App.Models.User.${auth.user.id}`)
            .notification((notification) => {
                setNotifications(prev => [notification, ...prev]);
            });

        // Cleanup on unmount or auth change
        return () => {
            clearInterval(interval);
            channel.stopListening(`App.Models.User.${auth.user.id}`);
        };
    }, [auth?.user?.id]);

    return (
        <>
            {isAuthenticated ? (
                <div className="flex items-center justify-between">
                    <NotificationDropdown notifications={notifications} setNotifications={setNotifications} className="z-50" />
                    <Dropdown>
                        <Dropdown.Trigger>
                            <span className="inline-flex rounded-md">
                                <button
                                    type="button"
                                    className="inline-flex text-white items-center rounded-md border border-transparent bg-dark px-3 py-2 text-sm font-medium leading-4 transition duration-150 ease-in-out hover:text-primary focus:outline-none"
                                >
                                    {auth.user.first_name}
                                    <svg
                                        className="-me-0.5 ms-2 h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </span>
                        </Dropdown.Trigger>

                        <Dropdown.Content>
                            {auth.user && auth.user.id === 1 && (
                                <Dropdown.Link href={route("dashboard")}>
                                    {typeof route("dashboard") === "string" ? "Dashboard" : "Invalid Route"}
                                </Dropdown.Link>
                            )}

                            <Dropdown.Link
                                href={route('profile.edit')}
                            >
                                Profile
                            </Dropdown.Link>
                            <Dropdown.Link
                                href={route('logout')}
                                method="post"
                                as="button"
                            >
                                Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            ) : (
                <>
                    <Link href={route("login")} className="text-white px-4 hover:text-primary transition">
                        Login
                    </Link>
                    <Link href={route("register")} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-light hover:text-dark transition">
                        Sign Up
                    </Link>

                </>
            )}
        </>
    );
}

