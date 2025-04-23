export default function Chip({ children, className, ...props }) {
    return (
        <div
            className={"px-12 py-1 rounded-full bg-secondary " + className}
            {...props}
        >
            {children}
        </div>
    );

}
