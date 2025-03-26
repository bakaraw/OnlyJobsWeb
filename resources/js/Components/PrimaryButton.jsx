export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <a
            {...props}
            className={
                ` bg-primary text-white px-4 py-2 rounded-md hover:bg-light hover:text-dark transition ${disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </a>
    );
}
