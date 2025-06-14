import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout.jsx";
import InputLabel from "@/Components/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import { router } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton.jsx";

export default function CreateJobPost({ statuses, degrees, skills, requirements }) {
    const { data, setData, errors } = useForm({
        job_title: "",
        company: "",
        job_description: "",
        job_location: "",
        job_type: "",
        min_salary: "",
        max_salary: "",
        min_experience_years: "",
        status_id: "1",
        degree_id: "",
        skills: [],
        requirements: []
    });

    const [searchSkill, setSearchSkill] = useState("");
    const [searchRequirement, setSearchRequirement] = useState("");
    const [customSkills, setCustomSkills] = useState([]);
    const [customRequirements, setCustomRequirements] = useState([]);

    const handleSearchSkillChange = (e) => setSearchSkill(e.target.value);
    const handleSearchRequirementChange = (e) => setSearchRequirement(e.target.value);

    const filteredSkills = (skills || []).filter((skill) =>
        skill.skill_name.toLowerCase().includes(searchSkill.toLowerCase())
    );
    const filteredRequirements = (requirements || []).filter((requirement) =>
        requirement.requirement_name.toLowerCase().includes(searchRequirement.toLowerCase())
    );

    // Save the database ID (skill.skill_id) when a skill is selected.
    const handleSelectSkill = (skill) => {
        if (!data.skills.includes(skill.skill_id)) {
            setData("skills", [...data.skills, skill.skill_id]);
        }
        setSearchSkill("");
    };

    // Save the database ID (requirement.requirement_id) when a requirement is selected.
    const handleSelectRequirement = (requirement) => {
        if (!data.requirements.includes(requirement.requirement_id)) {
            setData("requirements", [...data.requirements, requirement.requirement_id]);
        }
        setSearchRequirement("");
    };

    const handleRemoveSkill = (skillId) =>
        setData("skills", data.skills.filter((id) => id !== skillId));
    const handleRemoveRequirement = (requirementId) =>
        setData("requirements", data.requirements.filter((id) => id !== requirementId));

    const handleSubmit = (e) => {
        e.preventDefault();
        const skillsArray = data.skills.map(Number);
        const requirementsArray = data.requirements.map(Number);
        const areSkillsValid = Array.isArray(skillsArray) && skillsArray.every(id => !isNaN(id));
        const areRequirementsValid = Array.isArray(requirementsArray) && requirementsArray.every(id => !isNaN(id));
        if (!areSkillsValid || !areRequirementsValid) {
            console.error("Invalid data: Skills and/or Requirements are not valid arrays of IDs.");
            return;
        }

        console.log("Submitting valid data:", {
            ...data,
            skills: skillsArray,
            requirements: requirementsArray,
            custom_skills: customSkills, // add this line to include custom skills in the payload
            custom_requirements: customRequirements // add this line to include custom skills in the payload

        });

        router.post(
            route("job_posts.store"),
            {
                ...data,
                skills: skillsArray,
                requirements: requirementsArray,
                custom_skills: customSkills,// include custom_skills in the payload
                custom_requirements: customRequirements // add this line to include custom skills in the payload

            },
            {
                onSuccess: () => {
                    console.log("Job post created successfully");
                },
                onError: (errors) => {
                    console.error("Submission errors:", errors);
                },
            }
        );
    };

    return (
        <div>
            <Head title="Create Job Post" />
            <div className="mt-6 text-primary text-4xl font-bold mb-6">Create Job</div>
            <form onSubmit={handleSubmit}>
                {/* Job Title Field */}
                <InputLabel htmlFor="job_title" />
                <div className="grid grid-cols-6 gap-3">
                    <div className="col-span-6 flex flex-col mb-4">
                        <InputLabel htmlFor="job_type" value="Job Title" />
                        <TextInput
                            id="job_title"
                            name="job_title"
                            placeholder="Job Title"
                            value={data.job_title}
                            className="mt-1 block w-full "
                            autoComplete="job_title"
                            isFocused={true}
                            onChange={(e) => setData("job_title", e.target.value)}
                        />
                        <InputError message={errors.job_title} className="mt-2" />
                    </div>
                    {/* Company Field */}
                    <div className="col-span-2 flex flex-col">
                        <InputLabel htmlFor="job_type" value="Company" />
                        <TextInput
                            id="company"
                            name="company"
                            placeholder="Company"
                            value={data.company}
                            className="mt-1 block w-full "
                            autoComplete="company"
                            onChange={(e) => setData("company", e.target.value)}
                        />
                        <InputError message={errors.company} className="mt-2" />
                    </div>

                    {/* Job Location Field */}
                    <div className="col-span-2 flex flex-col">
                        <InputLabel htmlFor="job_type" value="Location" />
                        <TextInput
                            id="job_location"
                            name="job_location"
                            placeholder="Job Location"
                            value={data.job_location}
                            className="mt-1 block w-full"
                            autoComplete="job_location"
                            onChange={(e) => setData("job_location", e.target.value)}
                        />
                        <InputError message={errors.job_location} className="mt-2" />
                    </div>

                    <div className="col-span-2 flex flex-col">
                        <InputLabel htmlFor="job_type" value="Job type" />
                        <select
                            id="job_type"
                            name="job_type"
                            value={data.job_type}
                            className="block w-full border-gray-300 rounded-md shadow-sm"
                            onChange={(e) => setData("job_type", e.target.value)}
                        >
                            <option value="Full Time">Full Time</option>
                            <option value="Part Time">Part Time</option>
                            <option value="Contract">Contract</option>
                            <option value="Temporary">Temporary</option>
                            <option value="Internship">Internship</option>
                            <option value="Remote">Remote</option>
                            <option value="Freelance">Freelance</option>
                        </select>
                        <InputError message={errors.job_type} className="mt-2" />
                    </div>

                    {/* Job Description Field */}
                    <div className="col-span-6">
                        <InputLabel htmlFor="job_description" />
                        <textarea
                            id="job_description"
                            name="job_description"
                            placeholder="Job Description"
                            value={data.job_description}
                            className="mt-1 block w-full h-40 p-2 border border-gray-300 rounded-md"
                            onChange={(e) => setData("job_description", e.target.value)}
                        />
                        <InputError message={errors.job_description} className="mt-2" />
                    </div>
                </div>

                {/* Job Type, Status, Degree, Salary, Experience */}
                <div className="mt-3 grid grid-cols-9 gap-3">
                    {/* Job Type */}



                    {/* Degree Required */}
                    <div className="col-span-3">
                        <InputLabel htmlFor="degree_id" />
                        <select
                            id="degree_id"
                            name="degree_id"
                            value={data.degree_id}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            onChange={(e) => setData("degree_id", e.target.value)}
                        >
                            <option value="">No Degree Required</option>
                            {degrees.map((degree) => (
                                <option key={degree.id} value={degree.id}>
                                    {degree.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.degree_id} className="mt-2" />


                    </div>

                    <div className="col-span-3">
                        <InputLabel htmlFor="min_experience_years" />
                        <select
                            id="Minimum Experience"
                            name="Minimum Experience"
                            value={data.min_experience_years}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            onChange={(e) => setData("min_experience_years", e.target.value)}
                        >
                            <option value="">Experience Level</option>
                            <option value="1">Entry Level</option>
                            <option value="3" >Intermediate  Level</option>
                            <option value="5">Expert Level</option>

                        </select>
                        <InputError message={errors.min_experience_years} className="mt-2" />
                    </div>


                    {/* Salary and Experience Fields */}


                </div>

                <div className="mt-3 grid grid-cols-9 gap-3">


                    <div className="col-span-3">
                        <InputLabel htmlFor="min_salary" value="Minimum Salary" />
                        <TextInput
                            id="min_salary"
                            name="min_salary"
                            placeholder="₱ 20,000"
                            value={data.min_salary}
                            className="mt-1 block w-full"
                            onChange={(e) => setData("min_salary", e.target.value)}
                        />
                        <InputError message={errors.min_salary} className="mt-2" />
                    </div>
                    <div className="col-span-3">
                        <InputLabel htmlFor="max_salary" value="Maximum Salary" />
                        <TextInput
                            id="max_salary"
                            name="max_salary"
                            placeholder="₱ 50,000"
                            value={data.max_salary}
                            className="mt-1 block w-full"
                            onChange={(e) => setData("max_salary", e.target.value)}
                        />
                        <InputError message={errors.max_salary} className="mt-2" />
                    </div>

                </div>

                {/* Skills and Requirements Search and Selection */}
                <div className="col-span-9 grid grid-cols-9 gap-3">
                    {/* Skills Search */}
                    <div className="col-span-3 relative">
                        <InputLabel htmlFor="skills" value="Search Skills" />
                        <input
                            type="text"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            value={searchSkill}
                            onChange={handleSearchSkillChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const skillName = searchSkill.trim();
                                    const exists = skills.some(
                                        (s) => s.skill_name.toLowerCase() === skillName.toLowerCase()
                                    );
                                    const alreadySelected =
                                        (data?.skills ?? []).some(
                                            (id) =>
                                                (skills ?? []).find((s) => s.skill_id === id)?.skill_name.toLowerCase() === skillName.toLowerCase()
                                        ) || customSkills.includes(skillName);

                                    if (skillName && !exists && !alreadySelected) {
                                        setCustomSkills((prev) => [...prev, skillName]);
                                        setSearchSkill('');
                                    }
                                }
                            }}
                            placeholder="Search or add new skill"
                        />
                        {searchSkill && (
                            <div className="mt-2  bg-white border border-gray-300 rounded-md shadow-lg w-64 max-h-60 overflow-y-auto z-10">
                                {filteredSkills.slice(0, 5).map((skill) => (
                                    <div
                                        key={skill.skill_id}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleSelectSkill(skill)}
                                    >
                                        {skill.skill_name}
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2">
                            {/* Existing selected skills from dropdown */}
                            {(data?.skills ?? []).map((skillId) => {
                                const skill = (skills ?? []).find((s) => s.skill_id === skillId);
                                return skill ? (
                                    <span
                                        key={`existing-${skill.skill_id}`}
                                        className="inline-block bg-gray-200 rounded px-2 py-1 mr-2 cursor-pointer"
                                        onClick={() => handleRemoveSkill(skill.skill_id)}
                                    >
                                        {skill.skill_name} &times;
                                    </span>
                                ) : null;
                            })}

                            {/* Custom added skills (manually typed) */}
                            {customSkills.map((skill, index) => (
                                <span
                                    key={`custom-${index}`}
                                    className="inline-block bg-gray-200 rounded px-2 py-1 mr-2 cursor-pointer"
                                    onClick={() =>
                                        setCustomSkills((prev) => prev.filter((_, i) => i !== index))
                                    }
                                >
                                    {skill} &times;
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Requirements Search */}
                    <div className="col-span-3 relative">
                        <InputLabel htmlFor="requirements" value="Search Requirements" />
                        <input
                            type="text"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            value={searchRequirement}
                            onChange={handleSearchRequirementChange}
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
                        {searchRequirement && (
                            <div className="mt-2 bg-white border border-gray-300 rounded-md shadow-lg w-64 max-h-60 overflow-y-auto z-10">
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
                        {/* Display selected requirements */}
                        <div className="mt-2">
                            {(data?.requirements ?? []).map((reqId) => {
                                const req = (requirements ?? []).find((r) => r.requirement_id === reqId);
                                return req ? (
                                    <span
                                        key={req.requirement_id}
                                        className="inline-block bg-gray-200 rounded px-2 py-1 mr-2 cursor-pointer"
                                        onClick={() => handleRemoveRequirement(req.requirement_id)}
                                    >
                                        {req.requirement_name} &times;
                                    </span>
                                ) : null;
                            })}

                            {customRequirements.map((requirement, index) => (
                                <span
                                    key={`custom-${index}`}
                                    className="inline-blocka bg-gray-200 rounded px-2 py-1 mr-2 cursor-pointer"
                                    onClick={() =>
                                        setCustomRequirements((prev) => prev.filter((_, i) => i !== index))
                                    }
                                >
                                    {requirement} &times;
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center w-full">
                    <PrimaryButton
                        type="submit"
                        className="mt-4 py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md"
                    >
                        Create Job Post
                    </PrimaryButton>
                </div>

            </form>
        </div>
    );
}
