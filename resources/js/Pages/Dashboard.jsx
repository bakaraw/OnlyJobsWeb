import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    if (!auth || !auth.user) {
        return <p>Loading or Unauthorized...</p>;
    }

    return (
        <div>
            <h1>Welcome, {auth.user.name}</h1>
            <p>Your account type: {auth.user.account_type}</p>
        </div>
    );
}
