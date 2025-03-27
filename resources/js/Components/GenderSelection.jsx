import Checkbox from "./Checkbox";
import InputLabel from '@/Components/InputLabel';

export default function GenderSelection({ className }) {
    return (
        <div className={`grid grid-cols-3 mt-2 ${className}`} >
            <Checkbox className="col-span-1" label="Male" />
            <Checkbox className="col-span-1" label="Female" />
            <Checkbox className="col-span-1" label="Others" />
        </div >
    );
}
