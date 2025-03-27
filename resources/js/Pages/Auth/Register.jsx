import BirthdayInput from '@/Components/BirthdayInput';
import GenderSelection from '@/Components/GenderSelection';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        account_type: 'jobseeker', // Default value
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
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
                    <div className='col-span-2'>
                        <TextInput
                            id="name"
                            name="name"
                            placeholder="First Name"
                            value={data.name}
                            className="mt-1 block w-full"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                    </div>
                    <div className='col-span-2'>
                        <TextInput
                            id="name"
                            name="name"
                            placeholder="Last Name"
                            value={data.name}
                            className="mt-1 block w-full"
                            autoComplete="name"
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                    </div>
                    <div className='col-span-1'>
                        <TextInput
                            id="name"
                            name="name"
                            placeholder="Middle"
                            value={data.name}
                            className="mt-1 block w-full"
                            autoComplete="name"
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                    </div>
                    <div className='col-span-1'>
                        <TextInput
                            id="name"
                            name="name"
                            placeholder="Suffix"
                            value={data.name}
                            className="mt-1 block w-full"
                            autoComplete="name"
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.name} className="mt-2" />
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
                                required
                            />
                        </div>
                        <div className='col-span-3'>
                            <InputLabel htmlFor="contact_number" value="Contact Number" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                placeholder="09123456789"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <InputError message={errors.email} className="mt-2" />
                </div>
                <div className='mt-4'>
                    <div className='grid grid-cols-6 gap-3'>
                        <div className='col-span-3 justify-center items-center'>
                            <InputLabel htmlFor="birth_date" value="Birth Day" />
                            <BirthdayInput />
                        </div>
                        <div className='col-span-3 h-full'>
                            <InputLabel htmlFor="gender" value="Gender" />
                            <GenderSelection />
                        </div>
                    </div>
                </div>

                <div className='mt-4'>
                    <InputLabel htmlFor="address" value="Address" />
                    <div className='grid grid-cols-2 gap-3'>
                        <div className='col-span-1'>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Street Address"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                        </div>
                        <div className='col-span-1'>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Street Address Line 2"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className='mt-3 grid grid-cols-9 gap-3'>
                    <div className='col-span-3'>
                        <div className='col-span-1'>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                placeholder="City"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className='col-span-3'>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            placeholder="State/Province"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                    </div>
                    <div className='col-span-3'>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Postal Code"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className='w-full mt-3'>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Country"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                </div>

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
                        required
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
                        required
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
