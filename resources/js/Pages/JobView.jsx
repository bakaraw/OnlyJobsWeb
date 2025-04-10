import React from 'react';
import { usePage } from '@inertiajs/react';
import ContentLayout from '@/Layouts/ContentLayout';
import MainPageLayout from '@/Layouts/MainPageLayout';
import PrimaryButton from '@/Components/PrimaryButton';

const JobDescriptionCard = ({ jobDescription }) => (
    <div>
        <h2 className="text-2xl font-semibold text-primary mb-4">Job Description</h2>
        <p className="text-gray-700 leading-relaxed">{jobDescription}</p>
    </div>
);

const JobDetailsCard = ({ job }) => (
    <div>
        <h2 className="text-2xl font-semibold text-primary">Job Details</h2>
        <ul className="mt-4 space-y-2 text-gray-700">
            <li className="flex justify-between"><strong>Type:</strong> <span>{job.job_type}</span></li>
            <li className="flex justify-between"><strong>Experience:</strong> <span>{job.min_experience_years} years</span></li>
            <li className="flex justify-between"><strong>Salary:</strong> <span>₱{job.min_salary} - ₱{job.max_salary}</span></li>
            <li className="flex justify-between"><strong>Degree:</strong> <span>{job.degree?.degree_name ?? 'Not specified'}</span></li>
            <li className="flex justify-between"><strong>Status:</strong> <span>{job.status?.status_name ?? 'Pending'}</span></li>
        </ul>
    </div>
);

const RequirementsCard = ({ requirements }) => (
    <div>
        <h2 className="text-2xl font-semibold text-primary">Requirements</h2>
        <ul className="list-disc ml-6 mt-2 text-gray-700">
            {requirements?.map((req) => (
                <li key={req.requirement_id} className="text-gray-600">{req.requirement_name}</li>
            ))}
        </ul>
    </div>
);

const SkillsCard = ({ skills }) => (
    <div>
        <h2 className="text-2xl font-semibold text-primary">Skills</h2>
        <div className="flex flex-wrap gap-3 mt-4">
            {skills?.map((skill) => (
                <span key={skill.skill_id} className="bg-secondary text-white px-4 py-2 rounded-full text-sm font-medium">
          {skill.skill_name}
        </span>
            ))}
        </div>
    </div>
);

export default function JobView() {
    const { jobview } = usePage().props;

    return (
        <MainPageLayout
            header={
                <ContentLayout>
                    <PrimaryButton href={route('find_work')} className="float-right">
                        Back to Job List
                    </PrimaryButton>
                    <p className="text-3xl font-semibold text-primary">{jobview.job_title}</p>
                    <p className="text-md mt-2 text-gray-600">{jobview.company} — {jobview.job_location}</p>
                </ContentLayout>
            }
        >
                <JobDescriptionCard jobDescription={jobview.job_description} />

                <JobDetailsCard job={jobview} />

                <RequirementsCard requirements={jobview.requirements} />

                {/* Skills Card */}
                <SkillsCard skills={jobview.skills} />

        </MainPageLayout>
    );
}
