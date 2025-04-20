import { useState, useEffect, useCallback } from "react";
import { router } from '@inertiajs/react';
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import debounce from "lodash.debounce";
import { usePage } from "@inertiajs/react";
import Chip from "@/Components/Chip";

function UpdateSkills({ className }) {
    const { props } = usePage();
    const user_skills = props.user_skills || [];

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

    const handleDeleteButton = (skill_id) => {
        router.delete(route('user-skills.destroy', skill_id), {
            preserveScroll: true,
            onSuccess: () => {
                console.log("deleted successfully");
            },
            onError: (error) => {
                console.log("An error occur: ", error);
            }
        });
    }

    return (
        <section className={className}>
            <header>
                <div className="w-full">
                    <h2 className="text-lg font-medium text-gray-900">Skills</h2>
                    <p className="mt-1 text-sm text-gray-600">Update your skills</p>
                </div>
                <hr className="w-full mt-3 mb-3" />
            </header>

            <div className="relative w-full">
                <TextInput
                    className="mt-1 block w-full"
                    placeholder="Search Skills"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                {loading && (
                    <div className="absolute right-3 top-3">
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                    </div>
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
            </div>

            {adding && (
                <p className="text-sm text-gray-500 mt-2">Adding skill...</p>
            )}

            {error && (
                <p className="text-sm text-red-500 mt-2">{error}</p>
            )}
            <div className="flex gap-2 mt-4">
                {user_skills.length !== 0 ? (
                    user_skills.map((skill) => (
                        <Chip key={skill.id} className="min-w-10">
                            <div className="flex items-center justify-between w-full">
                                <p className="text-left flex-grow truncate">{skill.skill_name}</p>
                                <button
                                    className="text-gray-400 ml-2 flex-shrink-0"
                                    onClick={() => handleDeleteButton(skill.id)}
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        </Chip>
                    ))
                ) : (
                    <div className="flex items-center justify-center my-6 w-full">no skill specified</div>
                )}
            </div>
        </section >
    );
}

export default UpdateSkills;

