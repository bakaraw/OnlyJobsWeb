import ContentLayout from "@/Layouts/ContentLayout";
import MainPageLayout from "@/Layouts/MainPageLayout";
import { useState } from "react";
import MessageButton from "@/Components/MessageButton";

export default function ContactUs() {
    const [showMessages, setShowMessages] = useState(false);
    const [form, setForm] = useState({
        name: "",
        surname: "",
        email: "",
        message: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
                },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                throw new Error("Failed to submit contact form");
            }

            const result = await response.json();
            console.log("Success:", result);
            // Optionally reset form or show success message
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <MainPageLayout>
            <ContentLayout>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 md:mt-16 sm:mt-16 xs:mt-16">
                    {/* Left Side */}
                    <div className="md:col-span-2 p-4 md:p-6 rounded border">
                        <h1 className="text-3xl md:text-4xl font-black mb-4">Contact Us</h1>
                        <p className="text-gray-600 mb-2 text-sm md:text-base">
                            Email, call, or complete the form to communicate with an Confederal Project Manpower Services Inc. employee.
                        </p>
                        <p className="text-black mb-2 text-sm md:text-base">company@email.com</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-12">
                            <div>
                                <h2 className="font-semibold text-base md:text-lg">Customer Support</h2>
                                <p className="text-sm text-gray-600">Our team is available around the clock to address any concerns or queries you may have.</p>
                            </div>
                            <div>
                                <h2 className="font-semibold text-base md:text-lg">Feedback and Suggestions</h2>
                                <p className="text-sm text-gray-600">We value your feedback and continuously work to improve OnlyJobs. Your input is crucial in shaping our future.</p>
                            </div>
                            <div>
                                <h2 className="font-semibold text-base md:text-lg">Media Queries</h2>
                                <p className="text-sm text-gray-600">For media-related or press inquiries, contact us on info@onlyjobs.com.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side (Form) */}
                    <div className="p-4 md:p-6 rounded border shadow">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Surname</label>
                                <input
                                    name="surname"
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                                    value={form.surname}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Message</label>
                                <textarea
                                    name="message"
                                    rows="4"
                                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                                    value={form.message}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </ContentLayout>

            <MessageButton
                show={showMessages}
                onClick={() => setShowMessages(true)}
                onClose={() => setShowMessages(false)}
            />
        </MainPageLayout>
    );
}

