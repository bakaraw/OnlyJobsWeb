import React, {useCallback, useEffect, useState} from "react";
import SecondaryButton from "@/Components/SecondaryButton.jsx";


import axios from "axios";
import ApplicantsSection from "../Components/Dashboard/Modal/ApplicantsSection.jsx";
import InputLabel from "@/Components/InputLabel.jsx";
import InputError from "@/Components/InputError.jsx";
import TextInput from "@/Components/TextInput.jsx";
import debounce from "lodash.debounce";
import Chip from "@/Components/Chip.jsx";

export default function JobDetails({ job_details, applicants, degrees, edit_status, edit_requirements, onBack}) {
    const {
        job_title = "N/A",
        job_type = "N/A",
        job_description = "N/A",
        job_location = "N/A",
        company = "",
        views = 'N/A',
        slot = 'N/A',
        salary_type = "",
        min_salary = "",
        max_salary = "",
        min_experience_years = "",
        requirements = [],
        skills = [],


    } = job_details;

    console.log('sd', job_details)
    console.log('sd', job_details.degree)
    console.log("slot", job_details.slot);
    console.log('sst', job_details.status)

    const [isEditing, setIsEditing] = useState(false);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [adding, setAdding] = useState(false);

    const [searchRequirement, setSearchRequirement] = useState('');
    const [customRequirements, setCustomRequirements] = useState([]);
    const filteredRequirements = (edit_requirements || []).filter((requirement) =>
        requirement.requirement_name.toLowerCase().includes(searchRequirement.toLowerCase())
    );



    const [form, setForm] = useState({
        job_title: job_details.job_title || "N/A",
        job_type: job_details.job_type || "N/A",
        job_description: job_details.job_description || "N/A",
        job_location: job_details.job_location || "N/A",
        company: job_details.company || "N/A",
        slot: job_details.slot || "N/A",
        salary_type: job_details.salary_type || "N/A",
        min_salary: job_details.min_salary || "N/A",
        max_salary: job_details.max_salary || "N/A",
        min_experience_years: job_details.min_experience_years || "N/A",
        requirements: job_details.requirements || [],
        degree_id: job_details.degree_id || "1",
        status_id: job_details.status_id || "1",
        skills: job_details.skills || [],
    });
    const [status, setStatus] = useState(job_details.status_id || "1");


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
        if (Array.isArray(job_details.skills)) {
            const normalized = job_details.skills.map(s => ({
                id: s.skill_id,
                name: s.skill_name,
            }));
            setForm(prev => ({ ...prev, skills: normalized }));
        }
    }, [job_details.skills]);

    useEffect(() => {
        fetchSkills(query);
    }, [query, fetchSkills]);

    const handleSkillSelect = (skill) => {
        const skillAlreadySelected = form.skills.some(s =>
            s.id === skill.id ||
            (s.name && s.name.toLowerCase() === skill.name.toLowerCase())
        );

        if (!skillAlreadySelected) {
            setForm(prev => ({
                ...prev,
                skills: [...prev.skills, { id: skill.id, name: skill.name }]
            }));
        }

        setQuery("");
        setSuggestions([]);
    };

    const handleSelectRequirement = (requirement) => {
        if (!form.requirements.some(req => req.requirement_id === requirement.requirement_id)) {
            setForm(prev => ({
                ...prev,
                requirements: [...prev.requirements, requirement]
            }));
        }
        setSearchRequirement("");
    };

    const handleRemoveRequirement = (requirementId) =>
        setForm(prev => ({
            ...prev,
            requirements: prev.requirements.filter((req) => req.requirement_id !== requirementId)
        }));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = async (e) => {
        const newStatusId = e.target.value;
        setStatus(newStatusId);

        try {
            // Use the dedicated endpoint for status updates
            const res = await axios.patch(`/job-posts/${job_details.id}/status`, {
                status_id: newStatusId
            });

            if (res.data.success) {
                console.log("Status updated successfully");
            }
        } catch (err) {
            console.error('Error updating status:', err.response?.data || err);
            alert("Error updating status: " + (err.response?.data?.message || err.message));
            setStatus(job_details.status_id);
        }
    };

    const handleSave = async () => {
        try {
            // Format skills and requirements as before
            const formattedSkills = form.skills.map(skill => ({
                skill_id: typeof skill === 'object' ? (skill.skill_id || skill.id || "") : (skill || ""),
                skill_name: typeof skill === 'object' ? (skill.skill_name || skill.name || "") : ""
            }));

            const formattedRequirements = form.requirements.map(req =>
                typeof req === 'object' ? req.requirement_id : req
            );

            const payload = {
                job_title: form.job_title,
                job_type: form.job_type,
                job_description: form.job_description,
                job_location: form.job_location,
                company: form.company,
                slot: form.slot,
                salary_type: form.salary_type,
                min_salary: form.min_salary,
                max_salary: form.max_salary,
                min_experience_years: form.min_experience_years,
                requirements: formattedRequirements,
                skills: formattedSkills,
                status_id: form.status_id,
                degree_id: form.degree_id
            };

            const res = await axios.put(`/job-posts/${job_details.id}`, payload);
            if (res.data.success) {

                if (res.data.job) {
                    setForm({
                        job_title: res.data.job.job_title || form.job_title,
                        job_type: res.data.job.job_type || form.job_type,
                        job_description: res.data.job.job_description || form.job_description,
                        job_location: res.data.job.job_location || form.job_location,
                        company: res.data.job.company || form.company,
                        slot: res.data.job.slot || form.slot,
                        salary_type: res.data.job.salary_type || form.salary_type,
                        min_salary: res.data.job.min_salary || form.min_salary,
                        max_salary: res.data.job.max_salary || form.max_salary,
                        min_experience_years: res.data.job.min_experience_years || form.min_experience_years,
                        requirements: res.data.job.requirements || form.requirements,
                        degree_id: res.data.job.degree_id || form.degree_id,
                        status_id: res.data.job.status_id || form.status_id,
                        skills: res.data.job.skills || form.skills,
                    });
                }
                setIsEditing(false);
            }
        } catch (err) {
            console.error('Error details:', err.response?.data || err);
            alert("Error updating job details: " + (err.response?.data?.message || err.message));
        }

    };
    return (
        <div>
            {isEditing ? (
                <>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 w-full">
                        <div className="w-full">

                            <div className="mb-4">
                                <label className="font-semibold">Job Title:   </label>
                                <input
                                    type="text"
                                    name="jobtitle"
                                    value={form.job_title}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="font-semibold">Company:   </label>
                                <input
                                    type="text"
                                    name="company"
                                    value={form.company}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-md px-3 py-2 w-1/2"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="font-semibold">Location: </label>
                                <input
                                    type="text"
                                    name="job_location"
                                    value={form.job_location}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-md px-3 py-2 w-1/2"
                                />
                            </div>

                            <div className="text">
                                <label className="font-semibold">Job Type: </label>
                                <select
                                    name ="job_type"
                                    value={form.job_type}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-1/4"
                                >
                                    <option value="Full Time">Full Time</option>
                                    <option value="Part Time">Part Time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Temporary">Temporary</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Remote">Remote</option>
                                    <option value="Freelance">Freelance</option>
                                </select>
                            </div>

                            <div className="text">
                                <label className="font-semibold">Salary Type: </label>
                                <select
                                    name="salary_type"
                                    value={form.salary_type}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-md px-3 py-2 mb-4 w-1/4"
                                >
                                    <option value="Fixed">Fixed</option>
                                    <option value="Range">Range</option>
                                </select>

                                <div>
                                    <div>
                                        <label className="font-semibold">Minimum Salary: </label>
                                        <input
                                            type="number"
                                            name="min_salary"
                                            value={form.min_salary}
                                            onChange={handleChange}
                                            className="border border-gray-300 rounded-md px-3 py-2 mb-4"
                                        />
                                    </div>
                                    {form.salary_type === "Range" && (
                                        <>
                                            <label className="font-semibold">Maximum Salary: </label>
                                            <input
                                                type="number"
                                                name="max_salary"
                                                value={form.max_salary}
                                                onChange={handleChange}
                                                className="border border-gray-300 rounded-md px-3 py-2"
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="font-semibold">Required Experience: </label>
                            <select
                                name="min_experience_years"
                                value={form.min_experience_years}
                                onChange={handleChange}
                                className="rounded-md border-gray-300 shadow-sm focus:border-dark focus:ring-gray-500 mt-1"
                            >
                                <option value="1">Entry Level</option>
                                <option value="3">Intermediate Level</option>
                                <option value="5">Expert Level</option>
                            </select>
                            <div>
                                <label className="font-semibold">Required Education: </label>
                                <select
                                    name="degree_id"
                                    className=' rounded-md border-gray-300 shadow-sm focus:border-dark focus:ring-gray-500 mt-1'
                                    value={form.degree_id}
                                    onChange={handleChange}
                                >
                                    {
                                        degrees && degrees.map(d => (
                                            <option key={d.id} value={d.id}>
                                                {d.name}
                                            </option>
                                        ))
                                    }
                                </select>
                                <InputLabel value="Slots" />
                                <TextInput
                                    className="mt-1 block w-20"
                                    value={form.slot}
                                    onChange={(e) => setForm('slot', e.target.value)}
                                />


                            </div>

                            <div className="mt-4 relative w-full">
                                <InputLabel value="Skills"/>
                                <div className="flex items-center">
                                    <TextInput
                                        className="mt-1 block w-full"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Search Skills"
                                    />

                                    {loading && (
                                        <div className="mt-4 absolute right-3 inset-y-0 flex items-center">
                                            <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>

                                {error && (
                                    <div className="text-red-500 text-sm mt-1">{error}</div>
                                )}

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

                                <div className="flex flex-wrap items-center mt-4 gap-3">
                                    {form.skills && form.skills.length > 0 ? (
                                        form.skills.map((skill) => (
                                            <Chip key={skill.id || skill.name} className="min-w-32">
                                                <div className="flex items-center justify-between w-full gap-2">
                                                    <span>{skill.name}</span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setForm(prev => ({
                                                                ...prev,
                                                                skills: prev.skills.filter((s) =>
                                                                    (s.id !== skill.id) || (!s.id && s.name !== skill.name)
                                                                )
                                                            }));
                                                        }}
                                                        type="button"
                                                    >
                                                        <i className="fa-solid fa-xmark"></i>
                                                    </button>
                                                </div>
                                            </Chip>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No skills selected</p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 relative">
                                <InputLabel value="Requirements"/>
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
                                                form.requirements.some(id =>
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
                                <InputError message={error?.requirements}/>
                                {searchRequirement && (
                                    <div
                                        className="absolute top-full left-0 bg-white border border-gray-300 rounded-md shadow-lg w-full max-h-60 overflow-y-auto z-50">
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
                            <div className="flex flex-wrap gap-2 mt-2">
                                {(form?.requirements ?? []).map((req) => (
                                    <div
                                        key={req.requirement_id}
                                    >
                                        <div className="flex items-center justify-between w-full gap-2">
                                            <div>
                                                {req.requirement_name}
                                            </div>
                                            <button
                                                onClick={() => handleRemoveRequirement(req.requirement_id)}
                                            >
                                                <i className="fa-solid fa-xmark"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>







                        </div>

                    </div>



                    <div className="flex justify-end mt-4">
                        <div className="w-full mb-6">
                            <label className="font-semibold">Job Description: </label>
                            <textarea
                                name="job_description"
                                value={form.job_description}
                                onChange={handleChange}
                                className="mt-1 block w-full h-80 p-2 border border-gray-500 rounded-md align-top"/>                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <SecondaryButton
                            className="px-4 py-2 mr-2"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </SecondaryButton>
                        <SecondaryButton
                            className="px-4 py-2 text-black"
                            onClick={handleSave}
                        >
                            Save
                        </SecondaryButton>
                    </div>



                </>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">{job_title}</h2>
                        <div className="flex flex-row items-center space-x-4">


                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <label className="font-semibold whitespace-nowrap">Status:</label>
                                    <select
                                        name="status_id"
                                        className="rounded-md py-2 w-auto min-w-[120px] border"
                                        style={{
                                            width: 'auto',
                                            borderWidth: `${
                                                edit_status.find(s => s.id.toString() === form.status_id.toString())?.name.length > 10
                                                    ? '2px'
                                                    : '1px'
                                            }`
                                        }}
                                        value={form.status_id}
                                        onChange={handleStatusChange}
                                    >
                                        {edit_status.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex-1">

                                <SecondaryButton
                                    className="px-4 py-2 black-white rounded-md flex justify-center"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </SecondaryButton>

                                <SecondaryButton
                                    onClick={onBack}
                                    className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
                                >
                                    Back
                                </SecondaryButton>



                            </div>
                        </div>



                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <div className="mb-4">
                                <p className="font-semibold">Company:</p>
                                <p className="text-gray-600">{company}</p>
                            </div>

                            <div className="mb-4">
                                <p className="font-semibold">Location:</p>
                                <p className="text-gray-600">{job_location}</p>
                            </div>

                            <div className="mb-4">
                                <p className="font-semibold">Type:</p>
                                <p className="text-gray-600">{job_type}</p>
                            </div>

                            <div className="mb-4">
                                <p className="font-semibold">Salary:</p>
                                <p className="text-gray-600">
                                    {form.salary_type === 'Range'
                                        ? `$${Number(form.min_salary).toLocaleString()} - $${Number(form.max_salary).toLocaleString()}`
                                        : `$${Number(form.min_salary).toLocaleString()}`
                                    }
                                </p>
                            </div>
                        </div>

                        <div>


                            <div className="mb-4">
                                <p className="font-semibold">Experience Required:</p>
                                <p className="text-gray-600">{min_experience_years} years</p>
                            </div>

                            <div className="mb-4">
                                <p className="font-semibold">Education:</p>
                                <p className="text-gray-600">{job_details.degree?.name || 'N/A'}</p>
                            </div>

                            <div className="mb-4">
                                <p className="font-semibold">Slots:</p>
                                <p className="text-gray-600">{job_details.slot || 'N/A'}</p>
                            </div>

                            {/*{status && (*/}
                            {/*    <div className="mb-4">*/}
                            {/*        <p className="font-semibold">Status:</p>*/}
                            {/*        <p className="text-gray-600">{job_details.status?.name || 'N/A'}</p>*/}
                            {/*    </div>*/}
                            {/*)}*/}

                            <div className="mb-4">
                                <p className="font-semibold">Views:</p>
                                <p className="text-gray-600">{views}</p>
                            </div>

                        </div>



                        <div className="grid grid-cols-1 gap-6 mb-6">
                            {skills && skills.length > 0 && (
                                <div className="mb-4">
                                    <p className="font-semibold mb-2">Skills:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill, index) => (
                                            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                            {skill.skill_name}
                                        </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-1 gap-6 mb-6">

                            {requirements && requirements.length > 0 && (
                                <div className="mb-4">
                                    <p className="font-semibold mb-2">Requirements:</p>
                                    <ul className="list-disc ml-5">
                                        {requirements.map((req, index) => (
                                            <li key={index} className="text-gray-600">
                                                {req.requirement_name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>



                    </div>





                    <div className="mb-6 col-span-1">
                        <p className="font-semibold">Description:</p>
                        <p className="text-gray-600 whitespace-pre-wrap">{job_description}</p>
                    </div>



                    <div>
                        <ApplicantsSection applicants={applicants} />
                    </div>
                </>
            )}
        </div>
    );
}
