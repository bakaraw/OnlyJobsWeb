import React, { useState } from "react";

export default function JobList({ job, placements }) {
    const [showDetails, setShowDetails] = useState(false);
    const {
        id,
        job_title = "N/A",
        job_type = "N/A",
        job_description = "N/A",
        job_location = "N/A",
        company = ""
    } = job;

    // Filter placements related to this job
    const jobPlacements = placements;

    return (
        <div className="border p-4 rounded-md shadow-md bg-white hover:shadow-lg transition">
            <h2 className="text-lg font-semibold">Job Title: {job_title}</h2>
            <p className="text-sm text-gray-600"> Company Name: {company} - Location: {job_location}</p>
            <p className="text-sm text-gray-500 mb-2">Job Type: {job_type}</p>
            <p className="mb-3">Job Description: {job_description}</p>

            <button
                onClick={() => setShowDetails(true)}
                className="text-blue-500 hover:underline text-sm"
            >
                View Job
            </button>
            {showDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4">
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

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-4">Placements</h3>
                            {jobPlacements.length > 0 ? (
                                <table className="w-full">
                                    <thead>
                                    <tr>
                                        <th className="py-2">User</th>
                                        <th className="py-2">Status</th>
                                        <th className="py-2">Date Placed</th>
                                        <th className="py-2">Additional Remarks</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {jobPlacements.map((placement) => (
                                        <tr key={placement.id} className="border-t">
                                            <td className="py-2">{placement.user.first_name}</td>
                                            <td className="py-2">{placement.placement_status}</td>
                                            <td className="py-2">{new Date(placement.created_at).toLocaleDateString()}</td>
                                            <td className="py-2">{placement.additional_remarks}</td>

                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-500">No placements available.</p>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowDetails(false)}
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
