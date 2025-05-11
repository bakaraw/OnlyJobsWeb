import React from "react";
import { Head } from '@inertiajs/react';
import SecondaryButton from "@/Components/SecondaryButton";
import { router } from '@inertiajs/react';
import axios from 'axios';

export default function ApplicantDetails({ application }) {
    // Application contains all the nested relationships from the controller
    const user = application.user;


    const handleRowClick = (application, e) => {
        // Don't navigate if clicking on a button or action element
        if (e.target.closest('button')) {
            return;
        }

        // Navigate to the applicant details page
        router.visit(route('applicant.details', { id: application.id }));
    };
    const handleExportPdf = async () => {
        try {
            const response = await axios.get(`/applicants/${user.id}/pdf`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `user-${user.id}-profile.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('PDF export failed', err);
            alert('Failed to download PDF.');
        }
    };

    // These formatting functions help display data consistently
    const formatName = () => {
        const firstName = user.first_name || "";
        const middleName = user.middle_name ? user.middle_name[0] + ". " : "";
        const lastName = user.last_name || "";
        const suffix = user.suffix ? ", " + user.suffix : "";
        return `${firstName} ${middleName}${lastName}${suffix}`;
    };

    const statusClasses = {
        accepted: "text-green-600",
        rejected: "text-red-600",
        qualified: "text-blue-600",
        pending: "text-yellow-600",
    };

    return (
        <>
            <Head title={`Applicant Details - ${formatName()}`} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">{formatName()}</h2>
                        <div className="flex space-x-2">
                            <SecondaryButton
                                onClick={() => router.visit(route('applicants'))}
                            >
                                Back
                            </SecondaryButton>
                            <SecondaryButton onClick={handleExportPdf}>
                                Export PDF
                            </SecondaryButton>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        {/* Personal Information */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="font-semibold">Email:</p>
                                    <p className="text-gray-600">{user.email || "Not specified"}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Contact Number:</p>
                                    <p className="text-gray-600">{user.contact_number || "Not specified"}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Gender:</p>
                                    <p className="text-gray-600">{user.gender || "Not specified"}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Birthdate:</p>
                                    <p className="text-gray-600">
                                        {user.birthdate
                                            ? new Date(user.birthdate).toLocaleDateString()
                                            : "Not specified"}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold">Application Status:</p>
                                    <p className={`${statusClasses[application.status?.toLowerCase()] || ''}`}>
                                        {application.status || "Pending"}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold">Applied For:</p>
                                    <p className="text-gray-600">{application.job_post?.job_title || "N/A"}</p>
                                </div>
                            </div>

                            {user.address && (
                                <div className="mt-4">
                                    <p className="font-semibold">Address:</p>
                                    <p className="text-gray-600">
                                        {[
                                            user.address.street,
                                            user.address.street2,
                                            user.address.city,
                                            user.address.province,
                                            user.address.postal_code,
                                            user.address.country,
                                        ]
                                            .filter(Boolean)
                                            .join(", ") || "Not specified"}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Skills */}
                        {user.user_skills && user.user_skills.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {user.user_skills.map((userSkill, index) => (
                                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                                            {userSkill.skill?.name || userSkill.skill_name || "N/A"}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education */}
                        {user.educations && user.educations.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">Education</h3>
                                <table className="table-auto w-full border-collapse">
                                    <thead className="bg-gray-100 text-left">
                                    <tr>
                                        <th className="py-2 px-4">Degree</th>
                                        <th className="py-2 px-4">School</th>
                                        <th className="py-2 px-4">Period</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {user.educations.map((edu, index) => (
                                        <tr key={edu.id || index} className="border-b">
                                            <td className="py-2 px-4">{edu.degree || "N/A"}</td>
                                            <td className="py-2 px-4">{edu.institution_name || edu.school || "N/A"}</td>
                                            <td className="py-2 px-4">
                                                {edu.start_year || edu.start_date || "?"}{" "}
                                                - {" "}
                                                {edu.end_year || edu.end_date || "Present"}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Add the remaining sections (certifications, work histories, etc.) */}
                    </div>
                </div>
            </div>
        </>
    );
}
