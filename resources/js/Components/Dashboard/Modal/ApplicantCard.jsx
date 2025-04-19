import React, { useState } from "react";

export default function ApplicantCard({ users }) {
    const [expandedUser, setExpandedUser] = useState(null);

    if (!users || users.length === 0) {
        return <div className="p-6 bg-white rounded-lg shadow">No applicants found.</div>;
    }

    const toggleUserDetails = (userId) => {
        if (expandedUser === userId) {
            setExpandedUser(null);
        } else {
            setExpandedUser(userId);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Applicants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => (
                    <div key={user.id} className="border p-4 rounded-lg shadow-md bg-white">
                        {/* Basic User Info */}
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">
                                {user.first_name} {user.middle_name ? user.middle_name[0] + ". " : ""}{user.last_name}{user.suffix ? ", " + user.suffix : ""}
                            </h3>
                            <button
                                onClick={() => toggleUserDetails(user.id)}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                {expandedUser === user.id ? "Hide Details" : "View Details"}
                            </button>
                        </div>

                        <p className="text-sm text-gray-600">Email: {user.email}</p>
                        <p className="text-sm text-gray-600">Contact: {user.contact_number}</p>

                        {/* Always show applied jobs even when collapsed */}
                        <div className="mt-3">
                            <h4 className="font-semibold text-gray-700">Applied Jobs:</h4>
                            {user.applications && user.applications.length > 0 ? (
                                <ul className="list-disc list-inside text-sm">
                                    {user.applications.map((application) => (
                                        <li key={application.id}>
                                            {application.job_post?.job_title || "Unknown Job"} -
                                            <span className={`ml-1 ${
                                                application.status === 'accepted' ? 'text-green-600' :
                                                    application.status === 'rejected' ? 'text-red-600' :
                                                        application.status === 'qualified' ? 'text-blue-600' :
                                                            'text-yellow-600'
                                            }`}>
                                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">No jobs applied</p>
                            )}
                        </div>

                        {/* Expandable Details */}
                        {expandedUser === user.id && (
                            <div className="mt-4 border-t pt-3">
                                {/* Personal Details */}
                                <div className="mb-3">
                                    <h4 className="font-semibold text-gray-700">Personal Details:</h4>
                                    <p className="text-sm">Gender: {user.gender || 'Not specified'}</p>
                                    <p className="text-sm">Birthdate: {user.birthdate ? new Date(user.birthdate).toLocaleDateString() : 'Not specified'}</p>

                                    {/* Address */}
                                    {user.address && (
                                        <div className="mt-1">
                                            <p className="text-sm">
                                                Address: {[
                                                user.address.street_address,
                                                user.address.barangay,
                                                user.address.city,
                                                user.address.province,
                                                user.address.postal_code
                                            ].filter(Boolean).join(', ')}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Education */}
                                {user.educations && user.educations.length > 0 && (
                                    <div className="mb-3">
                                        <h4 className="font-semibold text-gray-700">Education:</h4>
                                        <ul className="list-disc list-inside text-sm">
                                            {user.educations.map((edu) => (
                                                <li key={edu.id}>
                                                    {edu.degree || edu.course} - {edu.institution}{' '}
                                                    ({edu.year_start}{edu.year_end ? ` - ${edu.year_end}` : ' - Present'})
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Work History */}
                                {user.work_histories && user.work_histories.length > 0 && (
                                    <div className="mb-3">
                                        <h4 className="font-semibold text-gray-700">Work Experience:</h4>
                                        <ul className="list-disc list-inside text-sm">
                                            {user.work_histories.map((work) => (
                                                <li key={work.id}>
                                                    {work.position} at {work.company}{' '}
                                                    ({work.start_date ? new Date(work.start_date).toLocaleDateString() : '?'} -
                                                    {work.end_date ? new Date(work.end_date).toLocaleDateString() : 'Present'})
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Requirements/Documents */}
                                {user.requirements && user.requirements.length > 0 && (
                                    <div className="mb-3">
                                        <h4 className="font-semibold text-gray-700">Requirements/Documents:</h4>
                                        <ul className="list-disc list-inside text-sm">
                                            {user.requirements.map((req) => (
                                                <li key={req.id}>
                                                    {req.name} - {req.status || 'Submitted'}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Applied Jobs (Detailed) */}
                                {user.applications && user.applications.length > 0 && (
                                    <div className="mb-3">
                                        <h4 className="font-semibold text-gray-700">Job Applications (Detailed):</h4>
                                        <ul className="list-disc list-inside text-sm">
                                            {user.applications.map((application) => (
                                                <li key={application.id}>
                                                    <span className="font-medium">{application.job_post?.job_title || "Unknown Job"}</span>
                                                    <p className="text-xs text-gray-500 ml-5">
                                                        Status: <span className={`${
                                                        application.status === 'accepted' ? 'text-green-600' :
                                                            application.status === 'rejected' ? 'text-red-600' :
                                                                application.status === 'qualified' ? 'text-blue-600' :
                                                                    'text-yellow-600'
                                                    }`}>
                                                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                                        </span>
                                                    </p>
                                                    <p className="text-xs text-gray-500 ml-5">
                                                        Applied on: {new Date(application.created_at).toLocaleDateString()}
                                                    </p>
                                                    {application.remarks && (
                                                        <p className="text-xs text-gray-500 ml-5">
                                                            Remarks: {application.remarks}
                                                        </p>
                                                    )}
                                                    {application.job_post?.job_requirements && (
                                                        <p className="text-xs text-gray-500 ml-5">
                                                            Requirements: {application.job_post.job_requirements}
                                                        </p>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
