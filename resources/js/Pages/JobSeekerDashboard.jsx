import React, { useState } from "react";
import Sidebar from "../Components/Dashboard/Sidebar";
import JobList from "@/Components/Dashboard/JobList.jsx"; // Job card component
import Placements from "@/Components/Dashboard/Placements.jsx"; // Placement card component
import DashboardContent from "@/Components/Dashboard/DashboardContent.jsx";

export default function JobSeekerDashboard({ jobs, placements, auth }) {
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Render Job Cards */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Job Listings</h2>
                            {jobs && jobs.length > 0 ? (
                                jobs.map((job) => (
                                    <div key={job.id} className="border p-4 rounded-md shadow-md bg-white hover:shadow-lg transition mb-4">
                                        <JobList job={job} />
                                    </div>
                                ))
                            ) : (
                                <p>No job postings available.</p>
                            )}
                        </div>

                        {/* Render Placement Cards */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Job Seeker Placement</h2>
                            {placements && placements.length > 0 ? (
                                <Placements placements={placements} />
                            ) : (
                                <p>No placements available.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
