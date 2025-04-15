import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import DashboardCard from "./DashboardCard.jsx";

const ApplicantPipelineCard = ({
                                   applications = [],
                                   title = "Applicant Pipeline",
                                   showCard = true,
                                   className = ""
                               }) => {
    // Track the count of applications in each status
    const [statusCounts, setStatusCounts] = useState({
        pending: 0,
        qualified: 0,
        accepted: 0,
        rejected: 0
    });

    // Status configurations
    const statusConfig = {
        pending: {
            label: "Pending",
            color: 'rgba(255, 159, 64, 0.7)',
            border: 'rgb(255, 159, 64)',
            bgClass: 'bg-orange-100'
        },
        qualified: {
            label: "Qualified",
            color: 'rgba(54, 162, 235, 0.7)',
            border: 'rgb(54, 162, 235)',
            bgClass: 'bg-blue-100'
        },
        accepted: {
            label: "Accepted",
            color: 'rgba(75, 192, 192, 0.7)',
            border: 'rgb(75, 192, 192)',
            bgClass: 'bg-green-100'
        },
        rejected: {
            label: "Rejected",
            color: 'rgba(255, 99, 132, 0.7)',
            border: 'rgb(255, 99, 132)',
            bgClass: 'bg-red-100'
        }
    };

    // Update counts when applications change
    useEffect(() => {
        const counts = {
            pending: applications.filter(app => app.status?.toLowerCase() === 'pending').length,
            qualified: applications.filter(app => app.status?.toLowerCase() === 'qualified').length,
            accepted: applications.filter(app => app.status?.toLowerCase() === 'accepted').length,
            rejected: applications.filter(app => app.status?.toLowerCase() === 'rejected').length
        };
        setStatusCounts(counts);
    }, [applications]);

    // Chart data configuration
    const chartData = {
        labels: ['Pending', 'Qualified', 'Accepted', 'Rejected'],
        datasets: [{
            label: 'Applicant Pipeline',
            data: [
                statusCounts.pending,
                statusCounts.qualified,
                statusCounts.accepted,
                statusCounts.rejected
            ],
            backgroundColor: [
                statusConfig.pending.color,
                statusConfig.qualified.color,
                statusConfig.accepted.color,
                statusConfig.rejected.color
            ],
            borderColor: [
                statusConfig.pending.border,
                statusConfig.qualified.border,
                statusConfig.accepted.border,
                statusConfig.rejected.border
            ],
            borderWidth: 1
        }]
    };

    // Chart options
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

    // Chart content
    const pipelineContent = (
        <>
            <div className="w-full h-64">
                <Bar data={chartData} options={chartOptions} />
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2 text-center text-sm">
                {Object.keys(statusConfig).map(status => (
                    <div key={status} className={`p-2 ${statusConfig[status].bgClass} rounded`}>
                        <div className="font-semibold">{statusCounts[status]}</div>
                        <div className="text-gray-600">{statusConfig[status].label}</div>
                    </div>
                ))}
            </div>
        </>
    );

    // Return the component with or without the card wrapper
    return showCard ? (
        <DashboardCard title={title} className={className}>
            {pipelineContent}
        </DashboardCard>
    ) : pipelineContent;
};

export default ApplicantPipelineCard;
