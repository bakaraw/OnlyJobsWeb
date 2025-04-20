export default function Chip({ children, className }) {
    return (
        <div className={"px-12 py-1 rounded-full bg-secondary " + className}>
            {children}
        </div>
    );

}
