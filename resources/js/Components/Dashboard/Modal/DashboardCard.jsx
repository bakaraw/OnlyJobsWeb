// DashboardCard.jsx
import React from "react";

export default function DashboardCard({ title, children, className = "" }) {
    return (
        <div className={`dashboard-cards p-4 bg-white rounded-md shadow-md w-full ${className}`}>
            {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}
            {children}
        </div>
    );
}
