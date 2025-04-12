import React, { useState } from "react";

function JobDetails({ job, applicants, onClose }) {
    const {
        job_title = "N/A",
        job_type = "N/A",
        job_description = "N/A",
        job_location = "N/A",
        company = ""
    } = job;

    const filteredApplicants = applicants.filter(app => app.job_post_id === job.id);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4">
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

                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4">Applicants</h3>
                    {filteredApplicants.length > 0 ? (
                        <table className="w-full">
                            <thead>
                            <tr>
                                <th className="py-2">User</th>
                                <th className="py-2">Status</th>
                                <th className="py-2">Date Placed</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredApplicants.map((applicant) => (
                                <tr key={applicant.id} className="border-t">
                                    <td className="py-2">{applicant.user?.first_name || "N/A"}</td>
                                    <td className="py-2">{applicant.status}</td>
                                    <td className="py-2">{new Date(applicant.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-500">No applicants available.</p>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                    >
                        Close
                    </button>
                </div>
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
