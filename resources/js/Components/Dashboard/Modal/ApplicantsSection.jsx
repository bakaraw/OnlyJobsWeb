import React, { useState } from "react";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import DangerButton from "@/Components/DangerButton.jsx";
import axios from "axios";
import DashboardCard from "@/Components/Dashboard/Modal/DashboardCard.jsx";


export default function ApplicantsSection({ applicants }) {
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [editingId, setEditingId] = useState(null);
    const [remarkInput, setRemarkInput] = useState("");

    const filteredApplicants = applicants.filter(
        (app) =>
            selectedStatus === "all" ||
            app.status?.toLowerCase() === selectedStatus.toLowerCase()
    );

    const handleAccept = async (application) => {
        try {
            let endpoint;
            let confirmMsg;

            if (application.status === "Pending") {
                confirmMsg = `Are you sure you want to qualify ${application.user.first_name} ${application.user.last_name}?`;
                if (!confirm(confirmMsg)) return;
                endpoint = "/applicants/qualified";
            } else if (application.status === "Qualified") {
                confirmMsg = `Are you sure you want to accept ${application.user.first_name} ${application.user.last_name}?`;
                if (!confirm(confirmMsg)) return;
                endpoint = "/applicants/accepted";
            } else {
                return;
            }

            const response = await axios.post(endpoint, { application_id: application.id });
            if (response.data.success) {
                window.location.reload();
            }
        } catch (error) {
            console.error("Error updating application status:", error);
        }
    };

    const handleReject = async (application) => {
        try {
            const response = await axios.post("/applicants/rejected", {
                application_id: application.id,
            });
            if (response.data.success) {
                window.location.reload();
            }
        } catch (error) {
            console.error("Error rejecting application:", error);
        }
    };

    const saveRemark = async (application) => {
        try {
            const response = await axios.patch("/applications/update-remark", {
                application_id: application.id,
                remarks: remarkInput.trim(),
            });
            if (response.data.success) {
                setEditingId(null);
                setRemarkInput("");
                window.location.reload();
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error("Failed to save remark:", error);
            alert(
                error.response?.data?.message || "Failed to save remark. Please try again."
            );
        }
    };

    return (
        <DashboardCard className="border rounded-lg shadow p-4 bg-white">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
                {['all', 'pending', 'qualified', 'accepted', 'rejected'].map((status) => (
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

            {filteredApplicants.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="py-2 px-4 text-left">Applicant</th>
                            <th className="py-2 px-4 text-left">Status</th>
                            <th className="py-2 px-4 text-left">Date Applied</th>
                            <th className="py-2 px-4 text-left">Remarks</th>
                            <th className="py-2 px-4 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredApplicants.map((application, index) => (
                            <tr key={application.id} className="border-t hover:bg-gray-50">
                                <td className="py-2 px-4">
                                    <div className="flex items-center">
                      <span className="mr-2 text-gray-500">
                        {index + 1}.
                      </span>
                                        {application.user.first_name} {application.user.last_name}
                                    </div>
                                </td>
                                <td className="py-2 px-4 capitalize">{application.status}</td>
                                <td className="py-2 px-4">
                                    {new Date(application.created_at).toLocaleDateString()}
                                </td>
                                <td className="py-2 px-4">
                                    {editingId === application.id ? (
                                        <textarea
                                            className="w-full border p-1 rounded"
                                            value={remarkInput}
                                            onChange={(e) => setRemarkInput(e.target.value)}
                                            rows={2}
                                        />
                                    ) : (
                                        <span>
                        {application.remarks && application.remarks !== ""
                            ? application.remarks
                            : "No remarks"}
                      </span>
                                    )}
                                </td>
                                <td className="py-2 px-4">
                                    {editingId === application.id ? (
                                        <div className="flex space-x-2">
                                            <PrimaryButton
                                                className="px-3 py-1"
                                                onClick={() => saveRemark(application)}
                                            >
                                                Save
                                            </PrimaryButton>
                                            <SecondaryButton
                                                className="px-3 py-1"
                                                onClick={() => {
                                                    setEditingId(null);
                                                    setRemarkInput("");
                                                }}
                                            >
                                                Cancel
                                            </SecondaryButton>
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            <SecondaryButton
                                                className="px-3 py-1"
                                                onClick={() => {
                                                    setEditingId(application.id);
                                                    setRemarkInput(application.remarks || "");
                                                }}
                                            >
                                                Add Remark
                                            </SecondaryButton>

                                            {application.status === 'Pending' && (
                                                <PrimaryButton
                                                    className="px-3 py-1"
                                                    onClick={() => handleAccept(application)}
                                                >
                                                    Qualify
                                                </PrimaryButton>
                                            )}

                                            {application.status === 'Qualified' && (
                                                <PrimaryButton
                                                    className="px-3 py-1"
                                                    onClick={() => handleAccept(application)}
                                                >
                                                    Accept
                                                </PrimaryButton>
                                            )}

                                            {(application.status === 'Pending' || application.status === 'Qualified') && (
                                                <DangerButton
                                                    className="px-3 py-1"
                                                    onClick={() => handleReject(application)}
                                                >
                                                    Reject
                                                </DangerButton>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500 text-center py-4">
                    No {selectedStatus !== 'all' ? selectedStatus : ''} applicants available.
                </p>
            )}
        </DashboardCard>
    );
}
