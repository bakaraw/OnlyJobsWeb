export default function Checkbox({ label, className = '', ...props }) {
    return (
        <label className="flex items-center space-x-2 cursor-pointer">
            <input
                {...props}
                type="checkbox"
                className={'rounded border-gray-300 text-dark shadow-sm focus:ring-dark ' + className}
            />
            <span className="text-gray-700 font-light">{label}</span>
        </label>
    );
}
