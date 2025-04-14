import React, {useState} from "react";
import { Package } from "lucide-react";
import DangerButton from "@/Components/DangerButton.jsx";

export default function Sidebar({ auth, setActiveView }) {


    return (


        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
            {/* Profile Section */}
            <div className="flex flex-col items-center py-6 border-b border-gray-200">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-2 border-4 border-gray-300 ring-2 ring-white">
                    <img
                       // src={auth?.user?.profileImage || "/default-profile.png"}
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
                            Dashboard
                        </button>
                    </li>

                    <li>
                        <button
                            onClick={() => setActiveView("joblist")}
                            className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-gray-100 focus:outline-none"
                        >
                            <Package className="w-5 h-5 mr-3" />
                            Job Posting
                        </button>
                    </li>

                </ul>




            </nav>
            <div className="mt-auto mb-4 px-6">
                <form action={route('logout')} method="POST" style={{ display: 'inline' }}>
                    <input type="hidden" name="_token" value="{{ csrf_token() }}" />
                    <DangerButton
                        type="submit"
                    >
                        Log Out
                    </DangerButton>
                </form>
            </div>
        </div>
    );
}
