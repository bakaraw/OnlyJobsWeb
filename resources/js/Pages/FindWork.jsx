import Checkbox from '@/Components/Checkbox';
import JobCard from '@/Components/JobCard';
import PrimaryButton from '@/Components/PrimaryButton';
import ContentLayout from '@/Layouts/ContentLayout';
import MainPageLayout from '@/Layouts/MainPageLayout';
import { usePage } from '@inertiajs/react';

export default function FindWork({ auth, laravelVersion, phpVersion }) {
    console.log(usePage().props.auth);
    const jobs = [
        { id: 1, title: "Welder" },
        { id: 2, title: "Pipe Fitter" },
        { id: 3, title: "Electrician" },
        { id: 4, title: "Mechanic" },
        { id: 5, title: "Plumber" },
        { id: 6, title: "Carpenter" }
    ];
    return (
        <MainPageLayout
            header={
                <ContentLayout>
                    <p className="text-3xl">Find the best jobs for you</p>
                    <p className='mt-3'>Browse jobs posted on here or search the job you want</p>
                </ContentLayout>
            }
        >
            <div className='grid grid-cols-4 gap-3'>
                {/* Filter section on the left side */}
                <div className='col-span-1 rounded-lg'>
                    <div className='px-6 py-4 font-medium bg-light text-md min-h-[500px]'>
                        <div className='flex flex-col space-y-1'>
                            <p>Experience Level</p>
                            <Checkbox label="Entry Level" className='ml-4' />
                            <Checkbox label="Intermediate Level" className='ml-4' />
                            <Checkbox label="Expert Level" className='ml-4' />
                            <div className='flex items-center'>
                                <Checkbox className='ml-4 mt-1' />
                                <input
                                    type="text"
                                    placeholder="Years of Experience"
                                    className="mt-1 border-secondary rounded px-2 py-1 focus:ring-secondary focus:border-secondary"
                                />
                            </div>
                            <div>
                                <p className='mt-4'>Job Type</p>
                            </div>
                            <Checkbox label="Full time" className='ml-4' />
                            <Checkbox label="Part time" className='ml-4' />
                            <Checkbox label="Contractual" className='ml-4' />

                            <div>
                                <p className='mt-4'>Location</p>
                                <select className='border-secondary rounded px-2 py-1 w-64 focus:ring-dark focus:border-secondary'>
                                    <option value="option 1">Option 1</option>
                                    <option value="option 2">Option 2</option>
                                    <option value="option 3">Option 3</option>
                                </select>
                            </div>

                            <div>
                                <p className='mt-4'>Skills</p>
                                <select className='border-secondary rounded px-2 py-1 w-64 focus:ring-dark focus:border-secondary'>
                                    <option value="option 1">Option 1</option>
                                    <option value="option 2">Option 2</option>
                                    <option value="option 3">Option 3</option>
                                </select>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Job listing section */}
                <div className='col-span-3 rounded-lg'>
                    {
                        jobs.map((job, index) => (
                            <JobCard jobId={job.id} />
                        ))
                    }
                    <div className='flex items-center justify-center'>
                        <PrimaryButton href={route('login')}>Load More Jobs hehe</PrimaryButton>
                    </div>
                </div>
            </div>
        </MainPageLayout>
    );

}
