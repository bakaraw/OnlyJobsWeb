import React, {useState} from "react";
import DashboardCard from "@/Components/Dashboard/Modal/DashboardCard.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import DangerButton from "@/Components/DangerButton.jsx";

function JobDetails({ job, applicants, onClose }) {
    const {
        job_title = "N/A",
        job_type = "N/A",
        job_description = "N/A",
        job_location = "N/A",
        company = "",
        views = 'N/A',
        applications = "N/A",
    } = job;

    // const [isEditing, setIsEditing] = useState(false);
    // const [editableJob, setEditableJob] = useState({
    //     job_title,
    //     company,
    //     job_location,
    //     job_type,
    //     job_description,
    // });



    const [selectedStatus, setSelectedStatus] = useState("all");
    const filteredApplicants = applicants
        .filter((app) => app.job_post_id === job.id)
        .filter((app) => selectedStatus === "all" || app.status === selectedStatus);

    const handleAccept = async (application) => {
        try {
            let endpoint;
            let newStatus;
            switch (application.status) {
                case 'Pending':
                    endpoint = '/applicants/qualified';
                    newStatus = 'Qualified';
                    break;
                case 'Qualified':
                    endpoint = '/applicants/accepted';
                    newStatus = 'Accepted';
                    break;
                default:
                    console.log('Invalid status for acceptance');
                    return;
            }

            const response = await axios.post(endpoint, {
                application_id: application.id
            });

            if (response.data.success) {
                application.status = newStatus;
                window.location.reload();

            }

        } catch (error) {
            console.error("Error updating application status:", error);
        }
    };
    // const handleReject = (application) => {
    //     try {
    //         const response = await axios
    //     }
    //     // Your logic here
    // };

    const [editingId, setEditingId] = useState(null);
    const [remarkInput, setRemarkInput] = useState("");

    const saveRemark = async (application) => {
        try {
            const response = await axios.patch("/applications/update-remark", {
                application_id: application.id,
                remarks: remarkInput.trim(),
            });

            if (response.data.success) {
                application.remarks = remarkInput.trim();
                setEditingId(null);
                setRemarkInput("");
            } else {
                throw new Error(response.data.message || "Failed to update remark");
            }
        } catch (error) {
            console.error("Failed to save remark:", error);
            alert(error.response?.data?.message || "Failed to save remark. Please try again.");
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{job_title}</h2>
                <button
                    onClick={onClose}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                >
                    Close
                </button>
            </div>
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

            <DashboardCard title="Job Applicant Overview">
                {/* Filter Buttons */}
                <div className="flex space-x-2 mb-4">
                    {['all', 'pending', 'Qualified', 'Accepted', 'Rejected'].map(status => (
                        <PrimaryButton
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={`px-4 py-2 rounded-full border transition-all ${
                                selectedStatus === status
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </PrimaryButton>
                    ))}
                </div>

                {filteredApplicants.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse">
                            <thead>
                            <tr>
                                <th className="py-2 px-4 text-left">Applicant</th>
                                <th className="py-2 px-4 text-left">Status</th>
                                <th className="py-2 px-4 text-left">Date Placed</th>
                                <th className="py-2 px-4 text-left">Remarks</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredApplicants.map((application) => (
                                <tr key={application.id} className="border-t hover:bg-gray-50">
                                    <td className="py-2 px-4">
                                        <div className="flex items-center">
                                            <span className="mr-2 text-gray-500">{filteredApplicants.indexOf(application) + 1}.</span>
                                            {application.user.first_name} {application.user.last_name}
                                        </div>

                                    </td>
                                    <td className="py-2 px-4">{application.job_post?.job_title || 'Unknown Job'}</td>
                                    <td className="py-2 px-4 capitalize">{application.status}</td>
                                    <td className="py-2 px-4">
                                        {new Date(application.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="py-2 px-4">
                                        {editingId === application.id ? (
                                            <textarea
                                                className="w-full border p-1"
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
                                    <td className="py-2 px-4 flex space-x-2">
                                        {editingId === application.id ? (
                                            <>
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
                                            </>
                                        ) : (
                                            <>
                                                <SecondaryButton
                                                    className="px-3 py-1"
                                                    onClick={() => {
                                                        setEditingId(application.id);
                                                        setRemarkInput(application.remarks || "");
                                                    }}
                                                >
                                                    Add Remark
                                                </SecondaryButton>
                                                <PrimaryButton
                                                    className="px-3 py-1"
                                                    onClick={() => handleAccept(application)}
                                                >
                                                    Accept
                                                </PrimaryButton>
                                                <DangerButton
                                                    className="px-3 py-1"
                                                    onClick={() => handleReject(application)}
                                                >
                                                    Reject
                                                </DangerButton>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 capitalize">
                        No  applicants available.
                    </p>
                )}
            </DashboardCard>


        </div>
    );
}
