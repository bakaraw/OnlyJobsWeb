import React from "react";

export default function DashboardContent() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* User Management */}
                <div className="border p-4 rounded-md shadow-md bg-white">
                    <h2 className="text-lg font-semibold">User Management & Verification</h2>
                    <ul className="text-sm text-gray-600 mt-2">
                        <li>✔ Manage registered users (Job Seekers & Employers)</li>
                        <li>✔ Document submission and verification</li>
                        <li>✔ Status tracker for verification progress</li>
                    </ul>
                </div>

                {/* Job Order Management */}
                <div className="border p-4 rounded-md shadow-md bg-white">
                    <h2 className="text-lg font-semibold">Job Order Management</h2>
                    <ul className="text-sm text-gray-600 mt-2">
                        <li>✔ Monitor job order progress</li>
                        <li>✔ Automated reminders (optional)</li>
                    </ul>
                </div>

                {/* Reporting & Analytics */}
                <div className="border p-4 rounded-md shadow-md bg-white">
                    <h2 className="text-lg font-semibold">Reporting & Analytics</h2>
                    <ul className="text-sm text-gray-600 mt-2">
                        <li>✔ Real-time reports on applications</li>
                        <li>✔ Messaging tools for communication</li>
                        <li>✔ Notification systems for updates</li>
                    </ul>
                </div>

                {/* Administrative Tools */}
                <div className="border p-4 rounded-md shadow-md bg-white">
                    <h2 className="text-lg font-semibold">Administrative Tools & Settings</h2>
                    <ul className="text-sm text-gray-600 mt-2">
                        <li>✔ Dashboard overview with quick stats</li>
                        <li>✔ Instant insights into pending verifications & job orders</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
