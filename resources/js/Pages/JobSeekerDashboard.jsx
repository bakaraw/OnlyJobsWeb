import React, { useState } from "react";
import Sidebar from "../Components/Dashboard/Sidebar";
import JobList from "@/Components/Dashboard/JobList.jsx";
import { Head } from '@inertiajs/react';
import DashboardContent from "@/Components/Dashboard/DashboardContent.jsx";



export default function JobSeekerDashboard({ jobs, auth }) {

    const [activeView, setActiveView] = useState("dashboard");

    return (

        <div className="flex">
            {/* Sidebar with view switch functionality */}
            <Sidebar auth={auth} setActiveView={setActiveView} />

            {/* Main Content */}
            <div className="flex-1 p-6">
                {activeView === "dashboard" ? (
                    <DashboardContent />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {jobs && jobs.length > 0 ? (
                            jobs.map((job) => <JobList key={job.id} job={job} />)
                        ) : (
                            <p>No job postings available.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
