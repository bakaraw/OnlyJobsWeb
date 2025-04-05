import { useState } from "react";

const FileInput = ({ onFileSelect }) => {
    const [fileName, setFileName] = useState("");

    const handleFileChange = (event) => {
        const file = event.target.files?.[0] || null;
        setFileName(file ? file.name : "");
        onFileSelect(file);
    };

    return (
        <div className="w-full">
            <div className="flex flex-col space-y-2">
                <input
                    type="file"
                    className="border border-gray-300 rounded-md p-2 shadow-sm focus:ring focus:ring-gray-500"
                    onChange={handleFileChange}
                />
                {fileName && <p className="text-sm text-gray-500">Selected: {fileName}</p>}
            </div>
        </div>
    );
};

export default FileInput;

