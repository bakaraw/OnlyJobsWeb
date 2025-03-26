import NavBar from "@/Components/NavBar"
import { usePage, Head } from "@inertiajs/react"; // Import Link for navigation
import ContentLayout from "./ContentLayout";

export default function MainPageLayout({ header, children }) {
    const { url } = usePage();
    var currentPage = url.split('/')[1]
    var pageName = '';

    switch (currentPage) {
        case '':
            pageName = 'Home'
            break;
        case 'find_work':
            pageName = 'Find Work';
            break;
        case 'about_us':
            pageName = 'About Us';
            break;
        case 'contact_us':
            pageName = 'Contact Us';
            break;
        default:
            pageName = 'Page not found';
            break;
    }

    return (
        <>
            <Head title={pageName} />
            <div>

                <NavBar />

                {header && (
                    <header>
                        <ContentLayout>
                            {header}
                        </ContentLayout>
                    </header>
                )}
                <ContentLayout>
                    {children}
                </ContentLayout>
            </div>
        </>
    );
}
