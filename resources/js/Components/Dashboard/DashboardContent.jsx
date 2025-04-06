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
import { PieChart, Pie, Cell } from 'recharts';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardContent({ jobs, placements, totalViews, totalUsers }) {
    const [showDetails, setShowDetails] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [selectedPlacement, setSelectedPlacement] = useState(null);
    const COLORS = ['#0088FE', '#00C49F'];

    console.log(totalViews)
    console.log(totalUsers)

    const pieData = [
        { name: 'Users', value: totalUsers },
        { name: 'Views', value: totalViews }
    ];

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
                <div className="dashboard-cards p-4 bg-white rounded-md shadow-md w-full cursor-pointer">
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
                                                    <SecondaryButton
                                                        className="col-span-1 px-4 py-2 flex items-center justify-center h-full"
                                                        onClick={() => handleAccept(placement)}>
                                                        Accept
                                                    </SecondaryButton>
                                                    <SecondaryButton
                                                        className="col-span-1 px-4 py-2 flex items-center justify-center h-full"
                                                        onClick={() => handleReject(placement)}>
                                                        Reject
                                                    </SecondaryButton>
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

                {/* Pie Chart Section */}
                <div className="flex flex-col items-center">
                    <div className="dashboard-cards p-4 bg-white rounded-md shadow-md w-full">
                        <h2 className="text-xl font-bold mb-4">Total views in all Users</h2>

                    <PieChart width={400} height={300}>

                        <Pie
                            dataKey="value"
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            label
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                    </div>
                </div>

                <br />
            </div>

            {showDetails && (
                <JobList job={selectedJob} placements={selectedJob.placements || []} onClose={() => setShowDetails(false)} />
            )}
        </div>
    );
}
