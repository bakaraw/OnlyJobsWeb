import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import FileInput from '@/Components/FileInput';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import { usePage, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import EducationCard from './EducationCard';
import Modal from '@/Components/Modal';

export default function UpdateEducation({ className }) {

    const { props } = usePage();
    const educations = props.educations || [];

    const { data, setData, post, processing, errors, reset } = useForm({
        education_level: 'Vocational',
        school: '',
        degree: '',
        start_year: '2025',
        end_year: '2025',
        attached_file: ''
    });

    const [selectedFile, setSelectedFile] = useState(null);

    const [universities, setUniversities] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // when query is changes, this block of code runs and fetches the universities based on the query
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

    const handleFileUpload = (file) => {
        setSelectedFile(file);
        console.log("Selected file:", file);
    };

    const handleSelect = (university) => {
        //form.setData("university", university);
        setData('school', university);
        setShowSuggestions(false); // Hide dropdown
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('education.store'), {
            preserveScroll: true, // Keeps the page from jumping to the top
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset('title', 'degree', 'end_year', 'start_year', 'attached_file', 'education_level');
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <div className='flex items-center justify-between'>
                    <div className='w-full'>
                        <h2 className="text-lg font-medium text-gray-900">
                            Education
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Update your education
                        </p>
                    </div>
                    <div className='flex items-center justify-end w-full'>
                        <SecondaryButton onClick={() => setIsAddModalOpen(true)} className=''>
                            Add
                        </SecondaryButton>
                    </div>
                </div>
                <hr className="mt-5 block w-full items-center justify-center" />
            </header>
            <div className='grid grid-cols-12 gap-3 mt-3'>
                <div className='col-span-2'>
                    <p className='font-medium'>Education Level</p>
                </div>
                <div className='col-span-3'>
                    <p className='font-medium'>School</p>
                </div>
                <div className='col-span-3'>
                    <p className='font-medium'>Program/Degree</p>
                </div>
                <div className='col-span-2'>
                    <p className='font-medium'>Duration</p>
                </div>
                <div className='col-span-2'>
                </div>
            </div>
            <hr className='w-full mt-3 mb-6' />
            {
                educations.length != 0 ?
                    educations.map((edu, index) => (
                        <EducationCard
                            key={edu.id}
                            className="my-3"
                            id={edu.id}
                            userId={edu.user_id}
                            educationLevel={edu.education_level}
                            school={edu.school}
                            degree={edu.degree}
                            startYear={edu.start_year}
                            endYear={edu.end_year}
                            attached_file_url={edu.attached_file_url}
                            years={years}
                        />
                    )) : <div className='flex items-center justify-center my-6'> no education specified </div>
            }

            <Modal show={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} maxWidth="4xl">
                <div className='font-semibold text-xl flex justify-between'>
                    <p>Add Education</p>
                    <button onClick={() => setIsAddModalOpen(false)}>
                        <i className="fa-solid fa-xmark text-gray-400"></i>
                    </button>
                </div>
                <form onSubmit={submit} className="mt-12 space-y-6">
                    <div className='grid grid-cols-6 gap-3'>
                        <div className='col-span-1'>
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
                            <InputError message={errors.education_level} className="mt-2" />
                        </div>
                        <div className='col-span-3'>
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
                            {showSuggestions && universities.length > 0 && (
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
                            )}
                            <InputError message={errors.school} className="mt-2" />
                        </div>
                        <div className='col-span-1'>
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
                            <InputError message={errors.start_year} className="mt-2" />
                        </div>
                        <div className='col-span-1'>
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

                        {
                            data.education_level === 'Graduate' || data.education_level === 'Vocational' || data.education_level === 'Undergraduate' ?
                                <div className='col-span-6'>
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

                    </div>
                    <div className=''>
                        <InputLabel htmlFor="wow" value="Attach File" />
                        <div className="">
                            <FileInput onFileSelect={(file) => setData('attached_file', file)} />
                        </div>
                    </div>
                    <div className='flex items-center justify-center'>
                        <PrimaryButton className='' type='submit' disabled={processing}>
                            Add
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </section >
    );
}
