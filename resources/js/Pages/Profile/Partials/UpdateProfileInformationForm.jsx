import AddressForm from '@/Components/AddressForm';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            first_name: user.first_name,
            last_name: user.last_name,
            middle_name: user.middle_name,
            suffix: user.suffix,
            email: user.email,
            contact_number: user.contact_number,
            street: user.address?.street || '',  // Fetch from address
            street2: user.address?.street2 || '',
            city: user.address?.city || '',
            province: user.address?.province || '',
            postal_code: user.address?.postal_code || '',
            country: user.address?.country || ''
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    console.log("Edit User: ", data);
    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div className='grid grid-cols-10 gap-3'>
                    <div className='col-span-3'>
                        <InputLabel htmlFor="first_name" value="First Name" />

                        <TextInput
                            id="first_name"
                            className="mt-1 block w-full"
                            value={data.first_name}
                            onChange={(e) => setData('first_name', e.target.value)}
                            required
                            isFocused
                            autoComplete="first_name"
                        />

                        <InputError className="mt-2" message={errors.first_name} />
                    </div>
                    <div className='col-span-3'>
                        <InputLabel htmlFor="last_name" value="Last Name" />
                        <TextInput
                            id="last_name"
                            className="mt-1 block w-full"
                            value={data.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                            required
                            autoComplete="last_name"
                        />

                    </div>
                    <div className='col-span-2'>
                        <InputLabel htmlFor="middle_name" value="Middle Name" />
                        <TextInput
                            id="middle_name"
                            className="mt-1 block w-full"
                            value={data.middle_name}
                            onChange={(e) => setData('middle_name', e.target.value)}
                            autoComplete="middle_name"
                        />
                    </div>
                    <div className='col-span-2'>
                        <InputLabel htmlFor="suffix" value="Suffix" />
                        <TextInput
                            id="suffix"
                            className="mt-1 block w-full"
                            value={data.suffix}
                            onChange={(e) => setData('suffix', e.target.value)}
                            autoComplete="suffix"
                        />
                    </div>
                </div>

                <div className='grid grid-cols-2 gap-3'>
                    <div className='col-span-1'>
                        <InputLabel htmlFor="email" value="Email" />

                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                        />

                        <InputError className="mt-2" message={errors.email} />

                    </div>
                    <div className='col-span-1'>
                        <InputLabel htmlFor="tel" value="Contact Number" />
                        <TextInput
                            id="contact_number"
                            className="mt-1 block w-full"
                            value={data.contact_number}
                            onChange={(e) => setData('contact_number', e.target.value)}
                            required
                            autoComplete="tel"
                        />
                        <InputError className="mt-2" message={errors.contact_number} />
                    </div>
                </div>

                <AddressForm data={data} setData={setData} errors={errors} />

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
