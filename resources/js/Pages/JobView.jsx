import React from 'react';
import { router, usePage } from '@inertiajs/react';
import ContentLayout from '@/Layouts/ContentLayout';
import MainPageLayout from '@/Layouts/MainPageLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { format, formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { Head } from '@inertiajs/react';
import ConfirmModal from '@/Components/ConfirmModal.jsx';
import ApplicationModal from "@/Components/Applicant/ApplicationModal.jsx";
import MessageButton from "@/Components/MessageButton.jsx";

function SimilarJobs({ suggestedJobs }) {
    console.log("Similar jobs: ", suggestedJobs);
    return (
        <div className="mt-10">
            <p className="text-2xl font-semibold mb-4 text-gray-800">Explore similar jobs</p>
            <div className="flex flex-wrap gap-4">
                {suggestedJobs.map((job, index) => (
                    <a
                        key={index}
                        className="p-4 rounded-xl shadow-md w-full sm:w-[300px] border border-gray-100 hover:bg-gray-100"
                        onClick={async (e) => {
                            e.preventDefault();
                            await axios.post(`/job_posts/${job.id}/increment_views`);
                            router.visit(route('job.view', job.id));
                        }}

                    >
                        <h3 className="text-lg font-semibold text-gray-700">{job.job_title}</h3>
                        <p className="text-sm text-gray-600 mt-2">{job.job_type}     • Posted {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</p>
                        <div className="mt-5 flex flex-wrap gap-2">
                            {job.skills.map((skill, i) => (
                                <span
                                    key={i}
                                    className="bg-primary-50 text-primary-600 text-xs font-semibold px-2 py-1 rounded-full"
                                >
                                    {skill.skill_name}
                                </span>
                            ))}
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

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
        <h3 className="text-lg font-semibold">About the Company</h3>
        <div className='flex items-center justify-start gap-3 mt-1'>
            <p className="text-gray-700 leading-relaxed font-semibold=">{JobCompany}</p>
        </div>
    </div>
);



export default function JobView() {
    const { jobview, suggestedJobs } = usePage().props;

    const { auth } = usePage().props;
    const [showMessages, setShowMessages] = useState(false);
    const [conversation, setConversation] = useState(null);
    const [showApplyModal, setShowApplyModal] = useState(false);

    console.log("jobview", jobview);
    console.log("jobview applications:", jobview.applications.map(app => app.user_id));

    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const handleApply = (jobId) => {
        router.post(`/jobs/${jobId}/apply`, {}, {
            onSuccess: () => {
                setNotification({
                    show: true,
                    message: 'You have successfully applied!',
                    type: 'success'
                });
            },
            onError: (errors) => {
                setNotification({
                    show: true,
                    message: errors.message || 'There was an error applying to the job.',
                    type: 'error'
                });
            },
            preserveScroll: true,
            only: [] // Prevents a full reload
        });
    };

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
                                {auth.user && jobview.applications.some(app => app.user_id === auth.user.id) ? (
                                    <PrimaryButton
                                        className='min-w-32 flex items-center justify-center'
                                        onClick={() => setShowApplyModal(true)}
                                    >
                                        Apply
                                    </PrimaryButton>
                                ) : (
                                    <PrimaryButton
                                        className='min-w-32 flex items-center justify-center'
                                        onClick={() => {
                                            handleApply(jobview.id);
                                        }}
                                    >
                                        Apply
                                    </PrimaryButton>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
                <JobDescriptionCard className="mt-5" jobDescription={jobview.job_description} />

                <JobDetailsCard job={jobview} />

                <SkillsCard skills={jobview.skills} />

                <RequirementsCard requirements={jobview.requirements} />

                <JobCompanyCard JobCompany={jobview.company} />
                {
                    //<div className='mt-10'>
                    //    <p className='text-2xl'>Explore similar jobs</p>
                    //    <div className='flex gap-3'>
                    //        <div className='bg-red-100 '>
                    //            heyhey
                    //        </div>
                    //        <div className='bg-red-100'>
                    //            wow2
                    //        </div>
                    //    </div>
                    //</div>
                }
                <SimilarJobs suggestedJobs={suggestedJobs} />
            </ContentLayout>

            <MessageButton
                show={showMessages}
                conversation={conversation}
                onClick={() => setShowMessages(true)}
                onClose={() => setShowMessages(false)}
            />
            <ApplicationModal
                isOpen={showApplyModal}
                onClose={() => setShowApplyModal(false)}
                onApply={() => handleApply(jobview.id)}
                job={jobview}
                user={auth.user}
            />
            <ConfirmModal
                show={notification.show}
                type={notification.type}
                message={notification.message}
                onClose={() => setNotification({ show: false, message: '', type: '' })}
            />

        </MainPageLayout>
    );
}
