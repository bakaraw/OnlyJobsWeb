import Chip from "./Chip";
import SecondaryButton from "./SecondaryButton";

export default function JobCard({ jobTitle, jobType }) {
    return (
        <>
            <div className="grid grid-cols-6 gap-2">
                <div className="col-span-5">
                    <div className="flex flex-col px-4 py-2">
                        <p className="text-gray-500 font-light text-md">Posted 17 hours ago</p>
                        <h1 className="font-bold text-2xl mt-2">Welder Job Hiring in Albania for Recruit Plus</h1>
                        <h2 className="font-light text-gray-500 text-md">1 Year Experience - Full Time - Albania</h2>
                        <p className="line-clamp-2">Are you ready to embark on an exciting career adventure? We are thrilled to announce multiple job openings in the beautiful country of Albania, offering incredible opportunities for growth and development</p>
                        <div className="flex gap-2 mt-4">
                            <Chip>Welder</Chip>
                            <Chip>Pipe Welder</Chip>
                        </div>
                    </div>
                </div>
                <div className="col-span-1 px-4 py-2 flex items-center justify-center h-full">
                    <SecondaryButton className="justify-center"> View Job </SecondaryButton>
                </div>
                <div className="text-black"><br /></div>
            </div>
        </>
    );


}
