import ContentLayout from "@/Layouts/ContentLayout";
import MainPageLayout from "@/Layouts/MainPageLayout";

export default function AboutUs() {
    return (
        <MainPageLayout
            header={
                <ContentLayout>
                    <p className="text-3xl">About Us</p>
                    <p className='mt-3'>Yawards</p>
                </ContentLayout>
            }
        >

        </MainPageLayout>
    );
}
