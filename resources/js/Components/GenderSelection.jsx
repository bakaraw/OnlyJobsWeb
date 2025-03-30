import Checkbox from "./Checkbox";

export default function GenderSelection({ value, onChange, className }) {
    return (
        <div className={`grid grid-cols-3 mt-2 ${className}`} >
            <Checkbox checked={value === 'male'} onChange={() => onChange('male')} className="col-span-1" label="Male" />
            <Checkbox checked={value === 'female'} onChange={() => onChange('female')} className="col-span-1" label="Female" />
            <Checkbox checked={value === 'others'} onChange={() => onChange('others')} className="col-span-1" label="Others" />
        </div >
    );
}
