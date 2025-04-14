import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import { router } from "@inertiajs/react";

function formatToMonthYear(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
    });
}

export default function WorkHistoriesCard({
    className,
    id,
    job_title,
    job_description,
    employer,
    start_date,
    end_date
}) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, setData, put, processing, errors, reset } = useForm({
        job_title: job_title,
        job_description: job_description,
        employer: employer,
        start_date: start_date ?? `${new Date().getFullYear()}-01-01`,
        end_date: end_date ?? `${new Date().getFullYear()}-01-01`
    });

    const submit = (e) => {
        e.preventDefault();

        put(route('work_history.update', id), {
            preserveScroll: true, // Keeps the page from jumping to the top
            onSuccess: () => {
                setIsModalOpen(false);
                reset('job_title', 'job_description', 'employer', 'start_date', 'end_date');
            },
        });
    };

    const deleteWorkHistory = () => {
        router.delete(route('work_history.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                console.log("deleted successfully");
            },
            onError: (error) => {
                console.log("An error occur: ", error);
            }
        });
    };


    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

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

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    const [startMonth, setStartMonth] = useState(startDate.getMonth() + 1 + "");
    const [startYear, setStartYear] = useState(startDate.getFullYear() + "");

    const [endMonth, setEndMonth] = useState(endDate.getMonth() + 1 + "");
    const [endYear, setEndYear] = useState(endDate.getFullYear() + "");


    return (
        <>
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
                                        setData('start_date', `${startYear}-${String(newMonth).padStart(2, '0')}-01`); // Format the start_date correctly
                                    }}
                                >
                                    {months.map(m => (
                                        <option key={m.value} value={String(m.value)}>
                                            {m.name}
                                        </option>
                                    ))}
                                </select>
                                <select className="col-span-1 border-gray-300 rounded p-2"
                                    value={startYear}
                                    onChange={(e) => {
                                        const newYear = e.target.value;  // Capture the new month value
                                        setStartYear(newYear);
                                        setData('start_date', `${newYear}-${String(startMonth).padStart(2, '0')}-01`); // Format the start_date correctly
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
                                        setData('end_date', `${endYear}-${String(newMonth).padStart(2, '0')}-01`); // Format the start_date correctly
                                    }}
                                >
                                    {
                                        months.map(m => (
                                            <option key={m.value} value={String(m.value)}>
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
                                        setData('end_date', `${newYear}-${String(endMonth).padStart(2, '0')}-01`); // Format the start_date correctly
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

            <div className={"grid grid-cols-12 gap-3 my-3 mb-3" + className}>
                <div className="col-span-2">
                    {job_title}
                </div>
                <div className="col-span-3">
                    {job_description}
                </div>
                <div className="col-span-3">
                    {employer}
                </div>
                <div className="col-span-2">
                    {formatToMonthYear(start_date)} - {formatToMonthYear(end_date)}
                </div>
                <div className="col-span-2">
                    <div className="flex items-center justify-center">
                        <SecondaryButton onClick={() => setIsModalOpen(true)} className="mr-3">Edit</SecondaryButton>
                        <DangerButton onClick={deleteWorkHistory}>Delete</DangerButton>
                    </div>
                </div>
                <div className="col-span-12">
                    <hr className="block w-full items-center justify-center" />
                </div>

            </div>
        </>
    );

}
