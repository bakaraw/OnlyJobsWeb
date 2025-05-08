import React, { useState } from "react";
import Sidebar from "../Components/Dashboard/Sidebar";
import JobList from "@/Components/Dashboard/Modal/JobList.jsx";
import JobDetails from "@/Pages/JobDetails.jsx"; // Import the JobDetails component
import DashboardContent from "@/Components/Dashboard/DashboardContent.jsx";
import ApplicantCard from "@/Components/Dashboard/Modal/ApplicantCard.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import ApplicantDetails from "@/Pages/ApplicantDetails.jsx";
import AdminMessages from "./Admin/AdminMessages";

export default function dashboard({ jobView, statuses, requirements, degrees, slot,getJobPostData, jobs, placements, auth, totalApplicants, users, totalViews, totalUsers, totalJob, applicants }) {
    const [activeView, setActiveView] = useState("dashboard");
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [selectedApplicantId, setSelectedApplicantId] = useState(null);


    const selectedJob = selectedJobId ? getJobPostData.find(job => job.id === selectedJobId) : null;
    const selectedApplicant = selectedApplicantId ? users.find(user => user.id === selectedApplicantId) : null;

    console.log("placements", placements);
    console.log("jobs", jobs);
    console.log("users", users);


    const handleApplicantSelect = (applicantId) => {
        setSelectedApplicantId(applicantId);
        setActiveView("applicantDetails");
    };

    const handleBackToApplicants = () => {
        setSelectedApplicantId(null);
        setActiveView("applicants");
    };


    const handleJobSelect = (jobId) => {
        setSelectedJobId(jobId);
        setActiveView("jobDetails"); // Switch to job details view
    };

    const handleBackToJobs = () => {
        setSelectedJobId(null);
        setActiveView("jobs"); // Go back to jobs list
    };

    return (
        <div className="flex">
            {/* Sidebar Component */}
            <Sidebar auth={auth} setActiveView={setActiveView} />

            <div className="flex-1 p-6">
                {activeView === "dashboard" ? (
                    <DashboardContent
                        jobs={jobs}
                        placements={placements}
                        totalViews={totalViews}
                        totalUsers={totalUsers}
                        totalJob={totalJob}
                        applicants={applicants}
                        jobView={jobView}
                        auth={auth}

                    />
                ) : activeView === "applicants" ? (
                    <ApplicantCard
                        users={users}
                        applicants={applicants}
                        auth={auth}
                        onApplicantSelect={handleApplicantSelect}
                        onBack={handleBackToApplicants}

                    />
                ) : activeView === "applicantDetails" && selectedApplicant ? (
                    <div>
                        {/*<SecondaryButton*/}
                        {/*    onClick={handleBackToApplicants}*/}
                        {/*    className="mb-4 flex items-center text-blue-600 hover:text-blue-800"*/}
                        {/*>*/}
                        {/*    Back*/}
                        {/*</SecondaryButton>*/}
                        <ApplicantDetails
                            selectedApplicant={selectedApplicant}
                            auth={auth}
                            onBack={handleBackToApplicants}

                        />
                    </div>

                ) : activeView === "jobDetails" && selectedJob ? (
                    <div>
                        {/*<SecondaryButton*/}
                        {/*    onClick={handleBackToJobs}*/}
                        {/*    className="mb-4 flex items-center text-blue-600 hover:text-blue-800"*/}
                        {/*>*/}

                        {/*    Back*/}
                        {/*</SecondaryButton>*/}
                        <JobDetails
                            edit_status={statuses}
                            edit_requirements={requirements}
                            degrees={degrees}
                            slot={slot}
                            job_details={selectedJob}
                            applicants={applicants.filter(app => app.job_post_id === selectedJob.id)}
                            onBack={handleBackToJobs}

                        />
                    </div>
                ) : activeView === "messages" ? (
                    <AdminMessages
                        onJobSelect={handleJobSelect}
                    />
                ) : (
                    <div>
                        {auth?.user ? (
                            <div className="w-full">
                                {jobs && jobs.length > 0 ? (
                                    <JobList
                                        jobs={jobs}
                                        applicants={applicants}
                                        totalApplicants={totalApplicants}
                                        onJobSelect={handleJobSelect}
                                    />
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
