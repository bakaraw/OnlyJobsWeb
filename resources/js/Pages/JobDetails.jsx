import React, { useState } from "react";
import DashboardCard from "../Components/Dashboard/Modal/DashboardCard.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import DangerButton from "@/Components/DangerButton.jsx";
import axios from "axios";
import Sidebar from "@/Components/Dashboard/Sidebar.jsx";

export default function JobDetails({ job_details, applicants }) {
    const {
        job_title = "N/A",
        job_type = "N/A",
        job_description = "N/A",
        job_location = "N/A",

        company = "",
        views = 'N/A',
        salary_type = "",
        min_salary = "",
        max_salary = "",
        min_experience_years = "",
        requirements = [],
        skills = [],
        status = null,
        degree = null,

    } = job_details;

    console.log('sd', job_details)
    console.log('sd', job_details.degree)
    console.log('sst', job_details.status)



    const [selectedStatus, setSelectedStatus] = useState("all");
    const filteredApplicants = applicants
        .filter((app) => selectedStatus === "all" || app.status?.toLowerCase() === selectedStatus.toLowerCase());



    const handleAccept = async (application) => {
        try {
            let endpoint;
            let newStatus;
            const qualifiedMsg = `Are you sure you want to qualify  ${application.user.first_name}  ${application.user.last_name} ?`;
            const acceptedMsg = `Are you sure you want to accept ${application.user.first_name}  ${application.user.last_name} ?`;

            switch (application.status) {

                case 'Pending':
                    if (confirm(qualifiedMsg)) {

                        endpoint = '/applicants/qualified';
                        newStatus = 'Qualified';
                        break;
                    } else
                        return;

                case 'Qualified':
                    if (confirm(acceptedMsg)) {

                        endpoint = '/applicants/accepted';
                        newStatus = 'Accepted';
                        break;
                    }
                    else
                        return;
                default:
                    console.log('Invalid status for acceptance');
                    return;
            }

            const response = await axios.post(endpoint, {
                application_id: application.id
            });

            if (response.data.success) {
                 window.location.reload();
            }
        } catch (error) {
            console.error("Error updating application status:", error);
        }
    };

    const handleReject = async (application) => {
        try {
            const response = await axios.post('/applicants/rejected', {
                application_id: application.id
            });

            if (response.data.success) {
                // window.location.reload();
            }
        } catch (error) {
            console.error("Error rejecting application:", error);
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
                // window.location.reload();
            } else {
                throw new Error(response.data.message || "Failed to update remark");
            }
        } catch (error) {
            console.error("Failed to save remark:", error);
            alert(error.response?.data?.message || "Failed to save remark. Please try again.");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{job_title}</h2>
                <SecondaryButton
                    className="px-4 py-2  black-white rounded "
                    onClick={() => console.log("Edit button clicked")}
                >
                    Edit
                </SecondaryButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
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



                    <div className="mb-4">
                        <p className="font-semibold">Salary:</p>
                        <p className="text-gray-600">
                            {salary_type === 'Range'
                                ? `$${min_salary.toLocaleString()} - $${max_salary.toLocaleString()}`
                                : `$${min_salary.toLocaleString()}`
                            }
                        </p>
                    </div>
                </div>

                <div>
                    <div className="mb-4">
                        <p className="font-semibold">Experience Required:</p>
                        <p className="text-gray-600">{min_experience_years} years</p>
                    </div>

                    <div className="mb-4">
                        <p className="font-semibold">Education:</p>
                        <p className="text-gray-600">{job_details.degree?.name || 'N/A'}</p>

                    </div>


                    {status && (
                        <div className="mb-4">
                            <p className="font-semibold">Status:</p>
                            <p className="text-gray-600">{job_details.status?.name || 'N/A'}</p>
                        </div>
                    )}

                    <div className="mb-4">
                        <p className="font-semibold">Views:</p>
                        <p className="text-gray-600">{views}</p>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <p className="font-semibold">Description:</p>
                <p className="text-gray-600 whitespace-pre-wrap">{job_description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {skills && skills.length > 0 && (
                    <div className="mb-4">
                        <p className="font-semibold mb-2">Skills:</p>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    {skill.skill_name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {requirements && requirements.length > 0 && (
                    <div className="mb-4">
                        <p className="font-semibold mb-2">Requirements:</p>
                        <ul className="list-disc ml-5">
                            {requirements.map((req, index) => (
                                <li key={index} className="text-gray-600">
                                    {req.requirement_name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <DashboardCard className="border rounded-lg shadow p-4 bg-white">
                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {['all', 'pending', 'qualified', 'accepted', 'rejected'].map(status => (
                        <SecondaryButton
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={`px-4 py-2 rounded-full border transition-all ${
                                selectedStatus === status
                                    ? 'bg-blue-600 text-black'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SecondaryButton>
                    ))}
                </div>

                {filteredApplicants.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="py-2 px-4 text-left">Applicant</th>
                                <th className="py-2 px-4 text-left">Status</th>
                                <th className="py-2 px-4 text-left">Date Applied</th>
                                <th className="py-2 px-4 text-left">Remarks</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredApplicants.map((application, index) => (
                                <tr key={application.id} className="border-t hover:bg-gray-50">
                                    <td className="py-2 px-4">
                                        <div className="flex items-center">
                                            <span className="mr-2 text-gray-500">{index + 1}.</span>
                                            {application.user.first_name} {application.user.last_name}
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 capitalize">{application.status}</td>
                                    <td className="py-2 px-4">
                                        {new Date(application.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="py-2 px-4">
                                        {editingId === application.id ? (
                                            <textarea
                                                className="w-full border p-1 rounded"
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
                                    <td className="py-2 px-4">
                                        {editingId === application.id ? (
                                            <div className="flex space-x-2">
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
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap gap-2">
                                                <SecondaryButton
                                                    className="px-3 py-1"
                                                    onClick={() => {
                                                        setEditingId(application.id);
                                                        setRemarkInput(application.remarks || "");
                                                    }}
                                                >
                                                    Add Remark
                                                </SecondaryButton>

                                                {application.status === 'Pending' && (
                                                    <PrimaryButton
                                                        className="px-3 py-1"
                                                        onClick={() => handleAccept(application)}
                                                    >
                                                        Qualify
                                                    </PrimaryButton>
                                                )}

                                                {application.status === 'Qualified' && (
                                                    <PrimaryButton
                                                        className="px-3 py-1"
                                                        onClick={() => handleAccept(application)}
                                                    >
                                                        Accept
                                                    </PrimaryButton>
                                                )}

                                                {(application.status === 'Pending' || application.status === 'Qualified') && (
                                                    <DangerButton
                                                        className="px-3 py-1"
                                                        onClick={() => handleReject(application)}
                                                    >
                                                        Reject
                                                    </DangerButton>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">
                        No {selectedStatus !== 'all' ? selectedStatus : ''} applicants available.
                    </p>
                )}
            </DashboardCard>
        </div>
    );
}
