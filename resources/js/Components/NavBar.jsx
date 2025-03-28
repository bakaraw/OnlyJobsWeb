import { useState } from "react";
import { Link, usePage } from "@inertiajs/react"; // Import Link for navigation
import NavBarAuthBtns from "@/Components/NavBarAuthBtns";

export default function NavBar() {
    const { url } = usePage();

    const [active, setActive] = useState(url);
    const [search, setSearch] = useState(""); // State for search input

    const navItems = [
        { name: "Home", href: "/" },
        { name: "Find Work", href: "/find_work" },
        { name: "About Us", href: "/about_us" },
        { name: "Contact Us", href: "/contact_us" },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full bg-dark shadow-md z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="text-white">
                    logo
                </div>
                <div className="flex space-x-4">
                    {navItems.map((item) => (
                        <Link
                            href={item.href}
                            key={item.name}
                            className={`px-4 py-2 rounded-md text-lg font-medium
                                ${active === item.href.toLowerCase()
                                    ? "underline underline-offset-8 text-white shadow-md"
                                    : "text-white hover:bg-light hover:text-dark"}`}
                            onClick={() => setActive(item.href.toLowerCase())}
                        >
                            {item.name}
                        </Link>
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
                    <NavBarAuthBtns />
                </div>
            </div>
        </nav>
    );
}

