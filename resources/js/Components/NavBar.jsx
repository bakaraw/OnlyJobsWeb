import { useState } from "react";
import { Link, usePage } from "@inertiajs/react"; // Import Link for navigation

export default function NavBar() {
    const { url } = usePage();

    const [active, setActive] = useState(url);
    const [search, setSearch] = useState(""); // State for search input

    const navItems = [
        { name: "Home", href: "/" },
        { name: "Find Work", href: "/findwork" },
        { name: "About Us", href: "/aboutus" },
        { name: "Contact Us", href: "/contactus" },
    ];

    return (
        <nav className="bg-dark shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="text-white">
                    logo
                </div>
                <div className="flex space-x-4">
                    {navItems.map((item) => (
                        <a
                            href={item.href}
                            key={item.name}
                            className={`px-4 py-2 rounded-md text-lg font-medium
                                ${active === item.href.toLowerCase()
                                    ? "bg-primary text-white shadow-md"
                                    : "text-white hover:bg-light hover:text-dark"}`}
                            onClick={() => setActive(item.href.toLowerCase())}
                        >
                            {item.name}
                        </a>
                    ))}
                </div>

                {/* Right: Search Box, Login & Sign Up */}
                <div className="flex items-center space-x-4">
                    {/* 🔍 Search Input Box */}
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-64 px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mr-5"
                    />

                    {/* Login & Sign Up */}
                    <Link href={route('login')} className="text-white px-4 hover:text-primary transition">
                        Login
                    </Link>
                    <Link href={route('register')} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-light hover:text-dark transition">
                        Sign Up
                    </Link>
                </div>
            </div>
        </nav>
    );
}

