import React, { useState } from "react";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import DangerButton from "@/Components/DangerButton.jsx";
import axios from "axios";
import DashboardCard from "@/Components/Dashboard/Modal/DashboardCard.jsx";
import { usePage } from "@inertiajs/react";
import ConfirmModal from "@/Components/ConfirmModal.jsx";
import RequirementsViewerModal from "@/Components/Dashboard/Modal/RequirementsViewerModal.jsx";
import DocumentViewerModal from "@/Components/Dashboard/Modal/DocumentViewModal.jsx";

export default function ApplicantsSection({ applicants, onApplicantSelect }) {
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [editingId, setEditingId] = useState(null);
    const [remarkInput, setRemarkInput] = useState("");
    const [documentModal, setDocumentModal] = useState({ show: false, applicationId: null, loading: false, applicantDetails: null });
    const [selectedApplicant, setSelectedApplicant] = useState(null);

    const { props } = usePage();
    const { statuses, degrees, requirements, skills } = props;

    // Filter applicants by status
    const filteredApplicants = applicants.filter(
        (app) => selectedStatus === "all" || app.status?.toLowerCase() === selectedStatus.toLowerCase()
    );

    // Open document modal for selected applicant
    const openDocumentModal = async (applicationId) => {
        const app = filteredApplicants.find((a) => a.id === applicationId);
        setSelectedApplicant(app);
        setDocumentModal({ show: true, applicationId, loading: true, applicantDetails: null });

        try {
            const response = await axios.get(`/applicant-details/${applicationId}`);
            if (response.data.success) {
                setDocumentModal({
                    show: true,
                    applicationId,
                    loading: false,
                    applicantDetails: {
                        ...response.data.applicant,
                        current_application: response.data.application,
                        documents: response.data.documents,
                        userSkills: response.data.applicant.user_skills || [],
                        educations: response.data.applicant.educations || [],
                        work_histories: response.data.applicant.work_histories || [],
                        certifications: response.data.applicant.certifications || [],
                        applications: response.data.applicant.applications || [],
                        job_post: response.data.application.job_post || {}
                    }
                });
            }
        } catch (error) {
            console.error("Error fetching applicant details:", error);
            setDocumentModal({ show: false, applicationId: null, loading: false, applicantDetails: null });
        }
    };

    const closeDocumentModal = () => {
        setDocumentModal({ show: false, applicationId: null, loading: false, applicantDetails: null });
        setSelectedApplicant(null);
    };

    // Confirmation modal state
    const [modalProps, setModalProps] = useState({
        show: false,
        type: "success",
        message: "",
        onClose: () => setModalProps((prev) => ({ ...prev, show: false })),
        onConfirm: null
    });

    const closeModal = () => setModalProps((prev) => ({ ...prev, show: false }));

    // Define helpers and handlers (meetsEducationRequirement, meetSkillsRequirement, handleAccept, handleReject, saveRemark) unchanged...
    // For brevity, assume they remain the same as before

    function handleReject(application) {
        setModalProps({
            show: true,
            type: "warning",
            message: `Are you sure you want to reject ${application.user.first_name} ${application.user.last_name}'s application?`,
            onConfirm: async () => {
                try {
                    const response = await axios.post(`/api/reject-applicant`, {
                        job_post_id: application.job_post_id,
                        user_id: application.user.id,
                    });

                    if (response.data.success) {
                        setFilteredApplicants((prev) =>
                            prev.map((app) =>
                                app.id === application.id
                                    ? { ...app, status: "rejected", remarks: remarkInput || app.remarks }
                                    : app
                            )
                        );
                        setModalProps((prev) => ({ ...prev, show: false }));
                        setEditingId(null);
                        setRemarkInput("");
                    }
                } catch (error) {
                    console.error("Error rejecting application:", error);
                }
            },
            onClose: () => setModalProps((prev) => ({ ...prev, show: false })),
        });
    }
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

            {/* Applicants Table */}
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
                            <th className="py-2 px-4 text-left">Applicant Information</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredApplicants.map((application, index) => (
                            <tr key={application.id} className="border-t hover:bg-gray-50">
                                <td className="py-2 px-4">
                                    <div className="flex items-center">
                                        <span className="mr-2 text-gray-500">{index + 1}.</span>
                                        <span
                                            className="cursor-pointer hover:text-blue-600 hover:underline"
                                            onClick={() => {
                                                onApplicantSelect(application.id);
                                                setSelectedApplicant(application);
                                            }}
                                        >
                        {application.user.first_name} {application.user.last_name}
                      </span>
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
                                <td className="py-2 px-4">
                                    <SecondaryButton onClick={() => openDocumentModal(application.id)}>
                                        View Documents
                                    </SecondaryButton>
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

            <ConfirmModal {...modalProps} autoClose={modalProps.type !== "warning"} />

            <DocumentViewerModal
                isOpen={documentModal.show}
                onClose={closeDocumentModal}
                applicationId={documentModal.applicationId}
                applicantDetails={documentModal.applicantDetails}
                loading={documentModal.loading}
                applicantInfo={selectedApplicant}
                filteredApplicants={selectedApplicant ? [selectedApplicant] : []}
            />
        </DashboardCard>
    );
}
