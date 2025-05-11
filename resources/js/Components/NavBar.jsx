import { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react"; // Import Link for navigation
import { useEffect } from "react";
import NavBarAuthBtns from "@/Components/NavBarAuthBtns";

export default function NavBar() {
    const { url } = usePage();
    const { filters } = usePage().props;

    const [active, setActive] = useState(url);
    const [search, setSearch] = useState(""); // State for search input
    const [menuOpen, setMenuOpen] = useState(false);

    const navItems = [
        { name: "Home", href: "/" },
        { name: "Find Work", href: "/find_work" },
        { name: "About Us", href: "/about_us" },
        { name: "Contact Us", href: "/contact_us" },
    ];

    useEffect(() => {
        setSearch(filters?.search || '');
    }, [filters?.search]);

    const handleSearch = (e) => {
        console.log("Enter is pressed: ", search);
        if (!search.trim()) return;
        router.get('/find_work', {
            ...filters,
            search: search.trim(),
        });
    }

    return (
        <nav className="fixed top-0 left-0 w-full bg-dark z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <div className="text-white">
                    <Link
                        href="/"
                    >
                        <img src="/images/logo.png" alt="logo" className="h-10">
                        </img>
                    </Link>
                </div >

                {/* Hamburger for mobile */}
                < div className="md:hidden" >
                    <button onClick={() => setMenuOpen(!menuOpen)} className="text-white focus:outline-none">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {menuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div >

                {/* Desktop Nav Items */}
                < div className="hidden md:flex space-x-4" >
                    {
                        navItems.map((item) => (
                            <Link
                                href={item.href}
                                key={item.name}
                                className={`px-4 py-2 rounded-md text-lg font-medium
                        ${active === item.href.toLowerCase()
                                        ? "underline underline-offset-8 text-white"
                                        : "text-white hover:bg-light hover:text-dark"}`}
                                onClick={() => setActive(item.href.toLowerCase())}
                            >
                                {item.name}
                            </Link>
                        ))
                    }
                </div >

                {/* Right side: Search and Auth buttons (hidden on small screens) */}
                < div className="hidden md:flex items-center space-x-4" >
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSearch();
                        }}
                        className="w-64 px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mr-5"
                    />
                    <NavBarAuthBtns />
                </div >
            </div >
        </nav >
    );
}
