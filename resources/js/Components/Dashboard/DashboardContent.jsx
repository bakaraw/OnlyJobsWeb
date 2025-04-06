import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import JobList from "./Modal/JobList.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardContent({ jobs, placements }) {
    const [showDetails, setShowDetails] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [selectedPlacement, setSelectedPlacement] = useState(null);

    console.log(jobs)
    console.log(placements)

    const chartData = {
        labels: jobs.map((job) => job.job_title),
        datasets: [
            {
                label: "Job Views",
                data: jobs.map((job) => job.views),
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Job Views Chart */}
                <div className="dashboard-cards p-4 bg-white rounded-md shadow-md w-full">
                    <h3 className="text-xl font-semibold mb-4">Job Views Overview</h3>
                    <div className="chart-container">
                        <Bar
                            data={chartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                onClick: (event, elements) => {
                                    if (elements.length > 0) {
                                        const index = elements[0].index;
                                        const job = jobs[index];
                                        setShowDetails(true);
                                        setSelectedJob(job);
                                    }
                                },
                            }}
                        />
                    </div>
                </div>

                <div className="dashboard-cards p-4 bg-white rounded-md shadow-md w-full">
                    <h3 className="text-xl font-semibold mb-4">Job Applicant Overview</h3>
                    {selectedJob ? (
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full border-collapse">
                                <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b">User</th>
                                    <th className="py-2 px-4 border-b">Status</th>
                                    <th className="py-2 px-4 border-b">Date Placed</th>
                                    <th className="py-2 px-4 border-b">Additional Remarks</th>
                                </tr>
                                </thead>
                                <tbody>
                                {placements.filter(p => p.job_post_id === selectedJob.id).length > 0 ? (
                                    placements.filter(p => p.job_post_id === selectedJob.id)

                                        .map((placement) => (
                                            <tr key={placement.id} className="border-t cursor-pointer hover:bg-gray-100">
                                                <td className="py-2">{placement.user.first_name}</td>
                                                <td className="py-2">{placement.placement_status}</td>
                                                <td className="py-2">{new Date(placement.created_at).toLocaleDateString()}</td>
                                                <td className="py-2">{placement.additional_remarks}</td>
                                                <td className="py-2">
                                                    <SecondaryButton className="col-span-1 px-4 py-2 flex items-center justify-center h-full" onClick={() => handleAccept(placement)}>Accept</SecondaryButton>
                                                    <SecondaryButton className="col-span-1 px-4 py-2 flex items-center justify-center h-full " onClick={() => handleReject(placement)}>Reject</SecondaryButton>
                                                </td>
                                            </tr>

                                        ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-2 px-4 text-center text-gray-500">
                                            No placements available.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500">Select a job to view placements.</p>
                    )}
                </div>
                <br/>
            </div>

            {showDetails && (

                <JobList job={selectedJob} placements={selectedJob.placements || []} onClose={() => setShowDetails(false)} />
            )}
        </div>
    );
}
