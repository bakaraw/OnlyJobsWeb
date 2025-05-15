import React from "react";
import DangerButton from "@/Components/DangerButton.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import axios from "axios";

export default function ApplicantDetails({ user, selectedApplicant, onBack }) {
    console.log("Selected applicant in details:", selectedApplicant);

    if (!selectedApplicant) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">User data not available</h2>
                    <SecondaryButton onClick={onBack} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                        Back
                    </SecondaryButton>
                </div>
                <p>Unable to display user details. Data might be missing or improperly formatted.</p>
            </div>
        );
    }

    console.log("certifications:", selectedApplicant.certifications);
    console.log("user_skills:", selectedApplicant.user_skills);
    console.log("selected applicant:", selectedApplicant);

    const statusClasses = {
        accepted: "text-green-600",
        rejected: "text-red-600",
        qualified: "text-blue-600",
        pending: "text-yellow-600",
    };

    const firstName = selectedApplicant.first_name || "N/A";
    const middleName = selectedApplicant.middle_name || "";
    const lastName = selectedApplicant.last_name || "";
    const suffix = selectedApplicant.suffix || "";

    const handleExportPdf = async () => {
        try {
            const response = await axios.get(`/applicants/${selectedApplicant.id}/pdf`, { responseType: 'blob' });

            // Create a blob URL and trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `user-${selectedApplicant.id}-profile.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('PDF export failed', err);
            alert('Failed to download PDF.');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                    {firstName}{" "}
                    {middleName ? middleName[0] + ". " : ""} {lastName}
                    {suffix ? ", " + suffix : ""}
                </h2>

                <div className="flex gap-2">
                    <SecondaryButton
                        onClick={onBack}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                        Back
                    </SecondaryButton>

                    <SecondaryButton onClick={handleExportPdf}>
                        Export PDF
                    </SecondaryButton>
                </div>
            </div>

            {/* Personal Info */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="font-semibold">Email:</p>
                        <p className="text-gray-600">{selectedApplicant.email || "Not specified"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Contact Number:</p>
                        <p className="text-gray-600">{selectedApplicant.contact_number || "Not specified"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Gender:</p>
                        <p className="text-gray-600">{selectedApplicant.gender || "Not specified"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Birthdate:</p>
                        <p className="text-gray-600">
                            {selectedApplicant.birthdate
                                ? new Date(selectedApplicant.birthdate).toLocaleDateString()
                                : "Not specified"}
                        </p>
                    </div>
                </div>

                {selectedApplicant.address && (
                    <div className="mt-4">
                        <p className="font-semibold">Address:</p>
                        <p className="text-gray-600">
                            {[
                                selectedApplicant.address.street,
                                selectedApplicant.address.street2,
                                selectedApplicant.address.city,
                                selectedApplicant.address.province,
                                selectedApplicant.address.postal_code,
                                selectedApplicant.address.country,
                            ]
                                .filter(Boolean)
                                .join(", ") || "Not specified"}
                        </p>
                    </div>
                )}
            </div>

            {/* Skills Section */}
            {selectedApplicant.userSkills && selectedApplicant.userSkills.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Skills</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 text-left border-b">Skill Name</th>
                            </tr>
                            </thead>
                            <tbody>
                            {selectedApplicant.userSkills.map((skill, index) => (
                                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    <td className="py-2 px-4 border-b">{skill.skill_name}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Alternative way to display skills */}
            {selectedApplicant.user_skills && selectedApplicant.user_skills.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Skills</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 text-left border-b">Skills</th>
                            </tr>
                            </thead>
                            <tbody>
                            {selectedApplicant.user_skills.map((skill, index) => (
                                <tr key={skill.id || index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    <td className="py-2 px-4 border-b">{skill.skill_name || "N/A"}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Education */}
            {selectedApplicant.educations && selectedApplicant.educations.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Education</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 text-left border-b">Degree</th>
                                <th className="py-2 px-4 text-left border-b">School</th>
                                <th className="py-2 px-4 text-left border-b">Period</th>
                            </tr>
                            </thead>
                            <tbody>
                            {selectedApplicant.educations.map((edu, index) => (
                                <tr key={edu.id || index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    <td className="py-2 px-4 border-b">{edu.degree || "N/A"}</td>
                                    <td className="py-2 px-4 border-b">{edu.school || "N/A"}</td>
                                    <td className="py-2 px-4 border-b">
                                        {edu.start_year || "?"}
                                        {edu.end_year ? ` - ${edu.end_year}` : " - Present"}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Certifications */}
            {selectedApplicant.certifications && selectedApplicant.certifications.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Certificates</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 text-left border-b">Title</th>
                                <th className="py-2 px-4 text-left border-b">Description</th>
                                <th className="py-2 px-4 text-left border-b">Year</th>
                            </tr>
                            </thead>
                            <tbody>
                            {selectedApplicant.certifications.map((certificate, index) => (
                                <tr key={certificate.id || index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    <td className="py-2 px-4 border-b">{certificate.title}</td>
                                    <td className="py-2 px-4 border-b">{certificate.description || "N/A"}</td>
                                    <td className="py-2 px-4 border-b">{certificate.year}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Work Experience */}
            {selectedApplicant.work_histories && selectedApplicant.work_histories.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Work Experience</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 text-left border-b">Position</th>
                                <th className="py-2 px-4 text-left border-b">Employer</th>
                                <th className="py-2 px-4 text-left border-b">Period</th>
                            </tr>
                            </thead>
                            <tbody>
                            {selectedApplicant.work_histories.map((work, index) => (
                                <tr key={work.id || index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    <td className="py-2 px-4 border-b">{work.job_title || work.position || "N/A"}</td>
                                    <td className="py-2 px-4 border-b">{work.employer || "N/A"}</td>
                                    <td className="py-2 px-4 border-b">
                                        {work.start_date
                                            ? new Date(work.start_date).toLocaleDateString()
                                            : "?"}{" "}
                                        -{" "}
                                        {work.end_date
                                            ? new Date(work.end_date).toLocaleDateString()
                                            : "Present"}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Applications */}
            {selectedApplicant.applications && selectedApplicant.applications.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Applications</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 text-left border-b">Job Title</th>
                                <th className="py-2 px-4 text-left border-b">Company</th>
                                <th className="py-2 px-4 text-left border-b">Job Type</th>
                                <th className="py-2 px-4 text-left border-b">Status</th>
                                <th className="py-2 px-4 text-left border-b">Remarks</th>
                                <th className="py-2 px-4 text-left border-b">Date Applied</th>
                            </tr>
                            </thead>
                            <tbody>
                            {selectedApplicant.applications.map((application, appIndex) => (
                                <React.Fragment key={application.id || appIndex}>
                                    <tr className={appIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                        <td className="py-2 px-4 border-b">{application.job_post?.job_title || "N/A"}</td>
                                        <td className="py-2 px-4 border-b">{application.job_post?.company || "N/A"}</td>
                                        <td className="py-2 px-4 border-b">{application.job_post?.job_type || "N/A"}</td>
                                        <td className="py-2 px-4 border-b capitalize">{application.status || "Pending"}</td>
                                        <td className="py-2 px-4 border-b">{application.remarks || "None"}</td>
                                        <td className="py-2 px-4 border-b">
                                            {application.created_at
                                                ? new Date(application.created_at).toLocaleDateString("en-US", {
                                                    month: "long",
                                                    day: "2-digit",
                                                    year: "numeric",
                                                })
                                                : "N/A"}
                                        </td>
                                    </tr>
                                    {application?.job_post?.requirements?.length > 0 && (
                                        <>
                                            <tr>
                                                <td colSpan={6} className="p-0">
                                                    <div className="bg-gray-50 p-4">
                                                        <h4 className="text-md font-semibold mb-2 bg-gray-50 p-4">
                                                            Requirements/Documents for {application.job_post.job_title}
                                                        </h4>
                                                        <div className="overflow-x-auto">
                                                            <table className="min-w-full bg-white border border-gray-200">
                                                                <thead className="bg-gray-100">
                                                                <tr>
                                                                    <th className="py-2 px-4 text-left border-b">Document</th>
                                                                    <th className="py-2 px-4 text-left border-b">Status</th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                {application.job_post.requirements.map((req, reqIndex) => {
                                                                    const isSubmitted = selectedApplicant?.requirements?.some(
                                                                        (submitted) =>
                                                                            submitted.job_post_requirement_id === req.requirement_id &&
                                                                            submitted.application_id === application.id
                                                                    );

                                                                    return (
                                                                        <tr
                                                                            key={`req-${req.requirement_id || reqIndex}`}
                                                                            className={reqIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                                                        >
                                                                            <td className="py-2 px-4 border-b capitalize">
                                                                                {req.requirement_name || "N/A"}
                                                                            </td>
                                                                            <td className="py-2 px-4 border-b capitalize">
                                                                                {isSubmitted ? "Submitted" : "Not Submitted"}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={6} className="py-2"></td>
                                            </tr>
                                        </>
                                    )}
                                </React.Fragment>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
