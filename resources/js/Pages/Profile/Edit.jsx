import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import MainPageLayout from '@/Layouts/MainPageLayout';
import ContentLayout from '@/Layouts/ContentLayout';
import { usePage } from '@inertiajs/react';
import UpdateEducation from './Partials/UpdateEducation';
import UpdateWorkHistory from './Partials/UpdateWorkHistory';
import UpdateCertification from './Partials/UpdateCertification';
import UpdateSkills from './Partials/UpdateSkills';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    return (
        <MainPageLayout
            header={
                <ContentLayout>
                    <h2 className="text-3xl font-semibold leading-tight text-gray-800">
                        {auth.user.first_name}'s Profile
                    </h2>
                    <p className='mt-2'>This serves as your resume</p>
                </ContentLayout>
            }
        >
            <Head title="Profile" />

            <div className="pb-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="w-full"
                        />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdateEducation />
                    </div>

                    <div className='bg-white p-4 shadow sm:rounded-lg sm:p-8'>
                        <UpdateWorkHistory />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdateCertification />
                    </div>

                    <div className='bg-white p-4 shadow sm:rounded-lg sm:p-8'>
                        <UpdateSkills />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </MainPageLayout>
    );
}
