export default function PrimaryButton({
    className = '',
    disabled,
    href,
    children,
    ...props
}) {
    return (
        <a
            href={href}
            {...props}
            className={
                ` bg-primary text-white px-4 py-2 rounded-md border hover:border-primary hover:bg-light hover:text-primary transition ${disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </a>
    );
}
