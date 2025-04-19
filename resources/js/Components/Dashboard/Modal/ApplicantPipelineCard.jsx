import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import DashboardCard from "./DashboardCard.jsx";

const ApplicantPipelineCard = ({
                                   applications = [],
                                   title = "Applicant Pipeline",
                                   showCard = true,
                                   className = "",
                                   onStatusClick = null
                               }) => {
    const [statusCounts, setStatusCounts] = useState({
        Pending: 0,
        Qualified: 0,
        Accepted: 0,
        Rejected: 0
    });

    const statusConfig = {
        Pending: {
            label: "Pending",
            color: 'rgba(255, 159, 64, 0.7)',
            border: 'rgb(255, 159, 64)',
            bgClass: 'bg-orange-100 hover:bg-orange-200'
        },
        Qualified: {
            label: "Qualified",
            color: 'rgba(54, 162, 235, 0.7)',
            border: 'rgb(54, 162, 235)',
            bgClass: 'bg-blue-100 hover:bg-blue-200'
        },
        Accepted: {
            label: "Accepted",
            color: 'rgba(75, 192, 192, 0.7)',
            border: 'rgb(75, 192, 192)',
            bgClass: 'bg-green-100 hover:bg-green-200'
        },
        Rejected: {
            label: "Rejected",
            color: 'rgba(255, 99, 132, 0.7)',
            border: 'rgb(255, 99, 132)',
            bgClass: 'bg-red-100 hover:bg-red-200'
        }
    };

    useEffect(() => {
        const counts = {
            Pending: applications.filter(app => app.status?.trim() === 'Pending').length,
            Qualified: applications.filter(app => app.status?.trim() === 'Qualified').length,
            Accepted: applications.filter(app => app.status?.trim() === 'Accepted').length,
            Rejected: applications.filter(app => app.status?.trim() === 'Rejected').length
        };
        setStatusCounts(counts);
    }, [applications]);

    const chartData = {
        labels: ['Pending', 'Qualified', 'Accepted', 'Rejected'],
        datasets: [{
            label: 'Applicant Pipeline',
            data: [
                statusCounts.Pending,
                statusCounts.Qualified,
                statusCounts.Accepted,
                statusCounts.Rejected
            ],
            backgroundColor: [
                statusConfig.Pending.color,
                statusConfig.Qualified.color,
                statusConfig.Accepted.color,
                statusConfig.Rejected.color
            ],
            borderColor: [
                statusConfig.Pending.border,
                statusConfig.Qualified.border,
                statusConfig.Accepted.border,
                statusConfig.Rejected.border
            ],
            borderWidth: 1
        }]
    };

    const chartOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const total = applications.length;
                        const value = context.raw;
                        const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                        return `${value} applications (${percentage}%)`;
                    }
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Applications'
                }
            }
        }
    };

    const handleStatusClick = (status) => {
        if (onStatusClick) {
            onStatusClick(status); // Keep the status in its original case
        }
    };

    const pipelineContent = (
        <>
            <div className="w-full h-64">
                <Bar data={chartData} options={chartOptions} />
            </div>

            <div className="mt-4 grid grid-cols-5 gap-2 text-center text-sm">
                <button
                    onClick={() => handleStatusClick('all')}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer transition-colors duration-200"
                >
                    <div className="font-semibold">{applications.length}</div>
                    <div className="text-gray-600">All</div>
                </button>
                {Object.keys(statusConfig).map(status => (
                    <button
                        key={status}
                        onClick={() => handleStatusClick(status)}
                        className={`p-2 ${statusConfig[status].bgClass} rounded cursor-pointer transition-colors duration-200`}
                    >
                        <div className="font-semibold">{statusCounts[status]}</div>
                        <div className="text-gray-600">{statusConfig[status].label}</div>
                    </button>
                ))}
            </div>
        </>
    );

    return showCard ? (
        <DashboardCard title={"Application Funnel Statistics"} className={className}>
            {pipelineContent}
        </DashboardCard>
    ) : pipelineContent;
};

export default ApplicantPipelineCard;
