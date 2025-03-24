import NavBar from "@/Components/NavBar"

export default function MainPageLayout({ children }) {
    return (
        <div>
            <NavBar />
            <div class="text-red">{children}</div>
        </div>
    );
}
