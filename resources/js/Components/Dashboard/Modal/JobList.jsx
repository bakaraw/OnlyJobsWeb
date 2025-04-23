import React, { useState } from "react";
import DashboardCard from "./DashboardCard.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import DangerButton from "@/Components/DangerButton.jsx";
import axios from "axios";

function JobDetails({ job, applicants, onClose, onDelete }) {
    const {
        job_title = "N/A",
        job_type = "N/A",
        job_description = "N/A",
        job_location = "N/A",
        company = "",
    } = job;

    const [selectedStatus, setSelectedStatus] = useState("all");
    const filteredApplicants = applicants
        .filter((app) => app.job_post_id === job.id)
        .filter((app) => selectedStatus === "all" || app.status === selectedStatus);

    const handleAccept = async (application) => {
        try {
            let endpoint, newStatus;
            if (application.status === 'Pending') {
                endpoint = '/applicants/qualified';
                newStatus = 'Qualified';
            } else if (application.status === 'Qualified') {
                endpoint = '/applicants/accepted';
                newStatus = 'Accepted';
            } else {
                return;
            }

            const response = await axios.post(endpoint, { application_id: application.id });
            if (response.data.success) application.status = newStatus;
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const [editingId, setEditingId] = useState(null);
    const [remarkInput, setRemarkInput] = useState("");

    const saveRemark = async (application) => {
        try {
            const response = await axios.patch("/applications/update-remark", {
                application_id: application.id,
                remarks: remarkInput.trim(),
            });

            if (response.data.success) {
                application.remarks = remarkInput.trim();
                setEditingId(null);
                setRemarkInput("");
            }
        } catch (error) {
            console.error("Failed to save remark:", error);
        }
    };

    const handleReject = async (application) => {
        try {
            const response = await axios.post("/applicants/rejected", {
                application_id: application.id
            });
            if (response.data.success) {
                application.status = "Rejected";
            }
        } catch (err) {
            console.error("Failed to reject:", err);
        }
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this job post?")) {
            await onDelete(job.id);
            onClose(); // Close details panel after deletion
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{job_title}</h2>
                <div className="flex space-x-2">
                    <SecondaryButton onClick={onClose}>Close</SecondaryButton>
                    <DangerButton onClick={handleDelete}>Delete Job</DangerButton>
                </div>
            </div>

            <div className="mb-4"><p className="font-semibold">Company:</p><p>{company}</p></div>
            <div className="mb-4"><p className="font-semibold">Location:</p><p>{job_location}</p></div>
            <div className="mb-4"><p className="font-semibold">Type:</p><p>{job_type}</p></div>
            <div className="mb-6"><p className="font-semibold">Description:</p><p>{job_description}</p></div>

            <DashboardCard title="Job Applicant Overview">
                <div className="flex space-x-2 mb-4">
                    {['all', 'Pending', 'Qualified', 'Accepted', 'Rejected'].map(status => (
                        <PrimaryButton
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={`px-4 py-2 ${selectedStatus === status ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            {status}
                        </PrimaryButton>
                    ))}
                </div>

                {filteredApplicants.length > 0 ? (
                    <table className="table-auto w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 text-left">Applicant</th>
                                <th className="py-2 px-4">Status</th>
                                <th className="py-2 px-4">Date</th>
                                <th className="py-2 px-4">Remarks</th>
                                <th className="py-2 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApplicants.map((app) => (
                                <tr key={app.id}>
                                    <td className="px-4 py-2">{app.user.first_name} {app.user.last_name}</td>
                                    <td className="px-4 py-2">{app.status}</td>
                                    <td className="px-4 py-2">{new Date(app.created_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-2">
                                        {editingId === app.id ? (
                                            <textarea value={remarkInput} onChange={(e) => setRemarkInput(e.target.value)} />
                                        ) : (
                                            app.remarks || "No remarks"
                                        )}
                                    </td>
                                    <td className="px-4 py-2 space-x-2">
                                        {editingId === app.id ? (
                                            <>
                                                <PrimaryButton onClick={() => saveRemark(app)}>Save</PrimaryButton>
                                                <SecondaryButton onClick={() => { setEditingId(null); setRemarkInput(""); }}>Cancel</SecondaryButton>
                                            </>
                                        ) : (
                                            <>
                                                <SecondaryButton onClick={() => { setEditingId(app.id); setRemarkInput(app.remarks || ""); }}>
                                                    Add Remark
                                                </SecondaryButton>
                                                <PrimaryButton onClick={() => handleAccept(app)}>Accept</PrimaryButton>
                                                <DangerButton onClick={() => handleReject(app)}>Reject</DangerButton>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No applicants available.</p>
                )}
            </DashboardCard>
        </div>
    );
}

const handleDeleteJob = async (jobId) => {
    if (confirm("Are you sure you want to delete this job post?")) {
        try {
            await axios.delete(`/job-posts/${jobId}`);
            alert("Job deleted!");
        } catch (error) {
            alert("Something went wrong!");
            console.error(error);
        }

    }
};

//import React, { useState } from "react";
//import JobDetails from "./JobDetails.jsx";
//import SecondaryButton from "@/Components/SecondaryButton.jsx";
//import axios from "axios";

export default function JobList({ jobs, applicants }) {
    const [jobList, setJobList] = useState(jobs);
    const [selectedJob, setSelectedJob] = useState(null);

    const handleDeleteJob = async (jobId) => {
        try {
            await axios.delete(`/job-posts/${jobId}`);
            alert("Job deleted!");
            setJobList(jobList.filter(job => job.id !== jobId));
        } catch (error) {
            alert("Failed to delete job.");
            console.error(error);
        }
    };

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
                            <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobList.map((job) => (
                            <tr key={job.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">{job.job_title}</td>
                                <td className="py-3 px-4">{job.job_location}</td>
                                <td className="py-3 px-4">{job.job_type}</td>
                                <td className="py-3 px-4 text-center">
                                    <SecondaryButton onClick={() => setSelectedJob(job)}>
                                        View Details
                                    </SecondaryButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedJob && (
                <JobDetails
                    job={selectedJob}
                    applicants={applicants}
                    onClose={() => setSelectedJob(null)}
                    onDelete={handleDeleteJob}
                />
            )}
        </div>
    );
}
