import React, { useState } from "react";
import Sidebar from "../Components/Dashboard/Sidebar";
import JobList from "@/Components/Dashboard/Modal/JobList.jsx"; // Job card component
import DashboardContent from "@/Components/Dashboard/DashboardContent.jsx";
import NavBar from "@/Components/NavBar.jsx";
import CreateJobPost from "@/Pages/CreateJobPost.jsx";
export default function dashboard({ jobs, placements, auth, totalViews, totalUsers, totalJob, applicants}) {

    const [activeView, setActiveView] = useState("dashboard");

    console.log("placements", placements);
    console.log("jobs", jobs);

    return (

        <div className="flex">
            {/* Sidebar Component */}
            <Sidebar auth={auth} setActiveView={setActiveView} />


            <div className="flex-1 p-6">
                {activeView === "dashboard" ? (
                    <DashboardContent jobs={jobs} placements={placements}  totalViews={totalViews} totalUsers={totalUsers}
                                      totalJob={totalJob} applicants={applicants}  auth={auth}/>
                ) : (
                    <div >
                        {/* Left: Job Listings (Only Show if Authenticated) */}
                        {auth?.user ? (
                            <div className="w-full">
                                {jobs && jobs.length > 0 ? (
                                    <JobList jobs={jobs} applicants={applicants}/>
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

    );
}
