// src/components/ApplicantDetails.jsx
import React from "react";
import DangerButton from "@/Components/DangerButton.jsx";

export default function ApplicantDetails({ user, onClose }) {
    const statusClasses = {
        accepted: "text-green-600",
        rejected: "text-red-600",
        qualified: "text-blue-600",
        pending: "text-yellow-600",
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                    {user.first_name}{" "}
                    {user.middle_name ? user.middle_name[0] + ". " : ""} {user.last_name}
                    {user.suffix ? ", " + user.suffix : ""}
                </h2>
                <DangerButton
                    onClick={onClose}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                >
                    Close
                </DangerButton>
            </div>

            {/* Personal Info */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="font-semibold">Email:</p>
                        <p className="text-gray-600">{user.email}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Contact Number:</p>
                        <p className="text-gray-600">{user.contact_number}</p>
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
                                .join(", ")}
                        </p>
                    </div>
                )}
            </div>

            {/* Education */}
            {user.educations?.length > 0 && (
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
                        {user.educations.map((edu) => (
                            <tr key={edu.id} className="border-b">
                                <td className="py-2 px-4">{edu.degree || "N/A"}</td>
                                <td className="py-2 px-4">{edu.school}</td>
                                <td className="py-2 px-4">
                                    {edu.start_year}
                                    {edu.end_year ? ` - ${edu.end_year}` : " - Present"}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Work Experience */}
            {user.work_histories?.length > 0 && (
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
                        {user.work_histories.map((work) => (
                            <tr key={work.id} className="border-b">
                                <td className="py-2 px-4">
                                    {work.job_title || work.position}
                                </td>
                                <td className="py-2 px-4">{work.employer}</td>
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
            {user.requirements?.length > 0 && (
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
                        {user.requirements.map((req) => (
                            <tr key={req.id} className="border-b">
                                <td className="py-2 px-4">{req.name}</td>
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
