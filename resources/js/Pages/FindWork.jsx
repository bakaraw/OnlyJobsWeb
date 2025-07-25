import Checkbox from '@/Components/Checkbox';
import JobCard from '@/Components/JobCard';
import PrimaryButton from '@/Components/PrimaryButton';
import ContentLayout from '@/Layouts/ContentLayout';
import MainPageLayout from '@/Layouts/MainPageLayout';
import MessageButton from '@/Components/MessageButton';

import { usePage, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import axios from 'axios';

export default function FindWork() {
    const { jobs: initialJobs, filters = {}, search, auth, hasMore, currentPage } = usePage().props;

    const [jobList, setJobList] = useState(initialJobs);
    const [nextPage, setNextPage] = useState(hasMore ? currentPage + 1 : null);
    const [showMessages, setShowMessages] = useState(false);
    const [loading, setLoading] = useState(false);

    const { data, setData, get } = useForm({
        experience: filters?.experience || [],
        job_type: filters?.job_type || [],
        search: search || '',
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
        setLoading(true);
        get(route('find_work'), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onSuccess: (page) => {
                const newJobs = Array.isArray(page.props.jobs) ? page.props.jobs : [];
                setJobList(newJobs);
                setNextPage(page.props.hasMore ? page.props.currentPage + 1 : null);
                setLoading(false);
            },
        });
    }, [data]);

    const loadMore = async () => {
        if (!nextPage) return;

        try {
            const response = await axios.get(route('find_work', { page: nextPage }));
            const newJobs = response.data?.jobs || [];
            const hasNext = response.data?.links?.next !== null;
            console.log("New Jobs: ", newJobs);

            setJobList(prev => [...prev, ...newJobs]);
            setNextPage(hasNext ? nextPage + 1 : null);
        } catch (error) {
            console.error("Error loading more jobs:", error);
        }
    };

    return (
        <MainPageLayout
            header={
                <ContentLayout>
                    <p className="text-3xl">Find the best jobs for you</p>
                    <p className='mt-3'>Browse jobs posted on here or search the job you want</p>
                    {
                        auth.user && auth.user.user_skills.length === 0 && (
                            <div className='mt-10 bg-yellow-200 p-4 flex items-center justify-between border border-yellow-500 rounded-lg'>
                                <p>Set up your profile for personalized Job recommendations</p>
                                <Link
                                    className='bg-yellow-500 px-4 py-2 rounded-lg'
                                    href={route("profile.edit")}
                                >Set up profile</Link>
                            </div>
                        )
                    }
                </ContentLayout>
            }
        >
            <div className="flex flex-col md:flex-row w-full mx-0 px-0">
                {/* Filter section */}
                <div className="w-full md:w-64 flex-none hidden md:block">
                    <div className="bg-light rounded-lg p-4">
                        <div className="font-medium text-md flex flex-col space-y-1">
                            <p>Experience Level</p>
                            <Checkbox label="Entry Level" className="ml-4"
                                checked={data.experience.includes(1)}
                                onChange={() => handleCheckboxChange('experience', 1)} />
                            <Checkbox label="Intermediate Level" className="ml-4"
                                checked={data.experience.includes(3)}
                                onChange={() => handleCheckboxChange('experience', 3)} />
                            <Checkbox label="Expert Level" className="ml-4"
                                checked={data.experience.includes(5)}
                                onChange={() => handleCheckboxChange('experience', 5)} />
                            <p className="mt-4">Job Type</p>
                            <Checkbox label="Full time" className="ml-4"
                                checked={data.job_type.includes('Full Time')}
                                onChange={() => handleCheckboxChange('job_type', 'Full Time')} />
                            <Checkbox label="Part time" className="ml-4"
                                checked={data.job_type.includes('Part Time')}
                                onChange={() => handleCheckboxChange('job_type', 'Part Time')} />
                            <Checkbox label="Contract" className="ml-4"
                                checked={data.job_type.includes('Contract')}
                                onChange={() => handleCheckboxChange('job_type', 'Contract')} />
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
                        </div >
                    </div >
                </div >

                {/* Job listing */}
                <div className="flex-1 md:pl-4 px-4" >
                    {search && (
                        <div className='pl-6'>
                            <p className='text-xl'>Results for "{search}"</p>
                        </div>
                    )}

                    {loading === false ? (
                        jobList.length > 0 ? jobList.map((job) => (
                            <div key={job.id} className="mb-4">
                                <JobCard job={job}>
                                    <PrimaryButton
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            await axios.post(`/job_posts/${job.id}/increment_views`);
                                            router.visit(route('job.view', job.id));
                                        }}
                                        className="w-full text-sm px-3 py-1"
                                    >
                                        View Job
                                    </PrimaryButton>
                                </JobCard>
                            </div>
                        )) : (
                            <div className='flex items-center justify-center mt-44'>
                                <p className='text-lg font-medium text-gray-600'>No jobs found</p>
                            </div>
                        )
                    ) : (
                        <div className='flex items-center justify-center mt-44'>
                            <div className="w-6 h-6 mr-3 border-4 border-t-transparent border-dark border-solid rounded-full animate-spin"></div>
                        </div>
                    )}
                    {
                        !loading && nextPage && (
                            <div className="flex items-center justify-center mt-6">
                                <PrimaryButton onClick={loadMore}>
                                    Load More Jobs
                                </PrimaryButton>
                            </div>
                        )
                    }
                </div >
            </div >

            <MessageButton
                show={showMessages}
                onClick={() => setShowMessages(true)}
                onClose={() => setShowMessages(false)}
            />
        </MainPageLayout >
    );
}

