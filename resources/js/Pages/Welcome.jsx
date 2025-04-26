import PrimaryButton from '@/Components/PrimaryButton';
import MainPageLayout from '@/Layouts/MainPageLayout';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <MainPageLayout />

            <div className='w-full h-[720px] bg-dark'>
                <div className='h-full w-full flex items-center justify-center'>
                    <div className='flex items-center justify-between gap-48'>

                        <div className="flex items-start justify-start flex-col opacity-0 translate-y-4 animate-fade-in-up">
                            <p className='text-4xl font-black text-light'>Find your job with ease</p>
                            <div className='text-light mt-4 w-[500px]'>
                                <p>
                                    Skip the stress. Our smart-matching platform connects you with jobs that truly fit you — fast, easy, and personalized. Whether you're a fresh grad or a seasoned pro, finding the right job starts here.
                                </p>
                            </div>
                            <Link href={route('find_work')}>
                                <PrimaryButton className='mt-10 px-8'>
                                    Get Started!
                                </PrimaryButton>
                            </Link>
                        </div>

                        <div className="w-[480px] h-auto flex items-center justify-center">
                            <img
                                src="/images/OnlyJobs-art.png"
                                className="opacity-0 translate-y-4 animate-fade-in-up [animation-delay:200ms]"
                            />
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

