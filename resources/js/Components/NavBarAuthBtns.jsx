import { Link, usePage } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import Dropdown from '@/Components/Dropdown';

export default function NavBarAuthBtns() {
    const { auth } = usePage().props;

    console.log("Auth props:", auth); // Debugging

    // Check if `auth` exists and contains a `user`
    const isAuthenticated = auth && auth.user;

    // Logout handler for Inertia
    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route("logout"));
    };

    return (
        <>
            {isAuthenticated ? (
                <div className="flex items-center justify-between">
                    <button>
                        <i class="fa-solid fa-bell text-xl mr-2 text-white hover:text-primary transition"></i>
                    </button>
                    <Dropdown>
                        <Dropdown.Trigger>
                            <span className="inline-flex rounded-md">
                                <button
                                    type="button"
                                    className="inline-flex text-white items-center rounded-md border border-transparent bg-dark px-3 py-2 text-sm font-medium leading-4 transition duration-150 ease-in-out hover:text-primary focus:outline-none"
                                >
                                    {auth.user.first_name}
                                    <svg
                                        className="-me-0.5 ms-2 h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </span>
                        </Dropdown.Trigger>

                        <Dropdown.Content>
                            <Dropdown.Link
                                href={route('profile.edit')}
                            >
                                Profile
                            </Dropdown.Link>
                            <Dropdown.Link
                                href={route('logout')}
                                method="post"
                                as="button"
                            >
                                Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            ) : (
                <>
                    <Link href={route("login")} className="text-white px-4 hover:text-primary transition">
                        Login
                    </Link>
                    <Link href={route("register")} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-light hover:text-dark transition">
                        Sign Up
                    </Link>
                </>
            )}
        </>
    );
}

