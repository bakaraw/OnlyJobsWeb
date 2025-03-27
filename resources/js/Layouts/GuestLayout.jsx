import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children, width }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-light pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                </Link>
            </div>

            <div
                className={`mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:rounded-lg ${width}`}

            //className=`mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-2xl sm:rounded-lg ${}`
            >
                {children}
            </div>
        </div >
    );
}
