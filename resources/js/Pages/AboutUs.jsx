import ContentLayout from "@/Layouts/ContentLayout";
import MainPageLayout from "@/Layouts/MainPageLayout";
import { useState } from "react";
import MessageButton from "@/Components/MessageButton";
import PrimaryButton from "@/Components/PrimaryButton";
import { router, usePage } from "@inertiajs/react";
import { useEffect } from "react";

export default function AboutUs() {
    const [showMessages, setShowMessages] = useState(false);
    const { filters } = usePage().props;
    const [search, setSearch] = useState("");

    useEffect(() => {
        setSearch(filters?.search || '');
    }, [filters?.search]);

    return (
        <MainPageLayout
            header={
                <ContentLayout>
                    <p className="text-4xl font-medium flex items-center justify-center mt-3">About Us</p>
                </ContentLayout>
            }
        >

            <p className=' flex item-center justify-center text-justify'>
                Confederal Project Manpower Services Inc. is a premier Philippine-based recruitment agency established in 2003. With nearly two decades of expertise, we specialize in connecting skilled Filipino workers to land-based employment opportunities abroad. Our commitment to excellence is reflected in our strong reputation for bridging career aspirations with global opportunities.
                To better serve our community, we expanded our operations in 2019 by opening a branch in Davao. This expansion ensures we can connect more Filipinos, especially those from southern regions, with meaningful international job opportunities.
            </p>
            <hr className="w-full border-t-1 border-gray-300 mt-10" />
            <div className="grid grid-cols-2 gap-3">
                <div className="col-span-1 py-10 p-4">
                    <div>
                        <p className="text-2xl font-medium mb-3">Our Mission</p>
                        <p>
                            To be the preferred partner in manpower services by providing reliable, tailored, and professional recruitment solutions that empower both employers and Filipino job seekers. We are committed to fostering career growth, organizational success, and long-term partnerships built on integrity and excellence.
                        </p>
                    </div>
                </div>
                <div className="col-span-1 py-10 p-4">
                    <div className="">
                        <p className="text-2xl font-medium mb-3">Our Vision</p>
                        <p>To become a leading global recruitment agency recognized for bridging skilled Filipino talent with esteemed employers worldwide, driving economic empowerment, and contributing to the personal and professional development of individuals through exceptional manpower solutions.</p>
                    </div>
                </div>
            </div>
            <hr className="w-full border-t-1 border-gray-300 mt-10" />
            <div className="py-10 p-4 flex flex-col items-center justify-start">
                <p className="text-2xl font-medium mb-3">What We Offer</p>
                <p className="mt-3">Our innovative online job-matching platform redefines recruitment by:</p>
                <ul className="mt-3 list-disc pl-5">
                    <li>Delivering personalized job recommendations based on skills and preferences</li>
                    <li>Streamlining the application process with digital document management</li>
                    <li>Enhancing employer access to qualified candidates for faster and better hiring</li>
                </ul>
            </div>
            <hr className="w-full border-t-1 border-gray-300 mt-10" />
            <div className="py-10 p-4 flex flex-col items-center justify-start">
                <p className="text-2xl font-medium mb-3">Why Choose Us</p>
                <ul className="mt-3 list-disc pl-5">
                    <li>Proven Experetise: Trusted by Filipino workers and global employers since 2003.</li>
                    <li>Regional Reach: A strong presence in Manila and Davao</li>
                    <li>Commitment to Innovation: Continuously evolving to meet the demands of a digital world</li>
                </ul>
            </div>
            <hr className="w-full border-t-1 border-gray-300 mt-10" />
            <div className="py-10 p-4 flex flex-col items-center justify-center">
                <p className="text-4xl font-black mb-3">Join Us</p>
                <div className="w-[720px] text-justify">
                    Whether you are a job seeker looking for your next career opportunity or an employer searching for top talent, Confederal Project Manpower Services Inc. is here to help. Explore the possibilities with us and take the next step in your journey today.
                </div>
                <PrimaryButton
                    className="mt-5"
                    onClick={() => {
                        router.get('/find_work', {
                            ...filters,
                            search: search.trim(),
                        });

                    }}
                >
                    Start your Journey
                </PrimaryButton>
            </div>

            <MessageButton
                show={showMessages}
                onClick={() => setShowMessages(true)}
                onClose={() => setShowMessages(false)}
            />
        </MainPageLayout>
    );
}
