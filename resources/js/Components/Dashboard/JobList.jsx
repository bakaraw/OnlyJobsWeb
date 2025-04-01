import React, {useState} from "react";



export default function JobList({ job }) {
    const [showDetails, setShowDetails] = useState(false);
    const {
        id,
        job_title = "N/A",
        job_type = "N/A",
        job_description = "N/A",
        job_location = "N/A",
        company = ""
    } = job;


    return (
        <div className="border p-4 rounded-md shadow-md bg-white hover:shadow-lg transition">
            <h2 className="text-lg font-semibold">{job_title}</h2>
            <p className="text-sm text-gray-600">{company} - {job_location}</p>
            <p className="text-sm text-gray-500 mb-2">{job_type}</p>
            <p className="mb-3">{job_description}</p>

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
