import { useState, useEffect } from "react";

export default function BirthdayInput({ value, onChange }) {
    const [year, setYear] = useState("2025");
    const [month, setMonth] = useState("January");
    const [day, setDay] = useState("1");

    // Generate years dynamically (e.g., last 100 years)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    const months = [
        { name: "January", days: 31, num: "01" },
        { name: "February", days: 28, num: "02" },
        { name: "March", days: 31, num: "03" },
        { name: "April", days: 30, num: "04" },
        { name: "May", days: 31, num: "05" },
        { name: "June", days: 30, num: "06" },
        { name: "July", days: 31, num: "07" },
        { name: "August", days: 31, num: "08" },
        { name: "September", days: 30, num: "09" },
        { name: "October", days: 31, num: "10" },
        { name: "November", days: 30, num: "11" },
        { name: "December", days: 31, num: "12" },
    ];

    const getDaysInMonth = (month, year) => {
        if (!month || !year) return 31;
        if (month === "February") {
            const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
            return isLeapYear ? 29 : 28;
        }
        return months.find(m => m.name === month)?.days || 31;
    };

    const [days, setDays] = useState([]);

    useEffect(() => {
        if (month && year) {
            const daysInMonth = getDaysInMonth(month, year);
            setDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));
            if (parseInt(day, 10) > daysInMonth) setDay("1");
        }
    }, [month, year]);

    // Trigger onChange when the user selects a value
    useEffect(() => {
        if (onChange) {
            const monthNum = months.find(m => m.name === month)?.num || "01";
            const formattedDate = `${year}-${monthNum}-${day.padStart(2, "0")}`;
            onChange(formattedDate);
        }
    }, [year, month, day]); // Runs only when the date changes

    return (
        <div className="grid grid-cols-7 gap-3">
            {/* Month Dropdown */}
            <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="border-gray-300 rounded p-2 col-span-3"
            >
                {months.map(m => (
                    <option key={m.name} value={m.name}>
                        {m.name}
                    </option>
                ))}
            </select>

            {/* Day Dropdown */}
            <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="border-gray-300 rounded p-2 col-span-2"
                disabled={!month || !year}
            >
                {days.map(d => (
                    <option key={d} value={String(d)}>
                        {d}
                    </option>
                ))}
            </select>

            {/* Year Dropdown */}
            <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="border-gray-300 rounded p-2 col-span-2"
            >
                {years.map(y => (
                    <option key={y} value={String(y)}>
                        {y}
                    </option>
                ))}
            </select>
        </div>
    );
}

