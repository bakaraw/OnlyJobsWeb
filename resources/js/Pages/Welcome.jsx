import MainPageLayout from '@/Layouts/MainPageLayout';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {

    return (
        <MainPageLayout
            header={
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <p class="text-3xl">Find the best jobs for you</p>
                    <p className='mt-3'>Browse suggested jobs here or search it up</p>
                </div>
            }
        >
        </MainPageLayout>
    );

}
