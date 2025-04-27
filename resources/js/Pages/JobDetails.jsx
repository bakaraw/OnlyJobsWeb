import React, { useState } from "react";
import DashboardCard from "../Components/Dashboard/Modal/DashboardCard.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import DangerButton from "@/Components/DangerButton.jsx";
import axios from "axios";

export default function JobDetails({ job_details, applicants }) {
    const jobId = job_details.id;

    const [isEditing, setIsEditing] = useState(false);
    const [editingJob, setEditingJob] = useState({
        job_title: job_details.job_title || "",
        job_description: job_details.job_description || "",
        job_location: job_details.job_location || "",
        job_type: job_details.job_type || "",
        min_salary: job_details.min_salary || 0,
        max_salary: job_details.max_salary || 0,
        salary_type: job_details.salary_type || "Fixed",
        min_experience_years: job_details.min_experience_years || 0,
        company: job_details.company || "",
        degree_id: job_details.degree_id || null,
        status_id: job_details.status_id || null,

        // Map to the actual IDs from the server response
        skills: job_details.skills?.map(s => s.skill_id) || [],
        requirements: job_details.requirements?.map(r => r.requirement_id) || []
    });

    const [newSkill, setNewSkill] = useState("");
    const [newRequirement, setNewRequirement] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");

    const displaySkills = isEditing ? editingJob.skills : job_details.skills || [];
    const displayRequirements = isEditing ? editingJob.requirements : job_details.requirements || [];
    const degreeName = job_details.degree?.degree_name || "N/A";

    const filteredApplicants = applicants.filter(app =>
        selectedStatus === "all" ||
        app.status?.toLowerCase() === selectedStatus.toLowerCase()
    );

    console.log("Job details:", job_details);
    console.log("Skills:", job_details.skills);
    console.log("Requirements:", job_details.requirements);
    console.log("Degree:", job_details.degree);

    const addSkill = () => {
        if (newSkill.trim()) {
            setEditingJob({
                ...editingJob,
                skills: [...editingJob.skills, parseInt(newSkill, 10)]
            });
            setNewSkill("");
        }
    };

    const removeSkill = idx => {
        const skills = editingJob.skills.filter((_, i) => i !== idx);
        setEditingJob({ ...editingJob, skills });
    };

    const addRequirement = () => {
        if (newRequirement.trim()) {
            setEditingJob({
                ...editingJob,
                requirements: [...editingJob.requirements, parseInt(newRequirement, 10)]
            });
            setNewRequirement("");
        }
    };

    const removeRequirement = idx => {
        const requirements = editingJob.requirements.filter((_, i) => i !== idx);
        setEditingJob({ ...editingJob, requirements });
    };

    const saveJobDetails = async () => {
        try {
            await axios.put(`/job-posts/edit/${jobId}`, editingJob);
            alert("Job updated successfully");
            setIsEditing(false);
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to update job.");
        }
    };

    const handleAccept = async (application) => {
        try {
            let endpoint;
            switch (application.status) {
                case 'Pending':
                    endpoint = '/applicants/qualified';
                    break;
                case 'Qualified':
                    endpoint = '/applicants/accepted';
                    break;
                default:
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
                window.location.reload();
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
                window.location.reload();
            }
        } catch (error) {
            console.error("Failed to save remark:", error);
            alert(error.response?.data?.message || "Failed to save remark. Please try again.");
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full">
            <div className="flex justify-between items-center mb-6">
                {isEditing ? (
                    <div className="flex space-x-2">
                        <PrimaryButton onClick={saveJobDetails}>Save</PrimaryButton>
                        <SecondaryButton onClick={() => setIsEditing(false)}>Cancel</SecondaryButton>
                    </div>
                ) : (
                    <PrimaryButton
                        onClick={() => setIsEditing(true)}
                        className="text-white px-4 py-2 rounded-lg text-sm"
                    >
                        Edit Job
                    </PrimaryButton>
                )}
            </div>

            {/* Job Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    {/* Company */}
                    <div className="mb-4">
                        <p className="font-semibold">Company:</p>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editingJob.company}
                                onChange={e => setEditingJob({ ...editingJob, company: e.target.value })}
                                className="border p-2 w-full rounded"
                            />
                        ) : (
                            <p className="text-gray-600">{editingJob.company}</p>
                        )}
                    </div>

                    {/* Title */}
                    <div className="mb-4">
                        <p className="font-semibold">Job title:</p>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editingJob.job_title}
                                onChange={e => setEditingJob({ ...editingJob, job_title: e.target.value })}
                                className="border p-2 w-full rounded"
                            />
                        ) : (
                            <p className="text-gray-600">{editingJob.job_title}</p>
                        )}
                    </div>

                    {/* Location */}
                    <div className="mb-4">
                        <p className="font-semibold">Location:</p>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editingJob.job_location}
                                onChange={e => setEditingJob({ ...editingJob, job_location: e.target.value })}
                                className="border p-2 w-full rounded"
                            />
                        ) : (
                            <p className="text-gray-600">{editingJob.job_location}</p>
                        )}
                    </div>

                    {/* Type */}
                    <div className="mb-4">
                        <p className="font-semibold">Type:</p>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editingJob.job_type}
                                onChange={e => setEditingJob({ ...editingJob, job_type: e.target.value })}
                                className="border p-2 w-full rounded"
                            />
                        ) : (
                            <p className="text-gray-600">{editingJob.job_type}</p>
                        )}
                    </div>

                    {/* Salary */}
                    <div className="mb-4">
                        <p className="font-semibold">Salary:</p>
                        {isEditing ? (
                            <>
                                <div className="mb-2">
                                    <select
                                        value={editingJob.salary_type}
                                        onChange={e => setEditingJob({ ...editingJob, salary_type: e.target.value })}
                                        className="border p-2 w-full rounded"
                                    >
                                        <option value="Fixed">Fixed</option>
                                        <option value="Range">Range</option>
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={editingJob.min_salary}
                                        onChange={e => setEditingJob({ ...editingJob, min_salary: e.target.value })}
                                        className="border p-2 w-full rounded"
                                        placeholder="Min Salary"
                                    />
                                    {editingJob.salary_type === 'Range' && (
                                        <input
                                            type="number"
                                            value={editingJob.max_salary}
                                            onChange={e => setEditingJob({ ...editingJob, max_salary: e.target.value })}
                                            className="border p-2 w-full rounded"
                                            placeholder="Max Salary"
                                        />
                                    )}
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-600">
                                {editingJob.salary_type === 'Range'
                                    ? `$${Number(editingJob.min_salary).toLocaleString()} - $${Number(editingJob.max_salary).toLocaleString()}`
                                    : `$${Number(editingJob.min_salary).toLocaleString()}`}
                                {' '}({editingJob.salary_type})
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    {/* Experience */}
                    <div className="mb-4">
                        <p className="font-semibold">Experience Required:</p>
                        {isEditing ? (
                            <input
                                type="number"
                                value={editingJob.min_experience_years}
                                onChange={e => setEditingJob({ ...editingJob, min_experience_years: e.target.value })}
                                className="border p-2 w-full rounded"
                            />
                        ) : (
                            <p className="text-gray-600">{editingJob.min_experience_years} years</p>
                        )}
                    </div>

                    {/* Education */}
                    <div className="mb-4">
                        <p className="font-semibold">Education:</p>
                        {isEditing ? (
                            <select
                                value={editingJob.degree_id || ''}
                                onChange={e => setEditingJob({ ...editingJob, degree_id: e.target.value })}
                                className="border p-2 w-full rounded"
                            >
                                <option value="">Select Education</option>
                                <option value="1">High School</option>
                                <option value="2">Bachelor's Degree</option>
                                <option value="3">Master's Degree</option>
                                <option value="4">PhD</option>
                            </select>
                        ) : (
                            <p className="text-gray-600">{degreeName}</p>
                        )}
                    </div>

                    {/* Views */}
                    <div className="mb-4">
                        <p className="font-semibold">Views:</p>
                        <p className="text-gray-600">{job_details.views}</p>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="mb-6">
                <p className="font-semibold">Description:</p>
                {isEditing ? (
                    <textarea
                        rows={5}
                        value={editingJob.job_description}
                        onChange={e => setEditingJob({ ...editingJob, job_description: e.target.value })}
                        className="border p-2 w-full rounded"
                    />
                ) : (
                    <p className="text-gray-600 whitespace-pre-wrap">{editingJob.job_description}</p>
                )}
            </div>

            {/* Skills & Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <p className="font-semibold mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {isEditing ?
                            editingJob.skills.map((skillId, i) => {
                                const skillObj = job_details.skills?.find(s => s.id === skillId || s.skill_id === skillId);
                                const skillName = skillObj ? skillObj.skill_name : `Skill ${skillId}`;
                                return (
                                    <span key={i} className="flex items-center bg-blue-100 px-3 py-1 rounded-full text-sm">
                                        {skillName}
                                        <button onClick={() => removeSkill(i)} className="ml-2 text-red-500">×</button>
                                    </span>
                                );
                            })
                            :
                            (job_details.skills || []).map((skill, i) => (
                                <span key={i} className="flex items-center bg-blue-100 px-3 py-1 rounded-full text-sm">
                                    {skill.skill_name}
                                </span>
                            ))
                        }
                    </div>
                    {isEditing && (
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={newSkill}
                                onChange={e => setNewSkill(e.target.value)}
                                placeholder="Skill ID"
                                className="border p-1 rounded"
                            />
                            <PrimaryButton onClick={addSkill}>Add</PrimaryButton>
                        </div>
                    )}
                </div>
                <div>
                    <p className="font-semibold mb-2">Requirements:</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {isEditing ?
                            editingJob.requirements.map((reqId, i) => {
                                const reqObj = job_details.requirements?.find(r => r.id === reqId || r.requirement_id === reqId);
                                const reqName = reqObj ? reqObj.requirement_name : `Requirement ${reqId}`;
                                return (
                                    <span key={i} className="flex items-center bg-blue-100 px-3 py-1 rounded-full text-sm">
                                        {reqName}
                                        <button onClick={() => removeRequirement(i)} className="ml-2 text-red-500">×</button>
                                    </span>
                                );
                            })
                            :
                            (job_details.requirements || []).map((req, i) => (
                                <span key={i} className="flex items-center bg-blue-100 px-3 py-1 rounded-full text-sm">
                                    {req.requirement_name}
                                </span>
                            ))
                        }
                    </div>
                    {isEditing && (
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={newRequirement}
                                onChange={e => setNewRequirement(e.target.value)}
                                placeholder="Req ID"
                                className="border p-1 rounded"
                            />
                            <PrimaryButton onClick={addRequirement}>Add</PrimaryButton>
                        </div>
                    )}
                </div>
            </div>

            {/* Applicants */}
            <DashboardCard title="Job Applicant Overview">
                <div className="flex flex-wrap gap-2 mb-4">
                    {['all', 'pending', 'qualified', 'accepted', 'rejected'].map(status => (
                        <PrimaryButton
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={`px-4 py-2 rounded-full border transition-all ${
                                selectedStatus === status
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </PrimaryButton>
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
                                            {application.user?.first_name} {application.user?.last_name}
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
                                                onChange={e => setRemarkInput(e.target.value)}
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
