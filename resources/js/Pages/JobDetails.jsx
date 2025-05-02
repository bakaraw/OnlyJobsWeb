import React, {useEffect, useState} from "react";
import SecondaryButton from "@/Components/SecondaryButton.jsx";


import axios from "axios";
import ApplicantsSection from "../Components/Dashboard/Modal/ApplicantsSection.jsx";
import InputLabel from "@/Components/InputLabel.jsx";
import InputError from "@/Components/InputError.jsx";

export default function JobDetails({ job_details, applicants, degrees }) {
    const {
        job_title = "N/A",
        job_type = "N/A",
        job_description = "N/A",
        job_location = "N/A",
        company = "",
        views = 'N/A',
        salary_type = "",
        min_salary = "",
        max_salary = "",
        min_experience_years = "",
        requirements = [],
        skills = [],
        status = null,


    } = job_details;

    console.log('sd', job_details)
    console.log('sd', job_details.degree)
    console.log('sst', job_details.status)

    const [isEditing, setIsEditing] = useState(false);

    const [form, setForm] = useState({
        job_title: job_details.job_title || "N/A",
        job_type: job_details.job_title || "N/A",
        job_description: job_details.job_description || "N/A",
        job_location: job_details.job_location || "N/A",
        company: job_details.company || "N/A",
        salary_type: job_details.salary_type || "N/A",
        min_salary: job_details.min_salary || "N/A",
        max_salary: job_details.max_salary || "N/A",
        min_experience_years: job_details.min_experience_years || "N/A",
        requirements: job_details.requirements || [],
        degree_id: job_details.degree_id || "1",
        skills: job_details.skills || [],
        status: job_details.status || "N/A"
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {

            const payload = {
                job_title: form.job_title,
                job_type: form.job_type,
                job_description: form.job_description,
                job_location: form.job_location,

                company: form.company,
                salary_type: form.salary_type,
                min_salary: form.min_salary,
                max_salary: form.max_salary,
                min_experience_years: form.min_experience_years,
                requirements: form.requirements,
                skills: form.skills,
                status: form.status

            };
            const res = await axios.patch(
                '/job-posts/{$job_details.id}',
                payload
            );

            if (res.data.sucess) {
                setIsEditing(false);
            }
        } catch (err) {
            alert("Error updating job details");
        }

    };

    return (
        <div>
            {isEditing ? (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">{job_title}</h2>
                        <SecondaryButton
                            className="px-4 py-2  black-white rounded "
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            Edit
                        </SecondaryButton>
                    </div>



                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div >
                            <div className="mb-4">
                                <label className="font-semibold">Company: </label>
                                <input
                                    type="text"
                                    name="company"
                                    value={form.company}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-md px-3 py-2 w-1/4"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="font-semibold">Location: </label>
                                <input
                                    type="text"
                                    name="job_location"
                                    value={form.job_location}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-md px-3 py-2 w-1/4"
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

                            </div>
                        </div>



                    <div className="flex justify-end mt-4">
                        <div className="w-full mb-6">
                            <label className="font-semibold">Job Description: </label>
                            <textarea
                                name="job_description"
                                value={form.job_description}
                                onChange={handleChange}
                                className="mt-1 block w-full h-40 p-2 border border-gray-500 rounded-md align-top"/>
                        </div>
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
                    </div>



                </>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">{job_title}</h2>
                        <SecondaryButton
                            className="px-4 py-2 black-white rounded"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </SecondaryButton>
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
                                    {salary_type === 'Range'
                                        ? `$${min_salary.toLocaleString()} - $${max_salary.toLocaleString()}`
                                        : `$${min_salary.toLocaleString()}`
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

                            {status && (
                                <div className="mb-4">
                                    <p className="font-semibold">Status:</p>
                                    <p className="text-gray-600">{job_details.status?.name || 'N/A'}</p>
                                </div>
                            )}

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
