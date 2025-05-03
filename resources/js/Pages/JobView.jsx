import React from 'react';
import { router, usePage } from '@inertiajs/react';
import ContentLayout from '@/Layouts/ContentLayout';
import MainPageLayout from '@/Layouts/MainPageLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { Head } from '@inertiajs/react';
import MessageButton from '@/Components/MessageButton';

const JobDescriptionCard = ({ jobDescription, className }) => (
    <div className={" " + className}>
        <p className="text-gray-700 leading-relaxed">{jobDescription}</p>
    </div>
);

const JobDetailsCard = ({ job, className }) => {
    const salaryType = {
        "Fixed": "Fixed Salary",
        "Range": "Salary Range"
    }

    const experienceLevel = {
        1: "Entry Level",
        3: "Intermediate Level",
        5: "Expert Level"
    }

    return (
        <>
            <div className={'grid grid-cols-3 w-full mt-10 text-gray-800' + className}>
                <div className='col-span-1'>
                    <div className='flex items-center justify-start gap-3 text-md'>
                        <i class="fa-solid fa-tags fa-lg"></i>
                        <div className='flex flex-col '>
                            {
                                job.salary_type === "Range" ?
                                    <p className="font-semibold">
                                        Php {Number(job.min_salary).toLocaleString()} - Php {Number(job.max_salary).toLocaleString()}
                                    </p> : <p className='font-semibold'>₱{job.min_salary}</p>

                            }
                            <p className='text-gray-600 text-sm font-light'>
                                {salaryType[job.salary_type]}
                            </p>
                        </div>
                    </div>
                </div>

                <div className='col-span-1'>
                    <div className='flex items-center justify-start gap-3'>
                        <i class="fa-solid fa-brain fa-lg"></i>
                        <div className='flex flex-col'>
                            <p className=''>{experienceLevel[job.min_experience_years]}</p>
                            <p className='text-sm font-light text-gray-600'>Experience Level</p>
                        </div>
                    </div>
                </div>

                <div className='col-span-1'>
                    <div className='flex items-center justify-start gap-3'>
                        <i class="fa-solid fa-business-time fa-lg"></i>
                        <div className="text-md mt-2">{job.job_type}</div>
                    </div>
                </div>
            </div>
        </>
    );


}

const RequirementsCard = ({ requirements, className }) => (
    <div className={"mt-10 " + className}>
        <h2 className="text-xl font-semibold text-dark">Requirements</h2>
        <ul className="list-disc ml-10 mt-2 text-gray-700">
            {requirements?.map((req) => (
                <li key={req.requirement_id} className="text-gray-600">{req.requirement_name}</li>
            ))}
        </ul>
    </div>
);

const SkillsCard = ({ skills, className }) => {
    const [showAll, setShowAll] = useState(false);

    const visibleSkills = showAll ? skills : skills?.slice(0, 3);
    const hiddenSkillCount = skills?.length > 3 ? skills.length - 3 : 0;

    return (
        <div className={`mt-10 ${className}`}>
            <h2 className="text-xl font-semibold text-dark">Skills and Expertise</h2>

            <div className="flex flex-wrap gap-3 mt-3 overflow-x-auto hide-scrollbar fade-right">
                {visibleSkills?.map((skill) => (
                    <span key={skill.skill_id} className="bg-gray-100 text-dark px-4 py-1 rounded-full text-sm font-light">
                        {skill.skill_name}
                    </span>
                ))}

                {!showAll && hiddenSkillCount > 0 && (
                    <button
                        onClick={() => setShowAll(true)}
                        className="bg-transparent border border-primary text-primary rounded-full px-4 py-1 text-sm hover:bg-gray-50"
                    >
                        +{hiddenSkillCount} more
                    </button>
                )}
            </div>

            {showAll && skills?.length > 3 && (
                <div className="mt-3">
                    <button
                        onClick={() => setShowAll(false)}
                        className="text-primary text-sm border border-primary rounded-full hover:bg-gray-50 px-4 py-1"
                    >
                        Show less
                    </button>
                </div>
            )}
        </div>
    );
};

const JobCompanyCard = ({ JobCompany, className }) => (
    <div className={"mt-10 " + className}>
        <h3 className="text-lg font-semibold">About the Company:</h3>
        <div className='flex items-center justify-start gap-3 mt-3'>
            <div className="w-16 h-16 rounded-full overflow-hidden mb-2 border-4 border-gray-300 ring-2 ring-white"></div>
            <p className="text-gray-700 leading-relaxed font-semibold=">{JobCompany}</p>
        </div>
    </div>
);

const handleApply = (jobId) => {
    router.post(`/jobs/${jobId}/apply`, {}, {
        onSuccess: () => {
            //alert('You have successfully applied!');
        },
        onError: (errors) => {
            alert(errors.message || 'There was an error applying to the job.');
        },
        preserveScroll: true
    });
};

export default function JobView() {
    const { jobview } = usePage().props;
    const { auth } = usePage().props;
    const [showMessages, setShowMessages] = useState(false);
    const [conversation, setConversation] = useState(null);


    const handleSendMessage = async (message) => {
        try {
            if (!conversation || !conversation.id) {
                console.error("No conversation exists to send message.");
                return;
            }

            await axios.post(`/conversations/${conversation.id}/messages`, {
                text: message.text,
            });

            // Optional: append the new message to local state
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    const startConversation = async () => {
        try {
            // Call backend to create real conversation immediately
            const response = await axios.post(`/conversations/${jobview.id}/create`);
            console.log("Conversation response:", response.data); // debug log

            setConversation(response.data);
            setShowMessages(true);
        } catch (err) {
            console.error("Error creating conversation:", err);
        }
    };

    // Function to handle starting a new conversation

    return (
        <MainPageLayout>
            <Head title={jobview.job_title} />
            <ContentLayout>
                <div className='mt-24'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className="text-3xl font-bold text-dark">{jobview.job_title}</p>
                            <p className="text-gray-500 text-md mt-2">
                                Posted {formatDistanceToNow(new Date(jobview.created_at), { addSuffix: true })} —{" "}
                                <i className="fa-solid fa-location-dot"></i> {jobview.job_location}
                            </p>
                        </div>
                        <div className='flex items-center justify-between'>
                            {

                                auth.user && (<button
                                    id='message-job'
                                    className='hover:bg-gray-200 text-primary px-3 py-2 rounded-lg'
                                    onClick={startConversation}
                                >
                                    <i class="fa-regular fa-message fa-xl"></i>
                                </button>)
                            }
                            <div className="ml-5">
                                <PrimaryButton

                                    className='min-w-32 flex items-center justify-center'
                                    onClick={() => handleApply(jobview.id)}
                                >
                                    Apply
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>

                </div>
                <JobDescriptionCard className="mt-5" jobDescription={jobview.job_description} />

                <JobDetailsCard job={jobview} />

                <SkillsCard skills={jobview.skills} />

                <RequirementsCard requirements={jobview.requirements} />

                <JobCompanyCard JobCompany={jobview.company} />
            </ContentLayout>

            <MessageButton
                show={showMessages}
                conversation={conversation}
                onClick={() => setShowMessages(true)}
                onClose={() => setShowMessages(false)}
            />
        </MainPageLayout>
    );
}
