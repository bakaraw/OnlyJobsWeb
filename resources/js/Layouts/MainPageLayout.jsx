import NavBar from "@/Components/NavBar"
import { usePage, Head } from "@inertiajs/react"; // Import Link for navigation

export default function MainPageLayout({ header, children }) {
    const { url } = usePage();
    var currentPage = url.split('/')[1]
    var pageName = '';

    switch (currentPage) {
        case '':
            pageName = 'Home'
            break;
        case 'findwork':
            pageName = 'Find Work';
            break;
        case 'aboutus':
            pageName = 'About Us';
            break;
        case 'contactus':
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
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                <div className="">{children}</div>
            </div>
        </>
    );
}
