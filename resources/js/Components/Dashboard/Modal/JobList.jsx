import React, { useState } from "react";
import DashboardCard from "./DashboardCard.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";

function JobDetails({ job, applicants, onClose }) {
    const {
        job_title = "N/A",
        job_type = "N/A",
        job_description = "N/A",
        job_location = "N/A",
        company = ""
    } = job;

    // Filter only applicants for this specific job
    const filteredApplicants = applicants.filter(app => app.job_post_id === job.id);

    const handleAccept = (application) => {
        // Your logic here
        console.log("Accepted:", application);
    };

    const handleReject = (application) => {
        // Your logic here
        console.log("Rejected:", application);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-2xl font-bold mb-4">{job_title}</h2>

            <div className="mb-4">
                <p className="font-semibold">Company:</p>
                <p className="text-gray-600">{company}</p>
            </div>

            <div className="mb-4">
                <p className="font-semibold">Location:</p>
                <p className="text-gray-600">{job_location}</p>
            </div>

            <div className="mb-4">
                <p className="font-semibold">Type:</p>
                <p className="text-gray-600">{job_type}</p>
            </div>

            <div className="mb-6">
                <p className="font-semibold">Description:</p>
                <p className="text-gray-600">{job_description}</p>
            </div>

            <DashboardCard title="Job Applicant Overview">
                {filteredApplicants.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse">
                            <thead>
                            <tr>
                                <th className="py-2 px-4">Job Title</th>
                                <th className="py-2 px-4">Applicant</th>
                                <th className="py-2 px-4">Status</th>
                                <th className="py-2 px-4">Date Placed</th>
                                <th className="py-2 px-4">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredApplicants.map((application) => (
                                <tr key={application.id} className="border-t hover:bg-gray-100">
                                    <td className="py-2 px-4">{job_title}</td>
                                    <td className="py-2 px-4">
                                        {application.user.first_name} {application.user.last_name}
                                    </td>
                                    <td className="py-2 px-4">{application.status}</td>
                                    <td className="py-2 px-4">
                                        {new Date(application.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="py-2 px-4 flex space-x-2">
                                        <SecondaryButton
                                            className="px-3 py-1"
                                            onClick={() => handleAccept(application)}
                                        >
                                            Accept
                                        </SecondaryButton>
                                        <SecondaryButton
                                            className="px-3 py-1"
                                            onClick={() => handleReject(application)}
                                        >
                                            Reject
                                        </SecondaryButton>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500">No applicants available.</p>
                )}
            </DashboardCard>

            <div className="flex justify-end mt-4">
                <button
                    onClick={onClose}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default function JobList({ jobs, applicants }) {
    const [showDetails, setShowDetails] = useState(false);
    const [selectedJobDetails, setSelectedJobDetails] = useState(null);

    return (
        <div className="w-full px-4">
            <h3 className="text-xl font-semibold mb-4">Job Listings</h3>

            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse">
                    <thead className="bg-gray-100 text-left">
                    <tr>
                        <th className="py-3 px-4">Title</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4 text-center">Views</th>
                    </tr>
                    </thead>
                    <tbody>
                    {jobs.map((job) => (
                        <tr
                            key={job.id}
                            className="border-b hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                                setSelectedJobDetails(job);
                                setShowDetails(true);
                            }}
                        >
                            <td className="py-3 px-4">{job.job_title}</td>
                            <td className="py-3 px-4">{job.job_location || "N/A"}</td>
                            <td className="py-3 px-4">{job.job_type || "N/A"}</td>
                            <td className="py-3 px-4 text-center">{job.views}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {showDetails && selectedJobDetails && (
                <JobDetails
                    job={selectedJobDetails}
                    applicants={applicants}
                    onClose={() => setShowDetails(false)}
                />
            )}
        </div>
    );
}
