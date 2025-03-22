import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {

    return (
        <div>
            <p class="text-4xl">OnlyJobs</p>
            <Link href={route('login')} className="text-black"> Log in </Link>
            <Link href={route('register')} className="text-black"> Register</Link>
        </div>

    );

}
