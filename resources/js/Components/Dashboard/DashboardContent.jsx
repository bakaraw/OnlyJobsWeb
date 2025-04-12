import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { router } from "@inertiajs/react";
import JobList from "./Modal/JobList.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import { PieChart, Pie, Cell, Tooltip as PieTooltip, Legend as PieLegend } from "recharts";
import DashboardCard from "./Modal/DashboardCard.jsx";
import { Link } from '@inertiajs/react';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip as ChartTooltip,
    Legend as ChartLegend
} from "chart.js";
import PrimaryButton from "@/Components/PrimaryButton.jsx";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, ChartLegend);

export default function DashboardContent({ auth, jobs, applicants, totalViews, totalUsers, totalJob }) {
    const [showDetails, setShowDetails] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    console.log("view", totalViews);

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
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
                <Link href={route('job_posts.create')}>
                    <PrimaryButton>
                        Create Job
                    </PrimaryButton>
                </Link>
            </div>
            <div className="grid grid-cols-1 gap-4">


                {/* Job Views Chart */}
                <DashboardCard>
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
            <div className="flex flex-col items-center mb-4">
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

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <DashboardCard>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm text-gray-500">Total Jobs</h2>
                            <p className="text-2xl font-semibold text-gray-800">{jobs.length}</p>
                        </div>
                        <div className="text-blue-500 text-3xl">📄</div>
                    </div>
                </DashboardCard>

                <DashboardCard>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm text-gray-500">Total Applicants</h2>
                            <p className="text-2xl font-semibold text-gray-800">{totalUsers}</p>
                        </div>
                        <div className="text-green-500 text-3xl">👤</div>
                    </div>
                </DashboardCard>

                <DashboardCard>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm text-gray-500">Pending Applications</h2>
                            <p className="text-2xl font-semibold text-gray-800">
                                {applicants.filter(app => app.status === 'pending').length}
                            </p>
                        </div>
                        <div className="text-yellow-500 text-3xl">⏳</div>
                    </div>
                </DashboardCard>

                <DashboardCard>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm text-gray-500">Total Views</h2>
                            <p className="text-2xl font-semibold text-gray-800">{totalViews}</p>
                        </div>
                        <div className="text-orange-500 text-3xl">👀</div>
                    </div>
                </DashboardCard>
            </div>

            {/*/!* Job Applicant Overview *!/*/}
            {/*<DashboardCard title="Job Applicant Overview">*/}
            {/*    {applicants.length > 0 ? (*/}
            {/*        <div className="overflow-x-auto">*/}
            {/*            <table className="table-auto w-full border-collapse">*/}
            {/*                <thead>*/}
            {/*                <tr>*/}
            {/*                    <th>Applicant</th>*/}
            {/*                    <th>Job Title</th>*/}
            {/*                    <th>Status</th>*/}
            {/*                    <th>Date Placed</th>*/}
            {/*                </tr>*/}
            {/*                </thead>*/}
            {/*                <tbody>*/}
            {/*                {applicants.map((application) => {*/}
            {/*                    const job = jobs.find(j => j.id === application.job_id);*/}
            {/*                    return (*/}
            {/*                        <tr key={application.id} className="border-t cursor-pointer hover:bg-gray-100">*/}
            {/*                            <td className="py-2 px-4">*/}
            {/*                                {application.user.first_name} {application.user.last_name}*/}
            {/*                            </td>*/}
            {/*                            <td className="py-2 px-4">*/}
            {/*                                {application.job_post?.job_title || 'Unknown Job'}*/}
            {/*                            </td>*/}


            {/*                            <td className="py-2 px-4">{application.status}</td>*/}
            {/*                            <td className="py-2 px-4">*/}
            {/*                                {new Date(application.created_at).toLocaleDateString()}*/}
            {/*                            </td>*/}
            {/*                            <td className="py-2 px-4 flex space-x-2">*/}
            {/*                                <PrimaryButton*/}
            {/*                                    className="px-4 py-2 flex items-center justify-center"*/}
            {/*                                    onClick={() => handleAccept(application)}*/}
            {/*                                >*/}
            {/*                                    Accept*/}
            {/*                                </PrimaryButton>*/}
            {/*                                <SecondaryButton*/}
            {/*                                    className="px-4 py-2 flex items-center justify-center"*/}
            {/*                                    onClick={() => handleReject(application)}*/}
            {/*                                >*/}
            {/*                                    Reject*/}
            {/*                                </SecondaryButton>*/}
            {/*                            </td>*/}
            {/*                        </tr>*/}
            {/*                    );*/}
            {/*                })}*/}
            {/*                </tbody>*/}
            {/*            </table>*/}
            {/*        </div>*/}
            {/*    ) : (*/}
            {/*        <p className="text-gray-500">No applicants available.</p>*/}
            {/*    )}*/}
            {/*</DashboardCard>*/}

            {showDetails && (
                <JobList job={selectedJob} placements={selectedJob.placements || []} onClose={() => setShowDetails(false)} />
            )}
        </div>
    );
}
