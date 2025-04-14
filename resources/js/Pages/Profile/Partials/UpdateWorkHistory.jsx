import InputLabel from "@/Components/InputLabel";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import Modal from "@/Components/Modal";
import InputError from "@/Components/InputError";
import { useEffect, useState } from "react";
import { usePage, useForm } from '@inertiajs/react';
import WorkHistoriesCard from "./WorkHistoriesCard";

export default function UpdateWorkHistory({ className }) {
    const { props } = usePage();
    const work_histories = props.work_histories || [];

    const [isModalOpen, setIsModalOpen] = useState(false);

    const months = [
        { name: 'January', value: 1 },
        { name: 'February', value: 2 },
        { name: 'March', value: 3 },
        { name: 'April', value: 4 },
        { name: 'May', value: 5 },
        { name: 'June', value: 6 },
        { name: 'July', value: 7 },
        { name: 'August', value: 8 },
        { name: 'September', value: 9 },
        { name: 'October', value: 10 },
        { name: 'November', value: 11 },
        { name: 'December', value: 12 }
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    const { data, setData, post, processing, errors, reset } = useForm({
        job_title: '',
        job_description: '',
        employer: '',
        start_date: currentYear + '-01-01',
        end_date: currentYear + '-01-01'
    });

    const [startMonth, setStartMonth] = useState("01");
    const [startYear, setStartYear] = useState(currentYear);

    const [endMonth, setEndMonth] = useState("01");
    const [endYear, setEndYear] = useState(currentYear);

    const submit = (e) => {
        e.preventDefault();

        post(route('work_history.store'), {
            preserveScroll: true, // Keeps the page from jumping to the top
            onSuccess: () => {
                setIsModalOpen(false);
                reset('job_title', 'job_description', 'employer', 'start_date', 'end_date');
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
            <div className='grid grid-cols-12 gap-3 mt-3'>
                <div className='col-span-2'>
                    <p className='font-medium'>Job Title</p>
                </div>
                <div className='col-span-3'>
                    <p className='font-medium'>Job Description</p>
                </div>
                <div className='col-span-3'>
                    <p className='font-medium'>Employer</p>
                </div>
                <div className='col-span-2'>
                    <p className='font-medium'>Duration</p>
                </div>
                <div className='col-span-2'>
                </div>
            </div>
            <hr className='w-full mt-3' />
            {
                work_histories.length != 0 ?
                    work_histories.map((work) => (
                        <WorkHistoriesCard
                            key={work.id}
                            id={work.id}
                            job_title={work.job_title}
                            job_description={work.job_description}
                            employer={work.employer}
                            start_date={work.start_date}
                            end_date={work.end_date}
                        />
                    )) : <div className='flex items-center justify-center my-6'> no work history specified </div>
            }
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
                                <select className="col-span-1 border-gray-300 rounded p-2"
                                    value={startMonth}
                                    onChange={(e) => {
                                        const newMonth = e.target.value;  // Capture the new month value
                                        setStartMonth(newMonth);  // Update the month
                                        setData('start_date', `${startYear}-${newMonth.padStart(2, '0')}-01`); // Format the start_date correctly
                                    }}
                                >
                                    {months.map(m => (
                                        <option key={m.value} value={m.value}>
                                            {m.name}
                                        </option>
                                    ))}
                                </select>
                                <select className="col-span-1 border-gray-300 rounded p-2"
                                    value={startYear}
                                    onChange={(e) => {
                                        const newYear = e.target.value;  // Capture the new month value
                                        setStartYear(newYear);
                                        setData('start_date', `${newYear}-${startMonth.padStart(2, '0')}-01`); // Format the start_date correctly
                                    }}
                                >
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
                                <select className="col-span-1 border-gray-300 rounded p-2"
                                    value={endMonth}
                                    onChange={(e) => {
                                        const newMonth = e.target.value;  // Capture the new month value
                                        setEndMonth(newMonth);
                                        setData('end_date', `${endYear}-${newMonth.padStart(2, '0')}-01`); // Format the start_date correctly
                                    }}
                                >
                                    {
                                        months.map(m => (
                                            <option key={m.value} value={m.value}>
                                                {m.name}
                                            </option>
                                        ))
                                    }
                                </select>
                                <select className="col-span-1 border-gray-300 rounded p-2"
                                    value={endYear}
                                    onChange={(e) => {
                                        const newYear = e.target.value;  // Capture the new month value
                                        setEndYear(e.target.value);
                                        setData('end_date', `${newYear}-${endMonth.padStart(2, '0')}-01`); // Format the start_date correctly
                                    }}
                                >
                                    {years.map(y => (
                                        <option key={y} value={String(y)}>
                                            {y}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <InputError message={errors.end_date} className="mt-2" />
                        </div>
                        <input type="hidden" value={data.start_date}></input>
                        <input type="hidden" value={data.end_date}></input>
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
