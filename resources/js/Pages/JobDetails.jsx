import React, { useState } from "react";
import SecondaryButton from "@/Components/SecondaryButton.jsx";


import axios from "axios";
import ApplicantsSection from "../Components/Dashboard/Modal/ApplicantsSection.jsx";

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

    } = job_details;

    console.log('sd', job_details)
    console.log('sd', job_details.degree)
    console.log('sst', job_details.status)



    const [selectedStatus, setSelectedStatus] = useState("all");
    const filteredApplicants = applicants
        .filter((app) => selectedStatus === "all" || app.status?.toLowerCase() === selectedStatus.toLowerCase());

    // const [isEditing, setIsEditing] = useState(false);
    //
    //
    // const [form, setForm] = useState({
    //     job_title: job_details.job_title || "N/A",
    //     job_type: job_details.job_title || "N/A",
    //     job_description: job_details.job_description || "N/A",
    //     job_location: job_details.job_location || "N/A",
    //     company: job_details.company || "N/A",
    //     salary_type: job_details.salary_type || "N/A",
    //     min_salary: job_details.min_salary || "N/A",
    //     max_salary: job_details.max_salary || "N/A",
    //     min_experience_years: job_details.min_experience_years || "N/A",
    //     requirements: job_details.requirements || [],
    //     skills: job_details.skills || [],
    //     status: job_details.status || "N/A"
    // });
    //
    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setForm((prev) => ({ ...prev, [name]: value }));
    // };
    //
    // const handleSave = async () => {
    //     try {
    //
    //         const payload = {
    //             job_title: form.job_title,
    //             job_type: form.job_type,
    //             job_description: form.job_description,
    //             job_location: form.job_location,
    //
    //             company: form.company,
    //             salary_type: form.salary_type,
    //             min_salary: form.min_salary,
    //             max_salary: form.max_salary,
    //             min_experience_years: form.min_experience_years,
    //             requirements: form.requirements,
    //             skills: form.skills,
    //             status: form.status
    //
    //         };
    //         const res = await axios.patch('')
    //     }
    // }





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

            <ApplicantsSection applicants={applicants} />

        </div>
    );
}
