import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { useState } from "react";
import { useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import FileInput from "@/Components/FileInput";
import PrimaryButton from "@/Components/PrimaryButton";

export default function CertificationCard({
    className,
    id,
    title,
    description,
    year,
    file_url
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: title,
        description: description,
        year: year
    });

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileUpload = (file) => {
        setSelectedFile(file);
        console.log("Selected file:", file);
    };

    const submit = () => {

    };

    return (
        <div className="mt-3">
            < Modal show={isModalOpen} onClose={() => setIsModalOpen(false)
            } maxWidth="2xl" >
                <div className="font-semibold text-xl flex justify-between">
                    <p>Add Certification</p>
                    <button onClick={() => setIsModalOpen(false)}>
                        <i className="fa-solid fa-xmark text-gray-400"></i>
                    </button>
                </div>
                <form className="w-full mt-4 space-y-6" onSubmit={submit}>
                    <div className="">
                        <InputLabel value="Title" />
                        <TextInput
                            value={data.title}
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel value="Description" />
                        <textarea
                            value={data.description}
                            className="resize-y rounded-md border border-gray-300 p-2 w-full min-h-[100px]"
                        />
                        <InputError message={errors.description} className="mt-2" />
                    </div>
                    <div className="w-full mt-3">
                        <InputLabel htmlFor="wow" value="Attach File" />
                        <FileInput
                            onFileSelect={handleFileUpload}
                            url={file_url}
                        />
                        {
                            selectedFile && (
                                <p className="mt-2 text-green-600">File uploaded: {selectedFile.name}</p>
                            )
                        }
                    </div>
                    <div className="flex items-center justify-center">
                        <PrimaryButton> Save </PrimaryButton>
                    </div>
                </form>
            </Modal >
            <div className="grid grid-cols-12 gap-3">
                <div className="col-span-4">
                    {title}
                </div>
                <div className="col-span-4">
                    {description}
                </div>
                <div className="col-span-2">
                    {year}
                </div>
                <div className="col-span-2">
                    <div className="flex items-center justify-center">
                        <SecondaryButton onClick={() => setIsModalOpen(true)} className="mr-3">Edit</SecondaryButton>
                        <DangerButton>Delete</DangerButton>
                    </div>
                </div>
                <div className="col-span-12">
                    <hr className="block w-full items-center justify-center" />
                </div>
            </div>
        </div>
    );

}
