import React, { useState } from "react";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import DangerButton from "@/Components/DangerButton.jsx";
import axios from "axios";
import DashboardCard from "@/Components/Dashboard/Modal/DashboardCard.jsx";
import {usePage} from "@inertiajs/react";
import ConfirmModal from "@/Components/ConfirmModal.jsx";
import MessageButton from "@/Components/MessageButton.jsx";
import RequirementsViewerModal from "@/Components/Dashboard/Modal/RequirementsViewerModal.jsx";
import DocumentViewerModal from "@/Components/Dashboard/Modal/DocumentViewModal.jsx";


export default function ApplicantsSection({applicants}) {
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [editingId, setEditingId] = useState(null);
    const [remarkInput, setRemarkInput] = useState("");
    const [documentModal, setDocumentModal] = useState({
        show: false,
        applicationId: null,
    });

    const {props} = usePage();
    const {statuses, degrees, requirements, skills} = props;

    const filteredApplicants = applicants.filter(
        (app) =>
            selectedStatus === "all" ||
            app.status?.toLowerCase() === selectedStatus.toLowerCase()
    );

    // Open document modal with specific application ID
    const openDocumentModal = (applicationId) => {
        setDocumentModal({ show: true, applicationId });
    };

    // Close document modal
    const closeDocumentModal = () => {
        setDocumentModal({ show: false, applicationId: null });
    };

    const educationLevel = {
        'Graduate': 1,
        'Undergraduate': 2,
        'Vocational': 3,
        'High School': 4,
        'Elementary': 5,
    };

    // Check if applicant meets education requirement
    const meetsEducationRequirement = (applicantLevel, requiredLevel) => {
        const applicantRank = educationLevel[applicantLevel] || 0;
        const requiredRank = educationLevel[requiredLevel] || 0;
        return applicantRank <= requiredRank; // Lower rank is higher education
    };

    // Check if applicant has the required skills
    const meetsSkillsRequirement = (applicantSkills, jobSkills) => {
        if (!applicantSkills || !jobSkills || applicantSkills.length === 0 || jobSkills.length === 0) {
            return false;
        }

        // Check if applicant has at least one of the required skills
        return jobSkills.some(jobSkill =>
            applicantSkills.some(appSkill =>
                appSkill.skill_name.toLowerCase() === jobSkill.skill_name.toLowerCase()
            )
        );
    };

    const [modalProps, setModalProps] = useState({
        show: false,
        type: "success",
        message: "",
        onClose: () => setModalProps((prev) => ({...prev, show: false})),
        onConfirm: null, // Changed to null initially
    });

    const closeModal = () => {
        setModalProps(prev => ({...prev, show: false}));
    };

    const handleAccept = async (application) => {
        try {
            if (application.status === "Pending") {
                const applicantEducationLevel = application.user.educations?.[0]?.education_level;
                const requiredEducationLevel = application.job_post.degree?.name;
                const applicantSkills = application.user.user_skills || [];
                const jobSkills = application.job_post.skills || [];

                const educationMet = meetsEducationRequirement(applicantEducationLevel, requiredEducationLevel);
                const skillsMet = meetsSkillsRequirement(applicantSkills, jobSkills);

                console.log('Education Met:', educationMet, 'Skills Met:', skillsMet);
                console.log('Applicant Education:', applicantEducationLevel, 'Required:', requiredEducationLevel);
                console.log('Applicant Skills:', applicantSkills.map(s => s.skill_name), 'Required Skills:', jobSkills.map(s => s.skill_name));

                let msg = "";

                if (!educationMet && !skillsMet) {
                    msg = "Applicant does not meet education level and skills requirements.";
                } else if (!educationMet) {
                    msg = "Applicant does not meet education level requirements.";
                } else if (!skillsMet) {
                    msg = "Applicant does not meet skills requirements.";
                }

                if (msg) {
                    // Show warning but still allow qualification
                    msg += " Do you still want to proceed?";

                    // Define the confirmation action for accepting despite warnings
                    const confirmAction = async () => {
                        try {
                            const response = await axios.post("/applicants/qualified", {
                                application_id: application.id
                            });
                            if (response.data.success) {
                                window.location.reload();
                            }
                            closeModal();
                        } catch (error) {
                            console.error("Error qualifying applicant:", error);
                            closeModal();
                        }
                    };

                    setModalProps({
                        show: true,
                        type: "warning",
                        message: msg,
                        onClose: closeModal,
                        onConfirm: confirmAction // Assign the confirmation action properly
                    });
                    return; // Make sure we don't continue with the function
                } else {
                    // If all requirements are met, just qualify without warning
                    const response = await axios.post("/applicants/qualified", {
                        application_id: application.id
                    });
                    if (response.data.success) {
                        window.location.reload();
                    }
                }
            } else if (application.status === "Qualified") {
                setModalProps({
                    show: true,
                    type: "success",
                    message: `Are you sure you want to accept ${application.user.first_name} ${application.user.last_name}?`,
                    onClose: closeModal,
                    onConfirm: async () => {
                        try {
                            const response = await axios.post("/applicants/accepted", {
                                application_id: application.id
                            });
                            if (response.data.success) {
                                window.location.reload();
                            }
                            closeModal();
                        } catch (error) {
                            console.error("Error accepting applicant:", error);
                            closeModal();
                        }
                    }
                });
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
                            <th className="py-2 px-4 text-left">Documents</th>

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
            <ConfirmModal
                show={modalProps.show}
                type={modalProps.type}
                message={modalProps.message}
                onClose={modalProps.onClose}
                onConfirm={modalProps.onConfirm} // This now correctly passes the confirmation function
                autoClose={modalProps.type !== "warning"} // Don't auto-close warning modals
            />
            <DocumentViewerModal
                isOpen={documentModal.show}
                onClose={closeDocumentModal}
                applicationId={documentModal.applicationId}
                applicantInfo={documentModal.applicationId ? {
                    name: `${filteredApplicants.find(app => app.id === documentModal.applicationId)?.user.first_name
                    || ''} ${filteredApplicants.find(app => app.id === documentModal.applicationId)?.user.last_name || ''}`,
                    status: filteredApplicants.find(app => app.id === documentModal.applicationId)?.status || "N/A",
                    dateApplied: new Date(filteredApplicants.find(app => app.id === documentModal.applicationId)?.created_at || "").toLocaleDateString(),
                    jobTitle: filteredApplicants.find(app => app.id === documentModal.applicationId)?.job_post?.job_title || "Job Position"
                } : null}
            />
        </DashboardCard>
    );
}
