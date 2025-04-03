import React from "react";

const Placements = ({ placements }) => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Job Placements</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {placements && placements.length > 0 ? (
                    placements.map((placement) => (
                        <div key={placement.id} className="bg-white shadow-lg rounded-lg p-4 border">
                            <h2 className="text-lg font-semibold">
                                {placement.jobPost && placement.jobPost.job_title ? placement.jobPost.job_title : "No Title"}
                            </h2>
                            <p className="text-gray-600">
                                By: {placement.user && placement.user.first_name} {placement.user && placement.user.last_name}
                            </p>
                            <p className="text-gray-500">
                                Status: {placement.placement_status || "N/A"}
                            </p>
                            <p className="text-sm text-gray-400">
                                Created at: {placement.created_at ? new Date(placement.created_at).toLocaleDateString() : "N/A"}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No placements available.</p>
                )}
            </div>
        </div>
    );
};

export default Placements;
