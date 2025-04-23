import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { router } from "@inertiajs/react";
import JobList from "./Modal/JobList.jsx";
import { Doughnut } from 'react-chartjs-2';
import DashboardCard from "./Modal/DashboardCard.jsx";
import { Link } from '@inertiajs/react';
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Modal from "../Modal.jsx";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip as ChartTooltip,
    Legend as ChartLegend
} from "chart.js";
import ApplicantPipelineCard from "@/Components/Dashboard/Modal/ApplicantPipelineCard.jsx";
import CreateJobPost from "@/Pages/CreateJobPost.jsx";
import CreateJobPostModal from "./Modal/CreateJobPostModal.jsx";


ChartJS.register(
    ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale, BarElement, Title, ChartTooltip, ChartLegend,
    ChartDataLabels
);
export default function DashboardContent({
    auth,
    jobs,
    applicants,
    totalViews,
    totalUsers,
    totalJob,
}) {

    // function toggleUserDetails(id) {
    //
    //     if (expandedUser === userId) {
    //         setExpandedUser(null);
    //     } else {
    //         setExpandedUser(userId);
    //     }
    //
    // }

    const [showDetails, setShowDetails] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("all");

    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredApplicants = selectedStatus === "all"
        ? applicants
        : applicants.filter((app) => app.status === selectedStatus
        );

    useEffect(() => {
        if (!auth.user) {
            router.visit('/login');
        }
    }, [auth]);

    const doughnutData = {
        labels: ['Jobs', 'Users'],
        datasets: [
            {
                data: [totalJob, totalUsers],
                backgroundColor: ['#8884d8', '#82ca9d',],
                borderWidth: 1,
            },
        ],
        options: {
            plugins: {
                datalabels: {
                    color: '#000000',
                    formatter: (value, context) => {
                        return `${context.chart.data.labels[context.dataIndex]}: ${value}`;
                    },
                    font: {
                        weight: 'bold',
                        size: 12
                    },
                }
            }
        }
    };

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
                {
                    //<Link href={route('job_posts.create')}>
                    //    <PrimaryButton>
                    //        Create Job1
                    //    </PrimaryButton>
                    //</Link>
                }
                <PrimaryButton onClick={() => setIsModalOpen(true)}>
                    Create Job
                </PrimaryButton>
                <CreateJobPostModal
                    show={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </div>

            <div className="space-y-6">
                <div className="flex flex-row items-start mb-4 space-x-4">
                    <ApplicantPipelineCard
                        applications={applicants}
                        onStatusClick={(status) => setSelectedStatus(status)}
                        className="h-[423px]"

                    />
                    <DashboardCard className="flex-1 h-50 w-1/2">
                        <div className="w-full h-full flex items-center justify-center">
                            <Doughnut
                                data={doughnutData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                }}
                                style={{ width: '300px', height: '391px' }}
                            />
                        </div>
                    </DashboardCard>
                    <div className="flex flex-col flex-1 space-y-4">
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
                                <div className="text-green-500 text-3xl">🧑‍💼</div>
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
                        <DashboardCard>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-sm text-gray-500">Hired</h2>
                                    <p className="text-2xl font-semibold text-gray-800">
                                        {applicants.filter(app => app.status === 'accepted').length}
                                    </p>
                                </div>
                                <div className="text-yellow-500 text-3xl">⏳</div>
                            </div>
                        </DashboardCard>
                    </div>
                </div>
            </div>
            <DashboardCard>
                {filteredApplicants.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-2 px-4 text-left">Applicant</th>
                                    <th className="py-2 px-4 text-left">Job Title</th>
                                    <th className="py-2 px-4 text-left">Date Placed</th>
                                    <th className="py-2 px-4 text-left">Status</th>
                                    <th className="py-2 px-4 text-left">Remarks</th>
                                </tr>
                            </thead >
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
                                        <td className="py-2 px-4">{new Date(application.created_at).toLocaleDateString()}</td>
                                        <td className="py-2 px-4">{application.status || 'Unknown Status'}</td>
                                        <td className="py-2 px-4 capitalize">{application.remarks}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table >
                    </div >
                ) : (
                    <p className="text-gray-500">No applicants found.</p>
                )
                }

            </DashboardCard >

        </div >
    );
}
