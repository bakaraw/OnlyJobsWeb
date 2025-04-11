import InputLabel from "@/Components/InputLabel";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import Modal from "@/Components/Modal";
import InputError from "@/Components/InputError";
import { useState } from "react";
import { useForm } from "@inertiajs/inertia-react";

export default function UpdateWorkHistory({ className }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'October',
        'November',
        'December'
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    const { data, setData, post, processing, errors, reset } = useForm({
        job_title: '',
        job_description: '',
        employer: '',
        start_date: '',
        end_date: ''
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('work_history.store'), {
            preserveScroll: true, // Keeps the page from jumping to the top
            onSuccess: () => {
                setIsModalOpen(false);
                reset('job_title', 'job_description', 'employer');
            },
        });
    };

    return (
        <section className={"" + className}>
            <header>
                <div className='flex items-center justify-between'>
                    <div className='w-full'>
                        <h2 className="text-lg font-medium text-gray-900">
                            Work History
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Add work history
                        </p>
                    </div>
                    <div className='flex items-center justify-end w-full'>
                        <SecondaryButton onClick={() => setIsModalOpen(true)} className=''>
                            Add
                        </SecondaryButton>
                    </div>
                </div>
                <hr className="mt-5 block w-full items-center justify-center" />
            </header>
            <div>
            </div>
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
                <div className="font-semibold text-xl flex justify-between">
                    <p>Add Work History</p>
                    <button onClick={() => setIsModalOpen(false)}>
                        <i className="fa-solid fa-xmark text-gray-400"></i>
                    </button>
                </div>
                <form className="mt-4 space-y-6" onSubmit={submit}>
                    <div className="">
                        <InputLabel value="Job Title" />
                        <TextInput
                            value={data.job_title}
                            onChange={(e) => setData('job_title', e.target.value)}
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.job_title} className="mt-2" />
                    </div>
                    <div className="w-full">
                        <InputLabel value="Job Description" />
                        <textarea
                            value={data.job_description}
                            onChange={(e) => setData('job_description', e.target.value)}
                            className="resize-y rounded-md border border-gray-300 p-2 w-full min-h-[100px]"
                        />
                        <InputError message={errors.job_description} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel value="Employer" />
                        <TextInput
                            value={data.employer}
                            onChange={(e) => setData('employer', e.target.value)}
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.employer} className="mt-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <div className="col-span-1">
                            <InputLabel value="Month Started" />
                            <div className="grid grid-cols-2 gap-3">
                                <select className="col-span-1 border-gray-300 rounded p-2">
                                    {
                                        months.map(m => (
                                            <option key={m} value={String(m)}>
                                                {m}
                                            </option>
                                        ))
                                    }
                                </select>
                                <select className="col-span-1 border-gray-300 rounded p-2">
                                    {years.map(y => (
                                        <option key={y} value={String(y)}>
                                            {y}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <InputError message={errors.start_date} className="mt-2" />
                        </div>
                        <div className="col-span-1">
                            <InputLabel value="Month Ended" />
                            <div className="grid grid-cols-2 gap-3">
                                <select className="col-span-1 border-gray-300 rounded p-2">
                                    {
                                        months.map(m => (
                                            <option key={m} value={String(m)}>
                                                {m}
                                            </option>
                                        ))
                                    }
                                </select>
                                <select className="col-span-1 border-gray-300 rounded p-2">
                                    {years.map(y => (
                                        <option key={y} value={String(y)}>
                                            {y}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <InputError message={errors.end_date} className="mt-2" />
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <SecondaryButton type="submit">
                            Save
                        </SecondaryButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
