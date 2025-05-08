import React, { useState } from "react";
import DashboardCard from "./DashboardCard.jsx";
import DangerButton from "@/Components/DangerButton.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";


export default function ApplicantCard({ users, onApplicantSelect }) {
    const [selectedStatus, setSelectedStatus] = useState("all");

    if (!users || users.length === 0) {
        return <div className="p-6 bg-white rounded-lg shadow">No applicants found.</div>;
    }

    // const toggleUserDetails = (userId) => {
    //     if (expandedUser === userId) {
    //         setExpandedUser(null);
    //     } else {
    //         setExpandedUser(userId);
    //     }
    // };

    // Filter applicants based on selected status

    console.log(onApplicantSelect)
    const filteredUsers = users.filter(user => {
        if (selectedStatus === "all") return true;
        return user.applications && user.applications.some(app =>
            app.status.toLowerCase() === selectedStatus.toLowerCase()
        );
    });

    const statusClasses = {
        accepted: 'text-green-600',
        rejected: 'text-red-600',
        qualified: 'text-blue-600',
        pending: 'text-yellow-600'
    };

    return (
        <div className="w-full px-4">

            {/* Filter Buttons */}
            <div className="flex space-x-2 mb-4">
                {['all', 'pending', 'qualified', 'accepted', 'rejected'].map(status => (
                    <SecondaryButton
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={`px-4 py-2 rounded-full border transition-all ${
                            selectedStatus === status
                                ? 'bg-blue-600 text-black'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SecondaryButton>
                ))}
            </div>

            <DashboardCard title="Applicant Overview">
                    <table className="table-auto w-full border-collapse">
                        <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Email</th>
                            <th className="py-3 px-4">Contact</th>
                            <th className="py-3 px-4">Applied Jobs</th>
                            <th className="py-3 px-4">Visited Jobs</th>
                            <th className="py-3 px-4 text-center">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredUsers.map((user, index) => (


                            <tr   key={user.id}
                                  className="border-b hover:bg-gray-50 cursor-pointer"
                                  onClick={() => onApplicantSelect(user.id)}
                            >
                                <td className="py-3 px-4">
                                    <div className="flex items-center">
                                        <span className="mr-2 text-gray-500">{index + 1}.</span>
                                        {user.first_name}
                                        {user.middle_name ? ` ${user.middle_name[0]}. ` : " "}
                                        {user.last_name}
                                        {user.suffix ? `, ${user.suffix}` : ""}
                                    </div>
                                </td>
                                <td className="py-3 px-4">{user.email}</td>
                                <td className="py-3 px-4">{user.contact_number}</td>
                                <td className="py-3 px-4">
                                    {user.applications && user.applications.length > 0 ? (
                                        <span>{user.applications.length} job(s)</span>
                                    ) : (
                                        <span className="text-gray-500">No jobs applied</span>
                                    )}
                                </td>
                                <td className="py-3 px-4">sample</td>


                            </tr>
                        ))}
                        </tbody>
                    </table>
            </DashboardCard>

             {/*{expandedUser && (() => {*/}
             {/*   const user = users.find(u => u.id === expandedUser);*/}
             {/*   return user ? (*/}
             {/*         <ApplicantDetails*/}
             {/*   user={user}*/}
             {/*      onClose={() => setExpandedUser(null)}*/}
             {/*     />*/}
             {/*   ) : null;*/}
             {/* })()}*/}
        </div>
    );
}
