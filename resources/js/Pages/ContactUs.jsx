import ContentLayout from "@/Layouts/ContentLayout";
import MainPageLayout from "@/Layouts/MainPageLayout";
import { useState } from "react";
import MessageButton from "@/Components/MessageButton";

export default function ContactUs() {
    const [showMessages, setShowMessages] = useState(false);

    return (
        <MainPageLayout
            header={
                <ContentLayout>
                    <p className="text-3xl">Contact Us</p>
                </ContentLayout>
            }
        >
            <MessageButton
                show={showMessages}
                onClick={() => setShowMessages(true)}
                onClose={() => setShowMessages(false)}
            />
        </MainPageLayout>
    );
}
