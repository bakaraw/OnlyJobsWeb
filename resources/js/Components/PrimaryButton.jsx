export default function PrimaryButton({
    className = '',
    disabled,
    href,
    children,
    ...props
}) {
    return (
        <button
            href={href}
            {...props}
            disabled={disabled}
            className={
                `bg-primary text-white px-4 py-2 rounded-md transition ${disabled
                    ? 'opacity-25 cursor-not-allowed'
                    : 'hover:border-primary hover:bg-light hover:text-primary'
                } ` + className
            }
        >
            <div className="flex items-center justify-between">
                {disabled ? (
                    <div className="w-6 h-6 mr-3 border-4 border-t-transparent border-white border-solid rounded-full animate-spin"></div>
                ) : null}
                {children}
            </div>
        </button>
    );
}

