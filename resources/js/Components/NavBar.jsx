import { useState } from "react";
export default function NavBar() {
    const [active, setActive] = useState("home");

    const navItems = [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/aboutus" },
        { name: "Contact Us", href: "/contactus" },
    ]

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-center">
                    <div className="flex space-x-4">
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                className={`px-4 py-2 rounded-md text-lg font-medium transition-all
                                    ${active === item.name.toLowerCase()
                                        ? "bg-blue-500 text-white shadow-md"
                                        : "text-gray-700 hover:bg-blue-100"}`}
                                onClick={() => {
                                    console.log("Clicked:", item.name.toLowerCase());
                                    setActive(item.name.toLowerCase());
                                }}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );

}
