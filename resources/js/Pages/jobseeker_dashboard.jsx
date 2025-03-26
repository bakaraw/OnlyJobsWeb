import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';

export default function Jobseeker_dashboard({ auth }) {
    if (!auth || !auth.user) {
        return <p>Loading or Unauthorized...</p>;
    }

    return (
        <div>


            <AuthenticatedLayout>
                <Head title="Job Seeker Dashboard" />
                <div>
                    <h1>Welcome, {auth.user.name}</h1>
                    <p>Your account type: Job Seeker</p>
                    <p>Here you can find job listings and manage your applications.</p>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}
