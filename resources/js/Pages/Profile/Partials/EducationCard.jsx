import DangerButton from "@/Components/DangerButton";
import TextInput from "@/Components/TextInput";
import SecondaryButton from "@/Components/SecondaryButton";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import FileInput from "@/Components/FileInput";
import { useForm } from "@inertiajs/inertia-react";
import { router } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function EducationCard({ className, id, educationLevel, school, degree, startYear, endYear, attachedFile, years }) {
    let eduLevel = '';


    const { data, setData, put, processing, errors, reset } = useForm({
        education_level: educationLevel,
        school: school,
        degree: degree,
        start_year: startYear,
        end_year: endYear,
        attached_file: attachedFile
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [universities, setUniversities] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (data.school.length > 2) {
            fetch(`http://universities.hipolabs.com/search?name=${data.school}`)
                .then((response) => response.json())
                .then((result) => setUniversities(result))
                .catch((error) => console.error("Error fetching universities: ", error));
        } else {
            setUniversities([]); // Clear suggestions if input is too short
        }
    }, [data.school]);

    //useEffect(() => {
    //    setData({
    //        education_level: educationLevel,
    //        school: school,
    //        degree: degree,
    //        start_year: startYear,
    //        end_year: endYear,
    //        attached_file: attachedFile
    //    })
    //}, [isModalOpen])

    const handleSelect = (university) => {
        //form.setData("university", university);
        setData('school', university);
        setShowSuggestions(false); // Hide dropdown
    };

    const handleFileUpload = (file) => {
        setSelectedFile(file);
        console.log("Selected file:", file);
    };

    //const submit = (e) => {
    //    e.preventDefault();
    //
    //    put(route('education.update', id), {
    //        preserveScroll: true, // Keeps the page from jumping to the top
    //    });
    //};

    const submit = (e) => {
        e.preventDefault();

        const scrollPosition = window.scrollY; // Save the scroll position

        put(route('education.update', id), {
            preserveScroll: true, // Keeps the page from jumping to the top
            onSuccess: () => {
                window.scrollTo(0, scrollPosition);
            }
        });
    };

    const deleteEducation = () => {
        router.delete(route('education.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                console.log("deleted successfully");
            },
            onError: (error) => {
                console.log("An error occur: ", error);
            }
        });
    };


    return (
        <>
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="4xl">
                <form onSubmit={submit}>
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold">
                            Edit Education
                        </p>
                        <button type='button' onClick={() => setIsModalOpen(false)}>
                            <i className="fa-solid fa-xmark text-gray-400"></i>
                        </button>
                    </div>
                    <div className="grid grid-cols-6 gap-3 mt-6">
                        <div className="col-span-1">
                            <InputLabel htmlFor="wow" value="Education Level" />
                            <select
                                className='w-full rounded-md border-gray-300 shadow-sm focus:border-dark focus:ring-gray-500 mt-1'
                                value={data.education_level}
                                onChange={(e) => setData('education_level', e.target.value)}
                            >
                                <option value="Vocational">Vocational</option>
                                <option value="Graduate">Graduate</option>
                                <option value="Undergraduate">Undergraduate</option>
                                <option value="High School">High School</option>
                                <option value="Elementary">Elementary</option>
                                <option value="Others">Others</option>
                            </select>
                            <InputError
                                message={errors.education_level}
                                className="mt-2"
                            />
                        </div>
                        <div className="col-span-3">
                            <InputLabel htmlFor="wow" value="School" />
                            <input
                                type="text"
                                value={data.school}
                                onChange={(e) => {
                                    setData('school', e.target.value);
                                    setShowSuggestions(true);
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark focus:ring-gray-500"
                                placeholder="Start typing to search..."
                            />
                            {
                                showSuggestions && universities.length > 0 && (
                                    <ul className="absolute z-10 min-w-60 bg-white border rounded-md shadow-lg mt-1 overflow-y-auto">
                                        {universities.map((uni) => (
                                            <li
                                                key={uni.name}
                                                onClick={() => handleSelect(uni.name)}
                                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                            >
                                                {uni.name}
                                            </li>
                                        ))}
                                    </ul>
                                )
                            }
                            <InputError message={errors.school} className="mt-2" />
                        </div>
                        <div className="col-span-1">
                            <InputLabel htmlFor="wow" value="Start year" />
                            <select
                                className='w-full rounded-md border-gray-300 shadow-sm focus:border-dark focus:ring-gray-500 mt-1'
                                value={data.start_year}
                                onChange={(e) => setData('start_year', e.target.value)}
                            >
                                {years.map(y => (
                                    <option key={y} value={String(y)}>
                                        {y}
                                    </option>
                                ))}
                            </select>

                        </div>
                        <div className="col-span-1">
                            <InputLabel htmlFor="wow" value="End Year" />
                            <select
                                className='w-full rounded-md border-gray-300 shadow-sm focus:border-dark focus:ring-gray-500 mt-1'
                                value={data.end_year}
                                onChange={(e) => setData('end_year', e.target.value)}
                            >
                                {years.map(y => (
                                    <option key={y} value={String(y)}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.end_year} className="mt-2" />

                        </div>
                    </div>
                    {
                        data.education_level === 'Graduate' || data.education_level === 'Vocational' || data.education_level === 'Undergraduate' ?
                            <div className='col-span-6 mt-3'>
                                <InputLabel htmlFor="wow" value="Course/Program" />
                                <TextInput
                                    className="mt-1 block w-full"
                                    value={data.degree}
                                    onChange={(e) => setData('degree', e.target.value)}
                                ></TextInput>
                                <InputError message={errors.degree} className="mt-2" />
                            </div>
                            : <></>
                    }
                    <div className="w-full mt-3">
                        <InputLabel htmlFor="wow" value="Attach File" />
                        <FileInput onFileSelect={handleFileUpload} />
                        {selectedFile && (
                            <p className="mt-2 text-green-600">File uploaded: {selectedFile.name}</p>
                        )}

                    </div>
                    <div className="mt-4 flex items-center justify-center">
                        <SecondaryButton type="submit">
                            Save
                        </SecondaryButton>
                    </div>
                </form>
            </Modal>

            <div className={"grid grid-cols-12 gap-3 " + className}>
                <div className="col-span-2">
                    {educationLevel}
                </div>
                <div className="col-span-3">
                    {school}
                </div>
                <div className="col-span-3">
                    {degree === null ? 'N/A' : degree}
                </div>
                <div className="col-span-2">
                    {startYear} - {endYear}
                </div>
                <div className="col-span-2">
                    <div className="flex items-center justify-center">
                        <SecondaryButton onClick={() => setIsModalOpen(true)} className="mr-3">Edit</SecondaryButton>
                        <DangerButton onClick={deleteEducation}>Delete</DangerButton>
                    </div>
                </div>
                <div className="col-span-12">
                    <hr className="block w-full items-center justify-center" />
                </div>
            </div >
        </>
    );
}
