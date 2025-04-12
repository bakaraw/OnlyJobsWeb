import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { router } from "@inertiajs/react";
import JobList from "./Modal/JobList.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import { PieChart, Pie, Cell, Tooltip as PieTooltip, Legend as PieLegend } from "recharts";
import DashboardCard from "./Modal/DashboardCard.jsx";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip as ChartTooltip,
    Legend as ChartLegend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, ChartLegend);

export default function DashboardContent({ auth, jobs, applicants, totalViews, totalUsers, totalJob }) {
    const [showDetails, setShowDetails] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        if (!auth.user) {
            router.visit('/login');
        }
    }, [auth]);

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];
    const pieData = [
        { name: 'Jobs', value: totalJob },
        { name: 'Users', value: totalUsers },
        { name: 'Views', value: totalViews },
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
            <div className="grid grid-cols-1 gap-4">

                {/* Job Views Chart */}
                <DashboardCard title="Job Views Overview">
                    <div className="flex-grow flex items-end">
                        <Bar
                            data={chartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                            }}
                        />
                    </div>
                </DashboardCard>
            </div>

            {/* Overall Views Pie Chart */}
            <div className="flex flex-col items-center">
                <DashboardCard title="Overall Views">
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
                        <PieTooltip />
                        <PieLegend />
                    </PieChart>
                </DashboardCard>
            </div>

            {/* Job Applicant Overview */}
            <DashboardCard title="Job Applicant Overview">
                {applicants.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse">
                            <thead>
                            <tr>
                                <th>Job Title</th>
                                <th>Applicant</th>
                                <th>Status</th>
                                <th>Date Placed</th>
                            </tr>
                            </thead>
                            <tbody>
                            {applicants.map((application) => {
                                const job = jobs.find(j => j.id === application.job_id);
                                return (
                                    <tr key={application.id} className="border-t cursor-pointer hover:bg-gray-100">
                                        <td className="py-2 px-4">
                                            {application.job_post?.job_title || 'Unknown Job'}
                                        </td>
                                        <td className="py-2 px-4">
                                            {application.user.first_name} {application.user.last_name}
                                        </td>
                                        <td className="py-2 px-4">{application.status}</td>
                                        <td className="py-2 px-4">
                                            {new Date(application.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-2 px-4 flex space-x-2">
                                            <SecondaryButton
                                                className="px-4 py-2 flex items-center justify-center"
                                                onClick={() => handleAccept(application)}
                                            >
                                                Accept
                                            </SecondaryButton>
                                            <SecondaryButton
                                                className="px-4 py-2 flex items-center justify-center"
                                                onClick={() => handleReject(application)}
                                            >
                                                Reject
                                            </SecondaryButton>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500">No applicants available.</p>
                )}
            </DashboardCard>

            {showDetails && (
                <JobList job={selectedJob} placements={selectedJob.placements || []} onClose={() => setShowDetails(false)} />
            )}
        </div>
    );
}
