import NavBar from "@/Components/NavBar"

export default function MainPageLayout({ header, children }) {
    return (
        <div>
            <NavBar />

            {header && (
                <header>
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <div class="text-red">{children}</div>
        </div>
    );
}
