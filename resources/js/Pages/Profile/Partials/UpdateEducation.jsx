import AddressForm from '@/Components/AddressForm';
import InputLabel from '@/Components/InputLabel';
import FileInput from '@/Components/FileInput';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function UpdateEducation({ className }) {

    const user = usePage().props.auth.user;

    const [educationLevel, setEducationLevel] = useState("college");
    const [selectedFile, setSelectedFile] = useState(null);

    const [query, setQuery] = useState("");
    const [universities, setUniversities] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // when query is changes, this block of code runs and fetches the universities based on the query
    useEffect(() => {
        if (query.length > 2) {
            fetch(`http://universities.hipolabs.com/search?name=${query}`)
                .then((response) => response.json())
                .then((data) => setUniversities(data))
                .catch((error) => console.error("Error fetching universities:", error));
        } else {
            setUniversities([]); // Clear suggestions if input is too short
        }
    }, [query]);

    const handleFileUpload = (file) => {
        setSelectedFile(file);
        console.log("Selected file:", file);
    };

    const handleSelect = (university) => {
        //form.setData("university", university);
        setQuery(university);
        setShowSuggestions(false); // Hide dropdown
    };

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Education
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your education
                </p>
            </header>
            <form onSubmit={submit} className="mt-6 space-y-6">
                <div className='grid grid-cols-6 gap-3'>
                    <div className='col-span-2'>
                        <InputLabel htmlFor="wow" value="Education Level" />
                        <select
                            className='w-full rounded-md border-gray-300 shadow-sm focus:border-dark focus:ring-gray-500'
                            value={educationLevel}
                            onChange={(e) => setEducationLevel(e.target.value)}
                        >
                            <option value="college"> College </option>
                            <option value="senior_high"> Senior High School Education </option>
                            <option value="junior_high"> Junior High School Education </option>
                            <option value="elementary"> Elementary Education </option>
                        </select>
                    </div>
                    <div className='col-span-3'>
                        <InputLabel htmlFor="wow" value="School/University" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setShowSuggestions(true);
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-dark focus:ring-gray-500"
                            placeholder="Start typing to search..."
                        />
                        {showSuggestions && universities.length > 0 && (
                            <ul className="absolute z-10 min-w-60 bg-white border rounded-md shadow-lg mt-1 overflow-y-auto">
                                {universities.map((uni) => (
                                    <li
                                        key={uni.name}
                                        onClick={() => handleSelect(uni.name)}
                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                    >
                                        {uni.name}
                                    </li>
                                ))}
                            </ul>
                        )}

                    </div>
                    <div className='col-span-1'>
                        <InputLabel htmlFor="wow" value="Graduation Year" />
                        <TextInput className="mt-1 block w-full"></TextInput>
                    </div>

                    {
                        educationLevel === 'college' ?
                            <div className='col-span-6'>
                                <InputLabel htmlFor="wow" value="Course/Program" />
                                <TextInput className="mt-1 block w-full"></TextInput>
                            </div>

                            : <div></div>
                    }

                </div>
                <div className=''>
                    <InputLabel htmlFor="wow" value="Attach File" />
                    <div className="">
                        <FileInput onFileSelect={handleFileUpload} />
                        {selectedFile && (
                            <p className="mt-2 text-green-600">File uploaded: {selectedFile.name}</p>
                        )}
                    </div>
                </div>
                {
                    //<AddressForm data={data} setData={setData} errors={errors} />
                }
                <div className='flex items-center justify-center'>
                    <SecondaryButton className='mt-4'>
                        Add Education
                    </SecondaryButton>
                </div>

            </form>
        </section>
    );
}
