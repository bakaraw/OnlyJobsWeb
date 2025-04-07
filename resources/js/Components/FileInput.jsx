import { useState } from "react";

const FileInput = ({ onFileSelect }) => {
    const [fileName, setFileName] = useState("");

    const handleChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            onFileSelect(file); // callback to parent (sets useForm data)
        }
    };

    return (
        <div className="w-full space-y-1">
            <input
                type="file"
                onChange={handleChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0
                           file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700
                           hover:file:bg-gray-200"
            />
            {fileName && (
                <p className="text-xs text-gray-500">Selected file: {fileName}</p>
            )}
        </div>
    );
};

export default FileInput;

