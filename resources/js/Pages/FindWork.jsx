import Checkbox from '@/Components/Checkbox';
import JobCard from '@/Components/JobCard';
import PrimaryButton from '@/Components/PrimaryButton';
import ContentLayout from '@/Layouts/ContentLayout';
import MainPageLayout from '@/Layouts/MainPageLayout';
import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import MessageButton from '@/Components/MessageButton';

export default function FindWork() {
    const { jobs } = usePage().props;
    const { filters = {} } = usePage().props;
    const { search } = usePage().props;
    const { auth } = usePage().props;
    const [showMessages, setShowMessages] = useState(false);

    const { data, setData, get } = useForm({
        experience: filters?.experience || [],
        job_type: filters?.job_type || [],
        salary: filters?.salary || { min: '', max: '' },
        location: filters?.location || '', // <-- Add this line
        sort_by: filters?.sort_by || 'newest', // <-- Add this line (default to 'newest')
    });
    const handleSortChange = (event) => {
        setData('sort_by', event.target.value);
    };


    const handleCheckboxChange = (type, value) => {
        const selected = data[type] || [];
        const updated = selected.includes(value)
            ? selected.filter((v) => v !== value)
            : [...selected, value];

        setData(type, updated);
    };

    useEffect(() => {
        get(route('find_work'), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }, [data]);
    console.log(("User: " + auth.user))

    return (
        <MainPageLayout
            header={
                <ContentLayout>
                    <p className="text-3xl">Find the best jobs for you</p>
                    <p className='mt-3'>Browse jobs posted on here or search the job you want</p>
                    {
                        auth.user && auth.user.user_skills.length == 0 ? (
                            <div className='mt-10 bg-yellow-200 p-4 flex items-center justify-between border border-yellow-500 rounded-lg'>
                                <p>Set-up your profile for personalized Job recommendations</p>
                                <Link
                                    className='bg-yellow-500 px-4 py-2 rounded-lg'
                                    href={route("profile.edit")}
                                >Set up profile</Link>
                            </div>
                        ) : <></>

                    }
                </ContentLayout>
            }
        >
            <div className="flex w-full mx-0 px-0">
                {/* Filter section - fixed width on the left */}
                <div className="w-64 flex-none">
                    <div className="bg-light rounded-lg p-4">
                        <div className="font-medium text-md">
                            <div className="flex flex-col space-y-1">
                                <p>Experience Level</p>
                                <Checkbox
                                    label="Entry Level"
                                    className="ml-4"
                                    checked={data.experience.includes(1)}
                                    onChange={() => handleCheckboxChange('experience', 1)}
                                />
                                <Checkbox
                                    label="Intermediate Level"
                                    className="ml-4"
                                    checked={data.experience.includes(3)}
                                    onChange={() => handleCheckboxChange('experience', 3)}

                                />
                                <Checkbox
                                    label="Expert Level"
                                    className="ml-4"
                                    checked={data.experience.includes(5)}
                                    onChange={() => handleCheckboxChange('experience', 5)}

                                />
                                <div>
                                    <p className="mt-4">Job Type</p>
                                </div>

                                <Checkbox
                                    label="Full time"
                                    className="ml-4"
                                    checked={data.job_type.includes('Full Time')}
                                    onChange={() => handleCheckboxChange('job_type', 'Full Time')}
                                />
                                <Checkbox
                                    label="Part time"
                                    className="ml-4"
                                    checked={data.job_type.includes('Part Time')}
                                    onChange={() => handleCheckboxChange('job_type', 'Part Time')}
                                />
                                <Checkbox
                                    label="Contract"
                                    className="ml-4"
                                    checked={data.job_type.includes('Contract')}
                                    onChange={() => handleCheckboxChange('job_type', 'Contract')}
                                />

                                <div className="flex flex-col space-y-2 w-full">
                                    <label className="text-md">Minimum Salary</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="border border-gray-300 rounded px-2 py-1 w-full"
                                        placeholder="e.g. 10000"
                                        value={data.salary.min}
                                        onChange={(e) => setData('salary', { ...data.salary, min: e.target.value })}
                                    />

                                    <label className="text-md">Maximum Salary</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="border border-gray-300 rounded px-2 py-1 w-full"
                                        placeholder="e.g. 50000"
                                        value={data.salary.max}
                                        onChange={(e) => setData('salary', { ...data.salary, max: e.target.value })}
                                    />
                                </div>

                                <div className="flex flex-col space-y-2 w-full mt-4">
                                    <label className="text-md">Location</label>
                                    <input
                                        type="text"
                                        className="border border-gray-300 rounded px-2 py-1 w-full"
                                        placeholder="e.g. Davao City"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col space-y-2 w-full mt-4">
                                    <label className="text-md">Sort by</label>
                                    <select
                                        className='border border-gray-300 rounded px-2 py-1 w-full'
                                        name="sort_by"
                                        value={data.sort_by}
                                        onChange={handleSortChange}
                                    >
                                        <option value="newest">Newest</option>
                                        <option value="oldest">Oldest</option>
                                    </select>
                                </div>

                                {
                                    //<div>
                                    //    <p className="mt-4">Location</p>
                                    //    <select className="border-secondary rounded px-2 py-1 w-full focus:ring-dark focus:border-secondary">
                                    //        <option value="option 1">Option 1</option>
                                    //        <option value="option 2">Option 2</option>
                                    //        <option value="option 3">Option 3</option>
                                    //    </select>
                                    //</div>
                                    //
                                    //<div>
                                    //    <p className="mt-4">Skills</p>
                                    //    <select className="border-secondary rounded px-2 py-1 w-full focus:ring-dark focus:border-secondary">
                                    //        <option value="option 1">Option 1</option>
                                    //        <option value="option 2">Option 2</option>
                                    //        <option value="option 3">Option 3</option>
                                    //    </select>
                                    //</div>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                {/* Job listing section - filling the rest of the width */}
                <div className="flex-1 pl-4">
                    {
                        search && (
                            <div className='pl-6'>
                                <p className='text-xl'>Results for "{search}"</p>
                            </div>

                        )
                    }

                    {jobs && jobs.map((job) => (
                        <div key={job.id} className="mb-4">
                            <JobCard job={job}>
                                <PrimaryButton
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        await axios.post(`/job_posts/${job.id}/increment_views`);
                                        console.log(`View incremented for Job ID: ${job.id}`);
                                        router.visit(route('job.view', job.id));
                                    }}
                                    className="w-full text-sm px-3 py-1"
                                >
                                    View Job
                                </PrimaryButton>
                            </JobCard>
                        </div>
                    ))}

                    <div className="flex items-center justify-center mt-6">
                        <PrimaryButton>
                            Load More Jobs
                        </PrimaryButton>
                    </div>
                </div>
            </div>
            <MessageButton
                show={showMessages}
                onClick={() => setShowMessages(true)}
                onClose={() => setShowMessages(false)}
            />

        </MainPageLayout>
    );
}
