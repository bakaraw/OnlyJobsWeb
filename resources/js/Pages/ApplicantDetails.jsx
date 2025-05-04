import React from "react";
import DangerButton from "@/Components/DangerButton.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";

export default function ApplicantDetails({ selectedApplicant, onClose, onBack }) {


    console.log(selectedApplicant)
    if (!selectedApplicant) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">User data not available</h2>
                    <DangerButton onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                        Close
                    </DangerButton>
                </div>
                <p>Unable to display user details. Data might be missing or improperly formatted.</p>
            </div>
        );
    }
    console.log("certi", selectedApplicant.certifications);
    console.log("skills", selectedApplicant.user_skills);
    console.log("skills", selectedApplicant.user_skills);


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
            const response = axios.get(`/users/${selectedApplicant.id}/export-pdf`, { responseType: 'blob' });

            // Create a blob URL and trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute(
                'download',
                `user-${selectedApplicant.id}-profile.pdf`);
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

                <SecondaryButton
                    onClick={onBack}
                    className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
                >
                    Back
                </SecondaryButton>

                <SecondaryButton onClick={handleExportPdf}>
                    Export PDF
                </SecondaryButton>



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

            {selectedApplicant.userSkills && selectedApplicant.userSkills.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Certificates</h3>
                    <table className="table-auto w-full border-collapse">
                        <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="py-2 px-4">Title</th>
                            <th className="py-2 px-4">Description</th>
                            <th className="py-2 px-4">Year</th>
                        </tr>
                        </thead>
                        <tbody>
                        {selectedApplicant.userSkills.map((skill, index) => (
                            <td className="py-2 px-4">
                                {skill.skill_name }
                            </td>

                        ))}
                        </tbody>
                    </table>
                </div>
            )}






            {selectedApplicant.user_skills && selectedApplicant.user_skills.length > 0 && (
                <div className="mb-6">
                    <table className="table-auto w-full ">
                        <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="py-2 px-4">Skills</th>

                        </tr>
                        </thead>
                        <tbody>

                        {selectedApplicant.user_skills.map((skill, index) => (
                            <tr key={skill.id || index} className="border-b">
                                <td className="py-2 px-4">{skill.skill_name|| "N/A"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}



            {/* Education */}
            {selectedApplicant.educations && selectedApplicant.educations.length > 0 && (
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

                        {selectedApplicant.educations.map((edu, index) => (
                            <tr key={edu.id || index} className="border-b">
                                <td className="py-2 px-4">{edu.degree || "N/A"}</td>
                                <td className="py-2 px-4">{edu.school || "N/A"}</td>
                                <td className="py-2 px-4">
                                    {edu.start_year || "?"}
                                    {edu.end_year ? ` - ${edu.end_year}` : " - Present"}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}


            {selectedApplicant.certifications && selectedApplicant.certifications.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Certificates</h3>
                    <table className="table-auto w-full border-collapse">
                        <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="py-2 px-4">Title</th>
                            <th className="py-2 px-4">Description</th>
                            <th className="py-2 px-4">Year</th>
                        </tr>
                        </thead>
                        <tbody>
                        {selectedApplicant.certifications.map((certificate, index) => (
                            <tr key={certificate.id || index} className="border-b">
                                <td className="py-2 px-4">
                                    {certificate.title }
                                </td>
                                <td className="py-2 px-4">{certificate.description || "N/A"}</td>
                                <td className="py-2 px-4">
                                    {certificate.year
                                    }
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}


            {/* Work Experience */}
            {selectedApplicant.work_histories && selectedApplicant.work_histories.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Work Experience</h3>
                    <table className="table-auto w-full border-collapse">
                        <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="py-2 px-4">Position</th>
                            <th className="py-2 px-4">Employer</th>
                            <th className="py-2 px-4">Period</th>
                        </tr>
                        </thead>
                        <tbody>
                        {selectedApplicant.work_histories.map((work, index) => (
                            <tr key={work.id || index} className="border-b">
                                <td className="py-2 px-4">
                                    {work.job_title || work.position || "N/A"}
                                </td>
                                <td className="py-2 px-4">{work.employer || "N/A"}</td>
                                <td className="py-2 px-4">
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
            )}

            {/* Requirements/Documents */}
            {selectedApplicant.requirements && selectedApplicant.requirements.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">
                        Requirements/Documents
                    </h3>
                    <table className="table-auto w-full border-collapse">
                        <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="py-2 px-4">Document</th>
                            <th className="py-2 px-4">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {selectedApplicant.requirements.map((req, index) => (
                            <tr key={req.id || index} className="border-b">
                                <td className="py-2 px-4">{req.name || "N/A"}</td>
                                <td className="py-2 px-4 capitalize">
                                    {req.status || "Submitted"}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
