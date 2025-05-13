import React, { useState } from "react";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import DangerButton from "@/Components/DangerButton.jsx";
import axios from "axios";
import CreateJobPostModal from "./CreateJobPostModal";

const handleDeleteJob = async (jobId) => {
    if (confirm("Are you sure you want to delete this job post?")) {
        try {
            await axios.delete(`/job-posts/${jobId}`);
            alert("Job deleted successfully!");
            // window.location.reload();
        } catch (error) {
            alert("Something went wrong!");
            console.error(error);
        }
    }
};

const statusStyles = {
    Active: 'bg-green-300 text-green-900',
    Closed: 'bg-red-300 text-red-900',
    'Temporary Closed': 'bg-yellow-300 text-yellow-900',
    Updated: 'bg-blue-300 text-blue-900',
};

export default function JobList({ jobs, onJobSelect }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="w-full px-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Job Listings</h3>
                <SecondaryButton
                    onClick={() => setIsModalOpen(true)}
                >
                    + Create Job
                </SecondaryButton>
            </div>
            <CreateJobPostModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="py-3 px-4">Title</th>
                            <th className="py-3 px-4">Location</th>
                            <th className="py-3 px-4">Type</th>
                            <th className="py-3 px-4 text-center">Views</th>
                            <th className="py-3 px-4 text-center">Applicants</th>
                            <th className="py-3 px-4 text-center">Slots</th>
                            <th className="py-3 px-4 text-center">Qualified</th>
                            <th className="py-3 px-4 text-center">Hired</th>
                            <th className="py-3 px-4 text-center">Rejected</th>
                            <th className="py-3 px-4 text-center">Status</th>
                            <th className="py-3 px-4 text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((job, index) => (
                            <tr
                                key={job.id}
                                className="border-b hover:bg-gray-50 cursor-pointer"
                                onClick={() => onJobSelect(job.id)}
                            >
                                <td className="py-3 px-4">
                                    <div className="flex items-center">
                                        <span className="mr-2 text-gray-500">{index + 1}.</span>
                                        {job.job_title}
                                    </div>
                                </td>
                                <td className="py-3 px-4">{job.job_location}</td>
                                <td className="py-3 px-4">{job.job_type}</td>
                                <td className="py-3 px-4 text-center">{job.views || 0}</td>
                                <td className="py-3 px-4 text-center">{job.applications_count}</td>
                                <td className="py-3 px-4 text-center">{job.slot}</td>
                                <td className="py-3 px-4 text-center">{job.qualified_count}</td>
                                <td className="py-3 px-4 text-center">{job.accepted_count}</td>
                                <td className="py-3 px-4 text-center">{job.rejected_count}</td>
                                <td className="py-3 px-4 text-center">
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full inline-block ${statusStyles[job.status?.name]}`}>
                                        {job.status?.name}
                                    </span>
                                </td>
                                <td className="text-center">
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteJob(job.id);
                                                setOpenMenuJobId(null);
                                            }}
                                            className="text-red-500 hover:underline"
                                        >
                                            Delete
                                        </button>

                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
}
