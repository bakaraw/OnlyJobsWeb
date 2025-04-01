// DashboardLayout.jsx
import React from 'react';
import Sidebar from '../Components/Dashboard/Sidebar.jsx';
import Header from '../Components/Dashboard/Header.jsx';
import TasksPanel from '../components/TasksPanel';
import SpaceUsage from '../components/SpaceUsage';
import PerformanceChart from '../components/PerformanceChart';
import { usePage } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    if (!auth || !auth.user) {
        return <p>Loading or Unauthorized...</p>;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <Header />

                <div className="p-6">
                    {/* Task Cards Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <TasksPanel
                            title="Tasks On Track"
                            count={22}
                            subtitle="In Backlog: 43"
                            color="text-green-500"
                        />
                        <TasksPanel
                            title="Overdue Tasks"
                            count={7}
                            subtitle="From Yesterday: 16"
                            color="text-red-500"
                        />
                        <TasksPanel
                            title="Issues"
                            count={47}
                            subtitle="Closed By Team: 15"
                            color="text-yellow-400"
                        />
                        <SpaceUsage
                            percentage={50}
                            subtitle="25 of 50GB Used"
                        />
                    </div>

                    {/* Performance Chart */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <PerformanceChart />
                    </div>
                </div>
            </div>
        </div>
    );
}
