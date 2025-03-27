import { useState } from "react";
import Checkbox from "./Checkbox";
import InputLabel from '@/Components/InputLabel';

export default function GenderSelection({ className }) {
    const [gender, setGender] = useState('')

    return (
        <div className={`grid grid-cols-3 mt-2 ${className}`} >
            <Checkbox checked={gender === 'Male'} onChange={() => setGender('Male')} className="col-span-1" label="Male" />
            <Checkbox checked={gender === 'Female'} onChange={() => setGender('Female')} className="col-span-1" label="Female" />
            <Checkbox checked={gender === 'Others'} onChange={() => setGender('Others')} className="col-span-1" label="Others" />
        </div >
    );
}
