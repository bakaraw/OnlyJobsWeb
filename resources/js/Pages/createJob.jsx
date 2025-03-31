import BirthdayInput from '@/Components/BirthdayInput';
import GenderSelection from '@/Components/GenderSelection';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function CreateJob() {
    const { data, setData, post, processing, errors, reset } = useForm({
            job_title: '',
            job_description: '',
            job_location: '',
            job_type: '',
            min_salary: '',
            max_salary: '',
            min_experience_years: '',
            status_id: '',
            degree_id: '',
            certificate_id: '',
            skills: '',
            company: '',
            user_id: '',
        });

    const submit = (e) => {
        e.preventDefault();
        console.log("Submitting data:", data);

        post(route('create'), {
            onFinish: () => {
                console.log(errors);
            },
        });

    };

    return (
        <GuestLayout width="sm:max-w-2xl">
            <Head title="Create Job" />
            <div className='mt-6 text-primary text-4xl font-bold mb-6'>
                Create Job
            </div>

            <form onSubmit={submit}>
                <InputLabel htmlFor="name" value="Job Title" />
                <div className='w-full mt-3'>
                    <div className='col-span-2 flex flex-col'>
                        <TextInput
                            id="job_title"
                            name="job_title"
                            placeholder="Job Title"
                            value={data.job_title}
                            className="mt-1 block w-full"
                            autoComplete="job_title"
                            isFocused={true}
                            onChange={(e) => setData('job_title', e.target.value)}
                        />
                        <br/>
                        <InputError message={errors.job_title} className="mt-2" />
                    </div>


                    <div className='col-span-2 flex flex-col'>
                        <TextInput
                            id="job_description"
                            name="job_description"
                            placeholder="Job Description"
                            value={data.job_description}
                            className="mt-1 block w-full"
                            autoComplete="job_description"
                            onChange={(e) => setData('job_description', e.target.value)}
                        />
                        <br/>
                        <InputError message={errors.job_description} className="mt-2" />
                    </div>
                    <div className='col-span-1'>
                        <TextInput
                            id="job_location"
                            name="job_location"
                            placeholder="Location"
                            value={data.job_location}
                            className="mt-1 block w-full"
                            autoComplete="job_locatione"
                            onChange={(e) => setData('job_location', e.target.value)}
                        />
                        <br/>
                    </div>

                </div>

                <div className="mt-4">
                    <div className='grid grid-cols-6 gap-3'>
                        <div className='col-span-3'>
                            <InputLabel htmlFor="job_type" value="Type" />
                            <TextInput
                                id="job_type"
                                type="job_type"
                                name="job_type"
                                placeholder="Fulltime"
                                value={data.job_type}
                                className="mt-1 block w-full"
                                autoComplete="job_type"
                                onChange={(e) => setData('job_type', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                    </div>


                </div>

                <div className='mt-4'>
                    <div className='grid grid-cols-6 gap-3'>
                        <div className='col-span-3 justify-center items-center'>
                            <InputLabel htmlFor="job_type" value="Job Type" />
                            <BirthdayInput value={data.job_type} onChange={(newJob) => setData('job_type', newJob)} />
                            <InputError message={errors.job_type} className="mt-2" />
                        </div>
                        <div className='col-span-3 h-full'>
                            <InputLabel htmlFor="gender" value="Gender" />
                            <GenderSelection value={data.gender} onChange={(newGender) => setData('gender', newGender)} />
                            <InputError message={errors.gender} className="mt-2" />
                        </div>
                    </div>
                </div>

                <div className='



                <div className='mt-4'>
                    <InputLabel htmlFor="address" value="Address" />
                    <div className='grid grid-cols-2 gap-3'>
                        <div className='col-span-1'>
                            <TextInput
                                id="street"
                                name="street"
                                placeholder="Street Address"
                                value={data.street}
                                className="mt-1 block w-full"
                                autoComplete="street"
                                onChange={(e) => setData('street', e.target.value)}
                            />
                            <InputError message={errors.street} className="mt-2" />
                        </div>
                        <div className='col-span-1'>
                            <TextInput
                                id="street2"
                                name="street2"
                                placeholder="Street Address Line 2"
                                value={data.street2}
                                className="mt-1 block w-full"
                                autoComplete="street2"
                                onChange={(e) => setData('street2', e.target.value)}
                            />
                            <InputError message={errors.street2} className="mt-2" />
                        </div>
                    </div>
                </div>

                <div className='mt-3 grid grid-cols-9 gap-3'>
                    <div className='col-span-3'>
                        <div className='col-span-1'>
                            <TextInput
                                id="city"
                                name="city"
                                placeholder="City"
                                value={data.city}
                                className="mt-1 block w-full"
                                autoComplete="city"
                                onChange={(e) => setData('city', e.target.value)}
                            />
                            <InputError message={errors.city} className="mt-2" />
                        </div>
                    </div>
                    <div className='col-span-3'>
                        <TextInput
                            id="province"
                            name="province"
                            placeholder="State/Province"
                            value={data.province}
                            className="mt-1 block w-full"
                            autoComplete="province"
                            onChange={(e) => setData('province', e.target.value)}
                        />
                        <InputError message={errors.province} className="mt-2" />
                    </div>
                    <div className='col-span-3'>
                        <TextInput
                            id="postal_code"
                            name="postal_code"
                            placeholder="Postal Code"
                            value={data.postal_code}
                            className="mt-1 block w-full"
                            autoComplete="postal_code"
                            onChange={(e) => setData('postal_code', e.target.value)}
                        />
                        <InputError message={errors.postal_code} className="mt-2" />
                    </div>
                </div>

                <div className='w-full mt-3'>
                    <TextInput
                        id="country"
                        name="country"
                        placeholder="Country"
                        value={data.country}
                        className="mt-1 block w-full"
                        autoComplete="country"
                        onChange={(e) => setData('country', e.target.value)}
                    />
                    <InputError message={errors.country} className="mt-2" />
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
