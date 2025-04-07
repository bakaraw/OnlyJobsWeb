import Chip from "./Chip";
import SecondaryButton from "./SecondaryButton";

export default function JobCard({ job }) {
    if (!job) return <p>Error: Job data is missing.</p>;

    const { id, job_title = "N/A", job_type = "N/A",
        job_description = "N/A", job_location = "N/A",
        company = "", created_at = "N/A", skills = [], requirements = [], } = job;

<<<<<<< HEAD
    const handleClick = () => {
        // Handle click event, e.g., navigate to job details page
        console.log(`Job ID: ${id}`);
    }
    return (
        <div
            onClick={handleClick}
            className="cursor-pointer border p-4 rounded shadow hover:shadow-lg transition"
        >
=======
    const handleClick = async () => {

        try {
            await axios.post(`/job_posts/${id}/increment_views`);
            console.log(`View incremented for Job ID: ${id}`);
        } catch (error) {
            console.error("Error incrementing view:", error);
        }
    };

    return (

>>>>>>> main
        <a>


            <div className="grid grid-cols-6 gap-2">
                <div className="col-span-5">
                    <div className="flex flex-col px-4 py-2">
                        <p className="text-gray-500 font-light text-md">
                            Posted {new Date(created_at).toLocaleDateString("en-US", {
                                month: "long",
                                day: "2-digit",
                                year: "numeric",
                            })}
                        </p>
                        <h1 className="font-bold text-2xl mt-2">{job_title || "Job Title Not Available"}</h1>
                        <h1 className="font-bold text-sm mt-2">{company || "Job Title Not Available"}</h1>

                        <h2 className="font-light text-gray-500 text-md">{job_type || "Job Type Not Specified"} - {job_location || "Location Unknown"}</h2>
                        <p className="line-clamp-2">{job_description || "No job description available."}</p>
                        Skills Required:
                        <div className="flex gap-2 mt-4">
                            {skills.length > 0
                                ? skills.map((skill, index) => <Chip key={index}>{skill.skill_name}</Chip>)
                                : <Chip>No Skills Listed</Chip>}
                        </div>

                        {
                            //    Requirements:
                            //
                            <div className="flex gap-2 mt-4">
                               {requirements.length > 0
                                   ? requirements.map((requirement, index) => <Chip key={index}>{requirement.requirement_name}</Chip>)
                                   : <Chip>No Requirement posted</Chip>}
                            </div>
                        }
                    </div>
                </div>


<<<<<<< HEAD
                <div className="col-span-1 px-4 py-2 flex items-center justify-center h-full" >
=======
                <div onClick={handleClick}   className="col-span-1 px-4 py-2 flex items-center justify-center h-full" >
>>>>>>> main
                    <SecondaryButton className="justify-center"> View Job </SecondaryButton>
                </div>

            </div>
            <div className="px-4 py-2">
                <hr className="w-full border-t-1 border-gray-300 my-4" />
            </div>
        </a>
        </div>
    );


}
