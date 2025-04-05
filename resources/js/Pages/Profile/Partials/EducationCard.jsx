import DangerButton from "@/Components/DangerButton";
import SecondaryButton from "@/Components/SecondaryButton";

export default function EducationCard({ className, id, educationLevel, school, degree, startYear, endYear }) {
    return (
        <div className={"grid grid-cols-12 gap-3 " + className}>
            <div className="col-span-2">
                {educationLevel}
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
                    <SecondaryButton className="mr-3">Edit</SecondaryButton>
                    <DangerButton>Delete</DangerButton>
                </div>
            </div>
            <div className="col-span-12">
                <hr className="block w-full items-center justify-center" />
            </div>
        </div >
    );
}
