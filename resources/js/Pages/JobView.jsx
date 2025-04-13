import React from 'react';
import { router, usePage } from '@inertiajs/react';
import ContentLayout from '@/Layouts/ContentLayout';
import MainPageLayout from '@/Layouts/MainPageLayout';
import PrimaryButton from '@/Components/PrimaryButton';

const JobDescriptionCard = ({ jobDescription }) => (
    <div className="mt-4">
        <p className="text-gray-700 leading-relaxed">{jobDescription}</p>
    </div>
);

const JobDetailsCard = ({ job }) => (
    <div className="mt-4">
        <h2 className="text-2xl font-semibold">Salary</h2>
        <p className="text-xl font-semibold mt-1">
            ₱{job.min_salary} - ₱{job.max_salary}
        </p>
    </div>
);

const RequirementsCard = ({ requirements }) => (
    <div className="mt-4">
        <h2 className="text-2xl font-semibold text-primary">Requirements</h2>
        <ul className="list-disc ml-6 mt-2 text-gray-700">
            {requirements?.map((req) => (
                <li key={req.requirement_id} className="text-gray-600">{req.requirement_name}</li>
            ))}
        </ul>
    </div>
);

const SkillsCard = ({ skills }) => (
    <div className="mt-4">
        <h2 className="text-2xl font-semibold text-primary">Skills</h2>
        <div className="flex flex-wrap gap-3 mt-4">
            {skills?.map((skill) => (
                <span key={skill.skill_id} className="bg-secondary text-black px-4 py-2 rounded-full text-sm font-medium">
                    {skill.skill_name}
                </span>
            ))}
        </div>
    </div>
);

const JobCompanyCard = ({ JobCompany }) => (
    <div className="mt-4">
        <h3 className="text-lg font-semibold">About the Company:</h3>
        <p className="text-gray-700 leading-relaxed font-semibold text-primary">{JobCompany}</p>
    </div>
);

const handleApply = (jobId) => {
    router.post(`/jobs/${jobId}/apply`, {}, {
        onSuccess: () => {
            alert('You have successfully applied!');
        },
        onError: (errors) => {
            alert(errors.message || 'There was an error applying to the job.');
        },
        preserveScroll: true
    });
};

export default function JobView() {
    const { jobview, authUser } = usePage().props;

    return (
        <MainPageLayout
            header={
                <ContentLayout>
                    <PrimaryButton
                        href={route('find_work')}
                        className="float-right"
                        onClick={(e) => {
                            e.preventDefault();
                            router.visit(route('find_work'));
                        }}
                    >
                        Back to Job List
                    </PrimaryButton>

                    <p className="text-3xl font-bold">{jobview.job_title}</p>
                    <p className="text-gray-500 text-md">
                        Posted {new Date(jobview.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "2-digit",
                        year: "numeric",
                    })} — {jobview.job_location}
                    </p>
                    <div className="text-md mt-2">{jobview.job_type}</div>
                </ContentLayout>
            }
        >
            <JobDescriptionCard jobDescription={jobview.job_description} />

            <JobDetailsCard job={jobview} />

            <SkillsCard skills={jobview.skills} />

            <RequirementsCard requirements={jobview.requirements} />

            <JobCompanyCard JobCompany={jobview.company} />

            <div className="w-24 h-24 rounded-full overflow-hidden mb-2 border-4 border-gray-300 ring-2 ring-white"></div>

            <div className="mt-12">
                <PrimaryButton onClick={() => handleApply(jobview.id)}>
                    Apply
                </PrimaryButton>
            </div>
        </MainPageLayout>
    );
}
