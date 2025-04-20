import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { useEffect, useState } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import { usePage } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import { useCallback } from "react";
import debounce from "lodash.debounce";
import { router } from "@inertiajs/react";

function CreateJobPostModal({ className, show, onClose }) {
    const { props } = usePage();
    const { statuses, degrees, requirements, skills } = props;

    const [isSalaryFixed, setIsSalaryFixed] = useState(false);

    const { data, setData, errors } = useForm({
        job_title: "",
        company: "",
        job_description: "",
        job_location: "",
        job_type: "Full Time",
        min_salary: "",
        max_salary: "",
        min_experience_years: "1",
        status_id: "1",
        degree_id: "",
        skills: [],
        requirements: []
    });

    useEffect(() => {
        console.log(data);
    }, [data])

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [adding, setAdding] = useState(false);

    const fetchSkills = useCallback(
        debounce(async (search) => {
            if (!search) {
                setSuggestions([]);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const res = await fetch(`/skills?q=${encodeURIComponent(search)}`, {
                    headers: { Accept: 'application/json' },
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                setSuggestions(data.data || data || []);
            } catch (error) {
                console.error("Failed to fetch skills", error);
                setError("Failed to fetch skills. Please try again later.");
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 300),
        []
    );
    useEffect(() => {
        fetchSkills(query);
        return fetchSkills.cancel;
    }, [query, fetchSkills]);

    const handleSkillSelect = (skill) => {
        setAdding(true);
        setError(null);

        router.post(route('user-skills.store'), {
            skill_id: skill.id,
            skill_name: skill.name,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                console.log("Skill added:", skill.name);
                setQuery('');
                setSuggestions([]);
            },
            onError: (err) => {
                console.error("Error adding skill:", err);
                setError("Could not add skill. Please try again.");
            },
            onFinish: () => {
                setAdding(false);
            }
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="4xl">
            <div className={" " + className}>
                <div className='font-semibold text-lg flex justify-between'>
                    <p>Create Job post</p>
                    <button onClick={onClose}>
                        <i className="fa-solid fa-xmark text-gray-400"></i>
                    </button>
                </div>
                <form className="w-full mt-4">
                    <div className="">
                        <InputLabel value="Job Title" />
                        <TextInput
                            className="mt-1 block w-full"
                            value={data.job_title}
                            onChange={(e) => setData('job_title', e.target.value)}
                        />
                        <InputError />
                    </div>
                    <div className="mt-3">
                        <InputLabel value="Description" />
                        <textarea
                            className="resize-y rounded-md border border-gray-300 p-2 w-full min-h-[100px]"
                            value={data.job_description}
                            onChange={(e) => setData('job_description', e.target.value)}
                        />
                        <InputError />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="col-span-1">
                            <InputLabel value="Company" />
                            <TextInput
                                className="mt-1 block w-full"
                                value={data.company}
                                onChange={(e) => setData('company', e.target.value)}
                            />
                            <InputError />
                        </div>
                        <div className="col-span-1">
                            <InputLabel value="Location" />
                            <TextInput
                                className="mt-1 block w-full"
                                value={data.job_location}
                                onChange={(e) => setData('job_location', e.target.value)}
                            />
                            <InputError />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 mt-3 gap-3">
                        <div className="col-span-1">
                            <InputLabel value="Job type" />
                            <select
                                className='w-full rounded-md border-gray-300 shadow-sm focus:border-dark focus:ring-gray-500 mt-1'
                                value={data.job_type}
                                onChange={(e) => setData('job_type', e.target.value)}
                            >
                                <option value="Full Time">Full Time</option>
                                <option value="Part Time">Part Time</option>
                                <option value="Contract">Contract</option>
                                <option value="Temporary">Temporary</option>
                                <option value="Internship">Internship</option>
                                <option value="Remote">Remote</option>
                                <option value="Freelance">Freelance</option>
                            </select>
                            <InputError />
                        </div>
                        <div className="col-span-1">
                            <InputLabel value="Required Education" />
                            <select
                                className='w-full rounded-md border-gray-300 shadow-sm focus:border-dark focus:ring-gray-500 mt-1'
                                value={data.degree_id}
                                onChange={(e) => setData('degree_id', e.target.value)}
                            >
                                {
                                    degrees.map(d => (
                                        <option key={d.id} value={d.id}>
                                            {d.name}
                                        </option>
                                    ))
                                }
                            </select>
                            <InputError />

                        </div>
                        <div className="col-span-1">
                            <InputLabel value="Required Experience" />
                            <select
                                id="Minimum Experience"
                                name="Minimum Experience"
                                className='w-full rounded-md border-gray-300 shadow-sm focus:border-dark focus:ring-gray-500 mt-1'
                                value={data.min_experience_years}
                                onChange={(e) => setData('min_experience_years', e.target.value)}
                            >
                                <option value="1">Entry Level</option>
                                <option value="3" >Intermediate  Level</option>
                                <option value="5">Expert Level</option>
                            </select>
                            <InputError />
                        </div>
                    </div>
                    <div className="flex flex-col mt-4">
                        <div>
                            <InputLabel value="Salary" />
                        </div>
                        <div className="grid grid-cols-5 gap-3">
                            <div className="col-span-1">
                                <select
                                    className='w-full rounded-md border-gray-300 shadow-sm focus:border-dark focus:ring-gray-500 mt-1'
                                    value={isSalaryFixed}
                                    onChange={(e) => setIsSalaryFixed(!isSalaryFixed)}
                                >
                                    <option value={true}>
                                        Fixed
                                    </option>
                                    <option value={false}>
                                        Range
                                    </option>
                                </select>
                                <InputError />
                            </div>
                            <div className="col-span-2 mt-1">
                                <TextInput
                                    className="mt-1 block w-full"
                                    placeholder="minimum"
                                />
                            </div>
                            {
                                !isSalaryFixed && (<div className="col-span-2 mt-1">
                                    <TextInput
                                        className="mt-1 block w-full"
                                        placeholder="maximum"
                                    />
                                </div>)
                            }
                        </div>
                    </div>
                    <div className="mt-4 relative w-full">
                        <InputLabel value="Skills" />
                        <div className="flex items-center">
                            <TextInput
                                className="mt-1 block w-full"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}

                            />

                            {loading && (
                                <div className="absolute right-3 inset-y-0 flex items-center">
                                    <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                                </div>
                            )}

                        </div>
                        {suggestions.length > 0 && (
                            <ul className="absolute top-full left-0 right-0 z-50 bg-white border mt-1 rounded-md shadow-md max-h-48 overflow-y-auto">
                                {suggestions.map((skill) => (
                                    <li
                                        key={skill.id}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleSkillSelect(skill)}
                                    >
                                        {skill.name}
                                    </li>
                                ))}
                            </ul>
                        )}

                    </div>
                    <div className="mt-4">
                        <InputLabel value="Requirements" />
                        <TextInput
                            className="mt-1 block w-full"
                        />
                    </div>

                    <div className="flex items-center justify-center mt-4">
                        <PrimaryButton>
                            Save
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

export default CreateJobPostModal;
