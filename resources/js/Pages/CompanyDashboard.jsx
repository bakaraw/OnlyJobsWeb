import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';

export default function CompanyDashboard({ auth }) {
    if (!auth || !auth.user) {
        return <p>Loading or Unauthorized...</p>;
    }

    return (
        <div>

            <AuthenticatedLayout>
                <Head title="Company Dashboard" />
                <div>
                    <h1>Welcome, {auth.user.first_name}</h1>
                    <p>Your account type: Company</p>
                    <p>Here you can post jobs and manage applicants.</p>
                </div>
            </AuthenticatedLayout>
        </div>
    );
}
