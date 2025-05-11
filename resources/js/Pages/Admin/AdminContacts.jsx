import { useEffect, useState } from "react";
import axios from "axios";
import { MailIcon } from "lucide-react"; // Optional: replace with your own icon

export default function AdminContacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await axios.get("/admin/messages/contact/show");
                setContacts(response.data);
            } catch (err) {
                setError("Failed to load contact messages.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500 text-lg">
                Loading contact messages...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-600 bg-red-100 border border-red-300 p-4 rounded">
                {error}
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl">
            <div className="mb-6 flex items-center gap-3">
                <MailIcon className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-gray-800">Contact Us Messages</h2>
            </div>

            {contacts.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                    No messages found. 📨
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {contacts.map((contact) => (
                        <div
                            key={contact.id}
                            className="bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="mb-2">
                                <p className="text-lg font-semibold text-gray-800">{contact.name} {contact.surname}</p>
                                <p className="text-sm text-blue-600">{contact.email}</p>
                            </div>
                            <p className="text-gray-700 whitespace-pre-line">{contact.message}</p>
                            <div className="mt-4 text-sm text-gray-500">
                                Sent on {new Date(contact.created_at).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

