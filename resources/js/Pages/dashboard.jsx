import React, { useState } from "react";
import Sidebar from "../Components/Dashboard/Sidebar";
import JobList from "@/Components/Dashboard/Modal/JobList.jsx"; // Job card component
import DashboardContent from "@/Components/Dashboard/DashboardContent.jsx";
import NavBar from "@/Components/NavBar.jsx";

export default function dashboard({ jobs, placements, auth, totalViews, totalUsers, totalJob}) {
    const [activeView, setActiveView] = useState("dashboard");

    console.log("placements", placements);
    console.log("jobs", jobs);

    return (
        <>
            {/* ✅ Fixed Navigation Bar */}
            <NavBar />

            {/* ✅ Main Content with Top Padding to avoid overlap */}
            <div className="flex pt-20">
                {/* Sidebar Component */}
            <Sidebar auth={auth} setActiveView={setActiveView} />

            <div className="flex-1 p-6">
                {activeView === "dashboard" ? (
                    <DashboardContent jobs={jobs} placements={placements}  totalViews={totalViews} totalUsers={totalUsers}
                                      totalJob={totalJob} />

                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-lg shadow-lg">
                        {/* Left: Job Listings (Only Show if Authenticated) */}
                        {auth?.user ? (
                            <div className="w-full">
                                <h2 className="text-xl font-semibold mb-4">Job Listings</h2>
                                {jobs && jobs.length > 0 ? (
                                    jobs.map((job) => (
                                        <JobList key={job.id} job={job} placements={placements} />
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
                    </div>
                )}
            </div>
            </div>
        </>
    );
}
