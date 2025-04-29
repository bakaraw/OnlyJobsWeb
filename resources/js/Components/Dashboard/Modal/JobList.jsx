import React from "react";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import DangerButton from "@/Components/DangerButton.jsx";
import axios from "axios";

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

export default function JobList({ jobs, onJobSelect }) {
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
                            <th className="py-3 px-4 text-center">Applicants</th>
                            <th className="py-3 px-4 text-center">Qualified</th>
                            <th className="py-3 px-4 text-center">Hired</th>
                            <th className="py-3 px-4 text-center">Rejected</th>
                            <th className="py-3 px-4 text-center">Actions</th>
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
                                <td className="py-3 px-4 text-center">{job.qualified_count}</td>
                                <td className="py-3 px-4 text-center">{job.accepted_count}</td>
                                <td className="py-3 px-4 text-center">{job.rejected_count}</td>
                                <td className="py-3 px-4 text-center">
                                    <div className="flex flex-col space-y-2" onClick={(e) => e.stopPropagation()}>
                                        <SecondaryButton
                                            className="w-24"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                        >
                                            Edit
                                        </SecondaryButton>

                                        <DangerButton
                                            className="w-24"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteJob(job.id);
                                            }}
                                        >
                                            Delete
                                        </DangerButton>
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
