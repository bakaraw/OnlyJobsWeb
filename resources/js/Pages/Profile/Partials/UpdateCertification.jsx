import SecondaryButton from "@/Components/SecondaryButton";
import { useState } from "react";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import { useForm, usePage } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import FileInput from "@/Components/FileInput";
import PrimaryButton from "@/Components/PrimaryButton";
import CertificationCard from "./CertificationCard";

export default function UpdateCertification({ className }) {
    const { props } = usePage();
    const certifications = props.certifications || [];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        year: currentYear,
        attached_file: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('certification.store'), {
            preserveScroll: true, // Keeps the page from jumping to the top
            onSuccess: () => {
                setIsModalOpen(false);
                reset('title', 'description', 'year', 'file');
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <div className='flex items-center justify-between'>
                    <div className='w-full'>
                        <h2 className="text-lg font-medium text-gray-900">
                            Certification
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Update your certification
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
                <div className='col-span-4'>
                    <p className='font-medium'>Title</p>
                </div>
                <div className='col-span-4'>
                    <p className='font-medium'>Description</p>
                </div>
                <div className='col-span-2'>
                    <p className='font-medium'>Year</p>
                </div>
                <div className='col-span-2'>
                </div>
            </div>
            <hr className='w-full mt-3' />
            {
                certifications.length != 0 ?
                    certifications.map((cert) => (
                        <CertificationCard
                            key={cert.id}
                            id={cert.id}
                            title={cert.title}
                            description={cert.description}
                            year={cert.year}
                            file_url={cert.file_url}
                        />
                    )) : <div className='flex items-center justify-center my-6'> no education specified </div>

            }

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth='2xl'>
                <div className='font-semibold text-xl flex justify-between'>
                    <p>Enter Certification Information</p>
                    <button onClick={() => setIsModalOpen(false)}>
                        <i className="fa-solid fa-xmark text-gray-400"></i>
                    </button>
                </div>
                <form className="mt-4 space-y-6" onSubmit={submit}>
                    <div className="grid grid-cols-4 gap-3">
                        <div className="col-span-3">
                            <InputLabel htmlFor="wow" value="Title" />
                            <TextInput
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="mt-1 block w-full"
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>
                        <div className="col-span-1 w-full">
                            <InputLabel value="Year" />
                            <select
                                className="border-gray-300 rounded p-2 w-full"
                                value={data.year}
                                onChange={(e) => setData('year', e.target.value)}
                            >
                                {
                                    years.map(y => (
                                        <option key={y} value={String(y)}>
                                            {y}
                                        </option>
                                    ))
                                }
                            </select>
                            <InputError message={errors.year} />
                        </div>
                    </div>
                    <div className="w-full">
                        <InputLabel value="Description" />
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="resize-y rounded-md border border-gray-300 p-2 w-full min-h-[100px]"
                        >
                        </textarea>
                        <InputError message={errors.description} />
                    </div>
                    <div>
                        <InputLabel value="Attach File" />
                        <FileInput onFileSelect={(file) => setData('attached_file', file)} />
                    </div>
                    <div className="flex items-center justify-center">
                        <PrimaryButton type='submit' disabled={processing}>
                            Add
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </section >
    );

}
