import AddressForm from '@/Components/AddressForm';
import BirthdayInput from '@/Components/BirthdayInput';
import GenderSelection from '@/Components/GenderSelection';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        middle_name: '',
        suffix: '',
        birthdate: '',
        gender: '',
        email: '',
        contact_number: '',
        street: '',
        street2: '',
        city: '',
        province: '',
        postal_code: '',
        country: '',
        password: '',
        password_confirmation: ''
    });

    const submit = (e) => {
        e.preventDefault();
        console.log("Submitting data:", data);

        post(route('register'), {
            onFinish: () => {
                reset('password', 'password_confirmation');
                console.log(errors);
            },
        });

    };

    return (
        <GuestLayout width="sm:max-w-2xl">
            <Head title="Register" />
            <div className='mt-6 text-primary text-4xl font-bold mb-6'>
                Sign up
            </div>

            <form onSubmit={submit}>
                <InputLabel htmlFor="name" value="Name" />
                <div className='grid grid-cols-6 gap-3'>
                    <div className='col-span-2 flex flex-col'>
                        <TextInput
                            id="first_name"
                            name="first_name"
                            placeholder="First Name"
                            value={data.first_name}
                            className="mt-1 block w-full"
                            autoComplete="first_name"
                            isFocused={true}
                            onChange={(e) => setData('first_name', e.target.value)}
                        />
                        <InputError message={errors.first_name} className="mt-2" />
                    </div>
                    <div className='col-span-2 flex flex-col'>
                        <TextInput
                            id="last_name"
                            name="last_name"
                            placeholder="Last Name"
                            value={data.last_name}
                            className="mt-1 block w-full"
                            autoComplete="last_name"
                            onChange={(e) => setData('last_name', e.target.value)}
                        />
                        <InputError message={errors.last_name} className="mt-2" />
                    </div>
                    <div className='col-span-1'>
                        <TextInput
                            id="middle_name"
                            name="middle_name"
                            placeholder="Middle"
                            value={data.middle_name}
                            className="mt-1 block w-full"
                            autoComplete="middle_name"
                            onChange={(e) => setData('middle_name', e.target.value)}
                        />
                    </div>
                    <div className='col-span-1'>
                        <TextInput
                            id="suffix"
                            name="suffix"
                            placeholder="Suffix"
                            value={data.suffix}
                            className="mt-1 block w-full"
                            autoComplete="suffix"
                            onChange={(e) => setData('suffix', e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <div className='grid grid-cols-6 gap-3'>
                        <div className='col-span-3'>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                placeholder="example@gmail.com"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>
                        <div className='col-span-3'>
                            <InputLabel htmlFor="contact_number" value="Contact Number" />
                            <TextInput
                                id="contact_number"
                                name="contact_number"
                                placeholder="09123456789"
                                value={data.contact_number}
                                className="mt-1 block w-full"
                                autoComplete="tel"
                                onChange={(e) => setData('contact_number', e.target.value)}
                            />
                            <InputError message={errors.contact_number} className="mt-2" />
                        </div>
                    </div>

                </div>
                <div className='mt-4'>
                    <div className='grid grid-cols-6 gap-3'>
                        <div className='col-span-3 justify-center items-center'>
                            <InputLabel htmlFor="birth_date" value="Birth Day" />
                            <BirthdayInput value={data.birthdate} onChange={(newDate) => setData('birthdate', newDate)} />
                            <InputError message={errors.birthdate} className="mt-2" />
                        </div>
                        <div className='col-span-3 h-full'>
                            <InputLabel htmlFor="gender" value="Gender" />
                            <GenderSelection value={data.gender} onChange={(newGender) => setData('gender', newGender)} />
                            <InputError message={errors.gender} className="mt-2" />
                        </div>
                    </div>
                </div>

                <AddressForm data={data} setData={setData} errors={errors} />

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
