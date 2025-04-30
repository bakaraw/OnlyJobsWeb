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
import { Input } from "postcss";
import Chip from "@/Components/Chip";

function CreateJobPostModal({ className, show, onClose }) {
    const { props } = usePage();
    const { statuses, degrees, requirements, skills } = props;

    const [isSalaryFixed, setIsSalaryFixed] = useState(false);

    const { data, setData, errors, reset } = useForm({
        job_title: "",
        company: "",
        job_description: "",
        job_location: "",
        job_type: "Full Time",
        salary_type: "Range",
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

    const [searchRequirement, setSearchRequirement] = useState('');
    const [customRequirements, setCustomRequirements] = useState([]);
    const filteredRequirements = (requirements || []).filter((requirement) =>
        requirement.requirement_name.toLowerCase().includes(searchRequirement.toLowerCase())
    );

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
        const skillAlreadySelected = data.skills.some(s => s.id === skill.id);

        if (!skillAlreadySelected) {
            setData("skills", [...data.skills, { id: skill.id, name: skill.name }]);
        }

        setQuery("");
        setSuggestions([]);
    };


    const handleSelectRequirement = (requirement) => {
        if (!data.requirements.includes(requirement.requirement_id)) {
            setData("requirements", [...data.requirements, requirement.requirement_id]);
        }
        setSearchRequirement("");
    };

    const handleRemoveRequirement = (requirementId) =>
        setData("requirements", data.requirements.filter((id) => id !== requirementId));

    const submit = (e) => {
        e.preventDefault();

        const skillsArray = data.skills.map(skill => ({
            skill_id: skill.id,
            skill_name: skill.name
        })); // assuming each skill is { id, name }
        const requirementsArray = data.requirements;

        router.post(
            route("job_posts.store"),
            {
                ...data,
                skills: skillsArray,
                requirements: requirementsArray,
            },
            {
                onSuccess: () => {
                    console.log("Job post created successfully");
                    reset();
                    onClose(); // close modal if needed
                },
                onError: (errors) => {
                    console.error("Submission errors:", errors);
                },
            }
        );
    }


    return (
        <Modal show={show} onClose={onClose} maxWidth="4xl">
            <div className={" " + className}>
                <div className='font-semibold text-lg flex justify-between'>
                    <p>Create Job post</p>
                    <button onClick={onClose}>
                        <i className="fa-solid fa-xmark text-gray-400"></i>
                    </button>
                </div>
                <form className="w-full mt-4" onSubmit={submit}>
                    <div className="">
                        <InputLabel value="Job Title" />
                        <TextInput
                            className="mt-1 block w-full"
                            value={data.job_title}
                            onChange={(e) => setData('job_title', e.target.value)}
                        />
                        <InputError message={errors.job_title} />
                    </div>
                    <div className="mt-3">
                        <InputLabel value="Description" />
                        <textarea
                            className="resize-y rounded-md border border-gray-300 p-2 w-full min-h-[100px]"
                            value={data.job_description}
                            onChange={(e) => setData('job_description', e.target.value)}
                        />
                        <InputError message={errors.job_description} />
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
                            <InputError message={errors.job_location} />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 mt-3 gap-3">
                        <div className="col-span-1">
                            <InputLabel value="Job type" />
                            <select
                                className='w-full rounded-md border-gray-300 shadow-sm focus:border-dark focus:ring-gray-500 mt-1'
                                value={data.job_type}
                                onChange={(e) => setData('job_type', e.target.value)}
                                message={errors.job_type}
                            >
                                <option value="Full Time">Full Time</option>
                                <option value="Part Time">Part Time</option>
                                <option value="Contract">Contract</option>
                                <option value="Temporary">Temporary</option>
                                <option value="Internship">Internship</option>
                                <option value="Remote">Remote</option>
                                <option value="Freelance">Freelance</option>
                            </select>
                            <InputError message={errors.job_type} />
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
                            <InputError message={errors.degree_id} />
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
                            <InputError message={errors.min_experience_years} />
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
                                    value={data.salary_type}
                                    onChange={(e) => setData('salary_type', e.target.value)}
                                >
                                    <option value="Fixed">
                                        Fixed
                                    </option>
                                    <option value="Range">
                                        Range
                                    </option>
                                </select>
                                <InputError />
                            </div>
                            <div className="col-span-2 mt-1">
                                <TextInput
                                    className="mt-1 block w-full"
                                    placeholder="minimum"
                                    value={data.min_salary}
                                    onChange={(e) => setData('min_salary', e.target.value)}
                                />
                                <InputError message={errors.min_salary} />
                            </div>
                            {
                                data.salary_type !== "Fixed" && (<div className="col-span-2 mt-1">
                                    <TextInput
                                        className="mt-1 block w-full"
                                        placeholder="maximum"
                                        value={data.max_salary}
                                        onChange={(e) => setData('max_salary', e.target.value)}
                                    />
                                    <InputError message={errors.max_salary} />
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
                                placeholder="Search skill"
                            />

                            {loading && (
                                <div className="mt-4 absolute right-3 inset-y-0 flex items-center">
                                    <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                                </div>
                            )}
                            <InputError message={errors.skills} />
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
                    <div className="flex items-center mt-4 gap-3">
                        {
                            data.skills.map((skill) => (
                                <Chip id={skill.id} className="min-w-32">
                                    <div className="flex items-center justify-between w-full gap-2">
                                        <span>{skill.name}</span>
                                        <button
                                            onClick={() =>
                                                setData("skills", data.skills.filter((s) => s.id !== skill.id))
                                            }
                                        >
                                            <i className="fa-solid fa-xmark"></i>
                                        </button>
                                    </div>
                                </Chip>
                            ))
                        }
                    </div>
                    <div className="mt-4 relative">
                        <InputLabel value="Requirements" />
                        <input
                            type="text"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            value={searchRequirement}
                            onChange={(e) => setSearchRequirement(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const requirementName = searchRequirement.trim();
                                    const exists = requirements.some(
                                        (r) => r.requirement_name.toLowerCase() === requirementName.toLowerCase()
                                    );
                                    const alreadySelected =
                                        data.requirements.some(id =>
                                            requirements.find(r => r.requirement_id === id)?.requirement_name.toLowerCase() === requirementName.toLowerCase()
                                        ) ||
                                        customRequirements.includes(requirementName);

                                    if (requirementName && !exists && !alreadySelected) {
                                        setCustomRequirements(prev => [...prev, requirementName]);
                                        setSearchRequirement('');
                                    }
                                }
                            }}
                            placeholder="Search or add new requirement"
                        />
                        <InputError message={errors.requirements} />
                        {searchRequirement && (
                            <div className="absolute top-full left-0 bg-white border border-gray-300 rounded-md shadow-lg w-full max-h-60 overflow-y-auto z-50">
                                {filteredRequirements.slice(0, 5).map((requirement) => (
                                    <div
                                        key={requirement.requirement_id}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleSelectRequirement(requirement)}
                                    >
                                        {requirement.requirement_name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center mt-4 gap-3 w-full">
                        {(data?.requirements ?? []).map((reqId) => {
                            const req = (requirements ?? []).find((r) => r.requirement_id === reqId);
                            return req ? (
                                <Chip
                                    key={req.requirement_id}
                                    className="min-w-32"
                                >
                                    <div className="flex items-center justify-between w-full gap-2">
                                        <div>
                                            {req.requirement_name}
                                        </div>
                                        <button
                                            onClick={() => handleRemoveRequirement(req.requirement_id)}
                                        >
                                            <i class="fa-solid fa-xmark"></i>
                                        </button>
                                    </div>

                                </Chip>
                            ) : null;
                        })}

                    </div>
                    <div className="flex items-center justify-center mt-4">
                        <PrimaryButton>
                            Save
                        </PrimaryButton>
                    </div>
                </form>
            </div >
        </Modal >
    );
}

export default CreateJobPostModal;
