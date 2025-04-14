
import React, { useState } from "react";
import DashboardCard from "./DashboardCard.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import DangerButton from "@/Components/DangerButton.jsx";

function JobDetails({ job, applicants, onClose }) {
    const {
        job_title = "N/A",
        job_type = "N/A",
        job_description = "N/A",
        job_location = "N/A",
        company = "",
        views = 'N/A',
        applications = "N/A",
    } = job;


    const [filterStatus, setFilterStatus] = useState("pending");

    const filteredApplicants = applicants.filter(
        app => app.job_post_id === job.id && app.status === filterStatus
    );
    const handleAccept = async (application) => {
        try {
            let endpoint;
            let newStatus;
            switch (application.status) {
                case 'pending':
                    endpoint = '/applicants/qualified';
                    newStatus = 'qualified';
                    break;
                case 'qualified':
                    endpoint = '/applicants/accepted';
                    newStatus = 'accepted';
                    break;
                default:
                    console.log('Invalid status for acceptance');
                    return;
            }

            const response = await axios.post(endpoint, {
                application_id: application.id
            });

            if (response.data.success) {
                application.status = newStatus;
                // Force a re-render by updating the state that contains applicants
                window.location.reload(); // Temporary solution - consider using state management
            }

        } catch (error) {
            console.error("Error updating application status:", error);
        }
    };
    // const handleReject = (application) => {
    //     try {
    //         const response = await axios
    //     }
    //     // Your logic here
    // };

    const [editingId, setEditingId] = useState(null);
    const [remarkInput, setRemarkInput] = useState("");

    // Save updated remark to the backend using the new updateRemark endpoint.
    const saveRemark = async (application) => {
        try {
            const response = await axios.patch("/applications/update-remark", {
                application_id: application.id, // use the unique id for the application record
                remarks: remarkInput.trim(),
            });

            if (response.data.success) {
                application.remarks = remarkInput.trim();
                setEditingId(null);
                setRemarkInput("");
            } else {
                throw new Error(response.data.message || "Failed to update remark");
            }
        } catch (error) {
            console.error("Failed to save remark:", error);
            alert(error.response?.data?.message || "Failed to save remark. Please try again.");
        }
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
                {/* Filter Buttons */}
                <div className="flex space-x-2 mb-4">
                    {["pending", "qualified","accepted", "rejected"].map(status => (
                        <PrimaryButton
                            key={status}
                            className={`px-4 py-2 rounded capitalize ${
                                filterStatus === status
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-700"
                            }`}
                            onClick={() => setFilterStatus(status)}
                        >
                            {status}
                        </PrimaryButton>
                    ))}
                </div>

                {filteredApplicants.filter(app => app.status === filterStatus).length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse">
                            <thead>
                            <tr>
                                <th className="py-2 px-4 text-left">Applicant</th>
                                <th className="py-2 px-4 text-left">Status</th>
                                <th className="py-2 px-4 text-left">Date Placed</th>
                                <th className="py-2 px-4 text-left">Remarks</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredApplicants
                                .filter(application => application.status === filterStatus)
                                .map((application) => (
                                    <tr key={application.id} className="border-t hover:bg-gray-100">
                                        <td className="py-2 px-4">
                                            {application.user.first_name} {application.user.last_name}
                                        </td>
                                        <td className="py-2 px-4 capitalize">{application.status}</td>
                                        <td className="py-2 px-4">
                                            {new Date(application.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-2 px-4">
                                            {editingId === application.id ? (
                                                <textarea
                                                    className="w-full border p-1"
                                                    value={remarkInput}
                                                    onChange={(e) => setRemarkInput(e.target.value)}
                                                    rows={2}
                                                />
                                            ) : (
                                                <span>
                                            {application.remarks && application.remarks !== ""
                                                ? application.remarks
                                                : "No remarks"}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 flex space-x-2">
                                            {editingId === application.id ? (
                                                <>
                                                    <PrimaryButton
                                                        className="px-3 py-1"
                                                        onClick={() => saveRemark(application)}
                                                    >
                                                        Save
                                                    </PrimaryButton>
                                                    <SecondaryButton
                                                        className="px-3 py-1"
                                                        onClick={() => {
                                                            setEditingId(null);
                                                            setRemarkInput("");
                                                        }}
                                                    >
                                                        Cancel
                                                    </SecondaryButton>
                                                </>
                                            ) : (
                                                <>
                                                    <PrimaryButton
                                                        className="px-3 py-1"
                                                        onClick={() => {
                                                            setEditingId(application.id);
                                                            setRemarkInput(application.remarks || "");
                                                        }}
                                                    >
                                                        Add Remark
                                                    </PrimaryButton>
                                                    <PrimaryButton
                                                        className="px-3 py-1"
                                                        onClick={() => handleAccept(application)}
                                                    >
                                                        Accept
                                                    </PrimaryButton>
                                                    <DangerButton
                                                        className="px-3 py-1"
                                                        onClick={() => handleReject(application)}
                                                    >
                                                        Reject
                                                    </DangerButton>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 capitalize">
                        No {filterStatus} applicants available.
                    </p>
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


export default function JobList({ jobs, applicants, totalApplicants }) {
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
                        <th className="py-3 px-4 text-center">Applicants</th>
                        <th className="py-3 px-4 text-center">Qualified Candidate</th>
                        <th className="py-3 px-4 text-center">Hired Candidate</th>
                        <th className="py-3 px-4 text-center">Rejected Candidate</th>




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
                            <td className="py-3 px-4">{job.job_location}</td>
                            <td className="py-3 px-4">{job.job_type}</td>
                            <td className="py-3 px-4">{job.views || "None"}</td>
                            <td className="py-3 px-4 text-center">{job.applications_count}</td>
                            <td className="py-3 px-4 text-center">{job.qualified_count}</td>
                            <td className="py-3 px-4 text-center">{job.accepted_count}</td>
                            <td className="py-3 px-4 text-center">{job.rejected_count}</td>


                            <td className="py-3 px-4 text-center">

                                <DangerButton
                                    className="px-3 py-1 bg-red-500  hover:bg-red-600"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteJob(job.id);
                                    }}
                                >
                                    Delete
                                </DangerButton>
                            </td>




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
