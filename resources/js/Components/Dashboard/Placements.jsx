import React from "react";

const Placements = ({ placement }) => {
    // Check if placement data exists
    if (!placement || !placement.user) {
        return <div>No placement or user data available.</div>;
    }

    return (
        <div className="p-4 border rounded shadow-sm">
            <p><strong>User First Name:</strong> {placement.user_first_name}</p>
            <p><strong>Status:</strong> {placement.placement_status}</p>
            <p><strong>Date Placed:</strong> {placement.date_placed}</p>
            <p><strong>Job Seeker:</strong> {placement.user.first_name}</p>
        </div>
    );
};

export default Placements;
