import ContentLayout from "@/Layouts/ContentLayout";
import MainPageLayout from "@/Layouts/MainPageLayout";

export default function ContactUs() {

    return (
        <MainPageLayout
            header={
                <ContentLayout>
                    <p className="text-3xl">Contact Us</p>
                    <p className='mt-3'>Yawards</p>
                </ContentLayout>
            }
        >
        </MainPageLayout>
    );
}
