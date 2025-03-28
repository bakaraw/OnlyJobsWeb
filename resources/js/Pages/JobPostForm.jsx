import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";

export default function JobPostForm({
                                        universities = [],
                                        certificates = [],
                                        skills = []
                                    }) {
    // Form state matching exact validation rules
    const [form, setForm] = useState({
        job_title: "",
        job_description: "",
        job_location: "",
        job_type: "",
        min_salary: "",
        max_salary: "",
        min_experience_years: "",
        university_name: "",
        certificate_id: "",
        skills: []
    });

    // State for university search
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    // Handle general input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };


    // Handle skill selection (multi-select)
    const handleSkillChange = (e) => {
        const selectedSkills = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        );
        setForm({ ...form, skills: selectedSkills });
    };

    // University search function
    const handleUniversitySearch = async (searchQuery) => {
        const trimmedQuery = searchQuery.trim();
        if (!trimmedQuery) {
            setSearchResults([]);
            return;
        }

        try {
            const response = await fetch(`http://universities.hipolabs.com/search?name=${trimmedQuery}`);
            const data = await response.json();

            const limitedResults = data.slice(0, 10).map((university) => ({
                name: university.name
            }));

            setSearchResults(limitedResults);
        } catch (error) {
            console.error("Error fetching universities:", error);
            setSearchResults([]);
        }
    };

    // Debounce university search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm) {
                handleUniversitySearch(searchTerm);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    // Select a university from search results
    const handleSelectUniversity = (name) => {
        setForm({ ...form, university_name: name });
        setSearchTerm(name);
        setSearchResults([]);
    };

    // Form submission handler
    const handleSubmit = (e) => {
        e.preventDefault();
        router.post("/job/store", form);
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Create Job Post</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Job Title */}
                <div>
                    <label className="block text-sm font-medium">Job Title</label>
                    <input
                        type="text"
                        name="job_title"
                        value={form.job_title}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                {/* Job Description */}
                <div>
                    <label className="block text-sm font-medium">Job Description</label>
                    <textarea
                        name="job_description"
                        value={form.job_description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                {/* Job Location */}
                <div>
                    <label className="block text-sm font-medium">Job Location</label>
                    <input
                        type="text"
                        name="job_location"
                        value={form.job_location}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                {/* Job Type */}
                <div>
                    <label className="block text-sm font-medium">Job Type</label>
                    <select
                        name="job_type"
                        value={form.job_type}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">Select Job Type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                    </select>
                </div>

                {/* Salary Range */}
                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label className="block text-sm font-medium">Minimum Salary</label>
                        <input
                            type="number"
                            name="min_salary"
                            value={form.min_salary}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-sm font-medium">Maximum Salary</label>
                        <input
                            type="number"
                            name="max_salary"
                            value={form.max_salary}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                </div>

                {/* Minimum Experience */}
                <div>
                    <label className="block text-sm font-medium">Minimum Experience (Years)</label>
                    <input
                        type="number"
                        name="min_experience_years"
                        value={form.min_experience_years}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                {/* University Search */}
                <div className="relative">
                    <label className="block text-sm font-medium">University Name</label>
                    <input
                        type="text"
                        name="university_name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Search for a university..."
                    />
                    {searchResults.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border mt-1 max-h-40 overflow-y-auto">
                            {searchResults.map((uni, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSelectUniversity(uni.name)}
                                    className="p-2 cursor-pointer hover:bg-gray-200"
                                >
                                    {uni.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Certificate Selection */}
                <div>
                    <label className="block text-sm font-medium">Certificate</label>
                    <select
                        name="certificate_id"
                        value={form.certificate_id}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select Certificate</option>
                        {certificates.map((cert) => (
                            <option key={cert.id} value={cert.id}>
                                {cert.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Skills Selection */}
                <div>
                    <label className="block text-sm font-medium">Skills</label>
                    <select
                        multiple
                        name="skills"
                        value={form.skills}
                        onChange={handleSkillChange}
                        className="w-full p-2 border rounded"
                    >
                        {skills.map((skill) => (
                            <option key={skill.id} value={skill.id}>
                                {skill.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition duration-300"
                >
                    Create Job Post
                </button>
            </form>
        </div>
    );
}

