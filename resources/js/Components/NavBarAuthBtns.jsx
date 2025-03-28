import { Link, usePage } from "@inertiajs/react";
import { router } from "@inertiajs/react";

export default function NavBarAuthBtns() {
    const { auth } = usePage().props;

    console.log("Auth props:", auth); // Debugging

    // Check if `auth` exists and contains a `user`
    const isAuthenticated = auth && auth.user;

    // Logout handler for Inertia
    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route("logout"));
    };

    return (
        <>
            {isAuthenticated ? (
                <button
                    onClick={handleLogout}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-light hover:text-dark transition"
                >
                    Logout
                </button>
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

