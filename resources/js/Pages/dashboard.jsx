import React, { useState } from "react";
import Sidebar from "../Components/Dashboard/Sidebar";
import JobList from "@/Components/Dashboard/JobList.jsx"; // Job card component
import Placements from "@/Components/Dashboard/Placements.jsx"; // Placement card component
import DashboardContent from "@/Components/Dashboard/DashboardContent.jsx";

export default function dashboard({ jobs, placements, auth }) {
    const [activeView, setActiveView] = useState("dashboard");

    console.log("placements", placements);
    console.log("jobs", jobs);

    return (
        <div className="flex">
            {/* Sidebar Component */}
            <Sidebar auth={auth} setActiveView={setActiveView} />

            <div className="flex-1 p-6">
                {activeView === "dashboard" ? (
                    <DashboardContent />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-lg shadow-lg">
                        {/* Left: Job Listings (Only Show if Authenticated) */}
                        {auth?.user ? (
                            <div className="w-full">
                                <h2 className="text-xl font-semibold mb-4">Job Listings</h2>
                                {jobs && jobs.length > 0 ? (
                                    jobs.map((job) => (
                                        <JobList key={job.id} job={job} />
                                    ))
                                ) : (
                                    <p className="text-gray-500">No job postings available.</p>
                                )}

                            </div>

                        ) : (
                            <div className="w-full text-center p-6 bg-red-100 border border-red-400 text-red-600 rounded-md">
                                <p>You need to be logged in to view job listings.</p>
                            </div>
                        )}

                        {/* Right: Job Seeker Placements (Only Show if Authenticated) */}
                        {auth?.user ? (
                            <div className="w-full">
                                <h2 className="text-xl font-semibold mb-4">Placements</h2>
                                {placements && placements.length > 0 ? (
                                    placements.map((placement) => (
                                        <Placements key={placement.id} placement={placement} />
                                    ))
                                ) : (
                                    <p className="text-gray-500">No placements available.</p>
                                )}
                            </div>
                        ) : (
                            <div className="w-full text-center p-6 bg-red-100 border border-red-400 text-red-600 rounded-md">
                                <p>You need to be logged in to view placements.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
