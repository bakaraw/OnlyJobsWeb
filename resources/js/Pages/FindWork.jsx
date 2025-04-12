import Checkbox from '@/Components/Checkbox';
import JobCard from '@/Components/JobCard';
import PrimaryButton from '@/Components/PrimaryButton';
import ContentLayout from '@/Layouts/ContentLayout';
import MainPageLayout from '@/Layouts/MainPageLayout';
import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import axios from 'axios';

export default function FindWork({ auth, laravelVersion, phpVersion }) {
    const { jobs } = usePage().props;

    return (
        <MainPageLayout
            header={
                <ContentLayout>
                    <p className="text-3xl">Find the best jobs for you</p>
                    <p className='mt-3'>Browse jobs posted on here or search the job you want</p>
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
                                <Checkbox label="Entry Level" className="ml-4" />
                                <Checkbox label="Intermediate Level" className="ml-4" />
                                <Checkbox label="Expert Level" className="ml-4" />
                                <div className="flex items-center">
                                    <Checkbox className="ml-4 mt-1" />
                                    <input
                                        type="text"
                                        placeholder="Years of Experience"
                                        className="mt-1 border-secondary rounded px-2 py-1 focus:ring-secondary focus:border-secondary"
                                    />
                                </div>
                                <div>
                                    <p className="mt-4">Job Type</p>
                                </div>
                                <Checkbox label="Full time" className="ml-4" />
                                <Checkbox label="Part time" className="ml-4" />
                                <Checkbox label="Contractual" className="ml-4" />

                                <div>
                                    <p className="mt-4">Location</p>
                                    <select className="border-secondary rounded px-2 py-1 w-full focus:ring-dark focus:border-secondary">
                                        <option value="option 1">Option 1</option>
                                        <option value="option 2">Option 2</option>
                                        <option value="option 3">Option 3</option>
                                    </select>
                                </div>

                                <div>
                                    <p className="mt-4">Skills</p>
                                    <select className="border-secondary rounded px-2 py-1 w-full focus:ring-dark focus:border-secondary">
                                        <option value="option 1">Option 1</option>
                                        <option value="option 2">Option 2</option>
                                        <option value="option 3">Option 3</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Job listing section - filling the rest of the width */}
                <div className="flex-1 pl-4">
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
        </MainPageLayout>
    );
}
