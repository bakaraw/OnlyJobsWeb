import Chip from "./Chip";
import SecondaryButton from "./SecondaryButton";
import { Inertia } from '@inertiajs/inertia';
import PrimaryButton from "./PrimaryButton";
import { router } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import { formatDistanceToNow } from 'date-fns';

export default function JobCard({ job, children }) {
    if (!job) return <p>Error: Job data is missing.</p>;

    const { id, job_title = "N/A", job_type = "N/A",
        job_description = "N/A", job_location = "N/A",
        company = "", created_at = "N/A", skills = [], requirements = [], } = job;

    return (
        <Link
            onClick={async (e) => {
                e.preventDefault();
                await axios.post(`/job_posts/${job.id}/increment_views`);
                console.log(`View incremented for Job ID: ${job.id}`);
                router.visit(route('job.view', job.id));
            }}
        >
            <div className="rounded-xl flex flex-col md:flex-row gap-4 p-4">
                {/* Job Information */}
                <div className="flex-1">
                    <div className="flex flex-col">
                        <p className="text-gray-500 font-light text-sm">
                            Posted {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
                        </p>

                        <h1 className="font-bold text-xl md:text-2xl mt-2">{job_title || "Job Title Not Available"}</h1>
                        <h2 className="text-sm md:text-md">{company || "Company Not Available"}</h2>

                        <p className="font-light text-gray-500 text-sm md:text-md mt-2">
                            {job_type || "Job Type Not Specified"} - <i className="fa-solid fa-location-dot"></i> {job_location || "Location Unknown"}
                        </p>

                        <p className="line-clamp-2 text-sm md:text-base mt-1">{job_description || "No job description available."}</p>

                        <div className="mt-4 overflow-x-auto hide-scrollbar fade-right">
                            <div className="flex gap-2 w-max pr-4">
                                {skills.length > 0
                                    ? skills.map((skill, index) => <Chip key={index}>{skill.skill_name}</Chip>)
                                    : <Chip>No Skills Listed</Chip>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Button */}
                <div className="flex items-center justify-center md:justify-end">
                    <PrimaryButton
                        onClick={async (e) => {
                            e.preventDefault();
                            await axios.post(`/job_posts/${job.id}/increment_views`);
                            console.log(`View incremented for Job ID: ${job.id}`);
                            router.visit(route('job.view', job.id));
                        }}
                    >See More</PrimaryButton>
                </div>
            </div>

            <div className="px-4 py-2">
                <hr className="w-full border-t border-gray-300 my-4" />
            </div>
        </Link>
    );


}
