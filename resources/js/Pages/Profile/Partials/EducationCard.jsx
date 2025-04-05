import DangerButton from "@/Components/DangerButton";
import SecondaryButton from "@/Components/SecondaryButton";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/inertia-react";
import { useState } from "react";

export default function EducationCard({ className, id, educationLevel, school, degree, startYear, endYear, attachedFile }) {
    let eduLevel = '';

    switch (educationLevel) {
        case "college":
            eduLevel = "College";
            break;
        case "junior_high":
            eduLevel = "Junior High School";
            break;
        case "senior_high":
            eduLevel = "Senior High School";
            break;
        case "elementary":
            eduLevel = "Elementary";
            break;
        default:
            eduLevel = "Unknown Education Level";
            break;
    }

    const { data, setData, post, processing, errors, reset } = useForm({
        education_level: educationLevel,
        school: school,
        degree: degree,
        start_year: startYear,
        end_year: endYear,
        attached_file: attachedFile
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="4xl">
                <form>
                    <header>
                    </header>
                    <div className="grid grid-cols-6 gap-3">
                        <div className="col-span-1">
                            <InputLabel htmlFor="wow" value="Education Level" />
                            <select
                                className='w-full rounded-md border-gray-300 shadow-sm focus:border-dark focus:ring-gray-500 mt-1'
                                value={data.education_level}
                                onChange={(e) => setData('education_level', e.target.value)}
                            >
                                <option value="college">College</option>
                                <option value="senior_high">Senior High</option>
                                <option value="junior_high">Junior High</option>
                                <option value="elementary">Elementary</option>
                            </select>
                            <InputError
                                message={errors.education_level}
                                className="mt-2"
                            />
                        </div>
                        <div className="col-span-3">
                            <InputLabel htmlFor="wow" value="School/University" />
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
                            {
                                //showSuggestions && universities.length > 0 && (
                                //    <ul className="absolute z-10 min-w-60 bg-white border rounded-md shadow-lg mt-1 overflow-y-auto">
                                //        {universities.map((uni) => (
                                //            <li
                                //                key={uni.name}
                                //                onClick={() => handleSelect(uni.name)}
                                //                className="p-2 hover:bg-gray-200 cursor-pointer"
                                //            >
                                //                {uni.name}
                                //            </li>
                                //        ))}
                                //    </ul>
                                //)
                            }
                            <InputError message={errors.school} className="mt-2" />
                        </div>
                        <div className="col-span-1">
                            otin
                        </div>
                        <div className="col-span-1">
                            otin
                        </div>
                    </div>
                </form>
            </Modal>

            <div className={"grid grid-cols-12 gap-3 " + className}>
                <div className="col-span-2">
                    {eduLevel}
                </div>
                <div className="col-span-3">
                    {school}
                </div>
                <div className="col-span-3">
                    {degree === null ? 'N/A' : degree}
                </div>
                <div className="col-span-2">
                    {startYear} - {endYear}
                </div>
                <div className="col-span-2">
                    <div className="flex items-center justify-center">
                        <SecondaryButton onClick={() => setIsModalOpen(true)} className="mr-3">Edit</SecondaryButton>
                        <DangerButton>Delete</DangerButton>
                    </div>
                </div>
                <div className="col-span-12">
                    <hr className="block w-full items-center justify-center" />
                </div>
            </div >
        </>
    );
}
