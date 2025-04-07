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
            className={
                ` bg-primary text-white px-4 py-2 rounded-md border hover:border-primary hover:bg-light hover:text-primary transition ${disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            <div className="flex items-center justify-between">
                {disabled ? <div class="w-6 h-6 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div> : <></>}
                {children}
            </div>
        </button>
    );
}
