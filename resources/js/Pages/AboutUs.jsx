import ContentLayout from "@/Layouts/ContentLayout";
import MainPageLayout from "@/Layouts/MainPageLayout";

export default function AboutUs() {
    return (
        <MainPageLayout
            header={
                <ContentLayout>
                    <p className="text-4xl font-medium flex item-center justify-center mt-3">About Us</p>
                    <p className='mt-10 flex item-center justify-center text-justify'>
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
                </ContentLayout>
            }
        >

        </MainPageLayout>
    );
}
