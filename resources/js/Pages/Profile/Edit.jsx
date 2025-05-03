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
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [preview, setPreview] = useState(user.profile_pic_url || null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append('profile_picture', file);

        router.post(route('profile.picture.update'), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => console.log('Profile picture updated.'),
            onError: (errors) => console.error('Upload error:', errors),
        });
    };

    return (
        <MainPageLayout
            header={
                <ContentLayout>
                    <div className='flex items-center justify-start gap-3'>
                        <div className="relative group w-24 h-24">
                            <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-300 ring-2 ring-white">
                                <img
                                    src={preview || 'images/default-profile.webp'}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => document.getElementById('profileImageInput').click()}
                                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                            >
                                ✎
                            </button>

                            <input
                                type="file"
                                id="profileImageInput"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className='ml-4'>
                            <h2 className="text-3xl font-semibold leading-tight text-gray-800">
                                {auth.user.first_name}'s Profile
                            </h2>
                            <p className='mt-2'>This serves as your resume</p>
                        </div>
                    </div>
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
            <input
                type="file"
                id="profileImageInput"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                        // You can preview it or upload it here
                        console.log("Selected file:", file);
                        // Example: use FileReader or upload to server
                    }
                }}
            />
        </MainPageLayout>
    );
}
