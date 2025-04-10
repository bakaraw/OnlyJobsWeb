// resources/js/Pages/Job/View.jsx
import React from 'react';
import { usePage } from '@inertiajs/react';
import ContentLayout from '@/Layouts/ContentLayout';
import MainPageLayout from '@/Layouts/MainPageLayout';
import PrimaryButton from '@/Components/PrimaryButton';

export default function JobView() {
    const { jobview } = usePage().props;

    return (
        <MainPageLayout
            header={
                <ContentLayout>
                    <p className="text-3xl">{jobview.job_title}</p>
                    <p className="text-md mt-2 text-gray-600">{jobview.company} — {jobview.job_location}</p>
                </ContentLayout>
            }
        >
            <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
                <div>
                    <h2 className="text-xl font-semibold">Job Description</h2>
                    <p className="mt-2 text-gray-700">{jobview.job_description}</p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold">Job Details</h2>
                    <ul className="mt-2 space-y-1 text-gray-700">
                        <li><strong>Type:</strong> {jobview.job_type}</li>
                        <li><strong>Experience:</strong> {jobview.min_experience_years} years</li>
                        <li><strong>Salary:</strong> ₱{jobview.min_salary} - ₱{jobview.max_salary}</li>
                        <li><strong>Degree:</strong> {jobview.degree?.degree_name ?? 'Not specified'}</li>
                        <li><strong>Status:</strong> {jobview.status?.status_name ?? 'Pending'}</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-xl font-semibold">Requirements</h2>
                    <ul className="list-disc ml-6 text-gray-700">
                        {jobview.requirements?.map((req) => (
                            <li key={req.requirement_id}>{req.requirement_name}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className="text-xl font-semibold">Skills</h2>
                    <ul className="flex flex-wrap gap-2 mt-2">
                        {jobview.skills?.map((skill) => (
                            <span key={skill.skill_id} className="bg-secondary text-white px-3 py-1 rounded-full text-sm">
                                {skill.skill_name}
                            </span>
                        ))}
                    </ul>
                </div>

                <PrimaryButton className="mt-6" href={route('findwork')}>
                    Back to Job List
                </PrimaryButton>
            </div>
        </MainPageLayout>
    );
}
