import { useState, useEffect } from "react";

export default function BirthdayInput() {
    // State variables initialized to January 1, 2025
    const [year, setYear] = useState("2025");
    const [month, setMonth] = useState("January");
    const [day, setDay] = useState("1");

    // Generate years dynamically (e.g., last 100 years)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    // Months array with names and corresponding number of days
    const months = [
        { name: "January", days: 31 },
        { name: "February", days: 28 }, // Adjusted for leap years in getDaysInMonth
        { name: "March", days: 31 },
        { name: "April", days: 30 },
        { name: "May", days: 31 },
        { name: "June", days: 30 },
        { name: "July", days: 31 },
        { name: "August", days: 31 },
        { name: "September", days: 30 },
        { name: "October", days: 31 },
        { name: "November", days: 30 },
        { name: "December", days: 31 },
    ];

    // Function to determine the number of days in a given month and year
    const getDaysInMonth = (month, year) => {
        if (!month || !year) return 31; // Default to 31 days if month or year is not selected

        const monthData = months.find(m => m.name === month);
        if (!monthData) return 31;

        if (month === "February") {
            // Check for leap year
            const y = parseInt(year, 10);
            const isLeapYear = (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
            return isLeapYear ? 29 : 28;
        }

        return monthData.days;
    };

    // State to hold the days for the selected month and year
    const [days, setDays] = useState([]);

    // Update days when month or year changes
    useEffect(() => {
        if (month && year) {
            const daysInMonth = getDaysInMonth(month, year);
            setDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));
            if (parseInt(day, 10) > daysInMonth) setDay("1"); // Reset day to 1 if out of range
        } else {
            setDays([]); // Reset days if month or year is not selected
        }
    }, [month, year, day]);

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
                disabled={!month || !year} // Disable until month & year are selected
            >
                {days.map(d => (
                    <option key={d} value={d}>
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
                    <option key={y} value={y}>
                        {y}
                    </option>
                ))}
            </select>
        </div>
    );
}
