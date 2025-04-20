import { useEffect, useState } from "react";

const FileInput = ({ onFileSelect, url }) => {
    const [fileName, setFileName] = useState("");
    const [previewUrl, setPreviewUrl] = useState(url);
    const [fileType, setFileType] = useState("");

    const handleChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) {
            setFileName("");
            setPreviewUrl("");
            setFileType("");
            return;
        }

        setFileName(file.name);
        const localUrl = URL.createObjectURL(file);
        setPreviewUrl(localUrl);

        const mimeType = file.type;
        if (mimeType.startsWith("image/")) {
            setFileType("image");
        } else if (mimeType === "application/pdf") {
            setFileType("pdf");
        } else {
            setFileType("unknown");
        }

        onFileSelect(file);
    };

    useEffect(() => {
        if (url) {
            const lowerUrl = url.toLowerCase();
            let type = "unknown";

            if (/\.(jpg|jpeg|png|gif|bmp|webp)(\?|$)/.test(lowerUrl)) {
                type = "image";
            } else if (
                /\.(pdf)(\?|$)/.test(lowerUrl) ||
                lowerUrl.includes("/raw/upload/")
            ) {
                type = "pdf";
            }

            setFileType(type);
            setPreviewUrl(url);
        }
    }, [url]);

    useEffect(() => {
        return () => {
            if (previewUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handlePdfDownload = async () => {
        try {
            const response = await fetch(previewUrl);
            const blob = await response.blob();
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = fileName || "certificate.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);
        } catch (err) {
            console.error("Failed to download file:", err);
        }
    };

    return (
        <div className="w-full space-y-2">
            <input
                key={fileName} // re-render when fileName changes
                type="file"
                accept="image/*,application/pdf"
                onChange={handleChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0
                           file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700
                           hover:file:bg-gray-200"
            />

            {fileName && (
                <p className="text-xs text-gray-500">Selected file: {fileName}</p>
            )}

            {previewUrl && fileType === "image" && (
                <img
                    src={previewUrl}
                    alt="Preview"
                    className="mt-2 rounded shadow max-w-full max-h-96"
                />
            )}

            {previewUrl && fileType === "pdf" && (
                <div className="mt-2 space-y-2">
                    <button
                        onClick={handlePdfDownload}
                        className="text-blue-600 underline text-sm"
                    >
                        📄 Download Attached File
                    </button>
                </div>
            )}

            {previewUrl &&
                fileType === "unknown" && (
                    <p className="text-red-500 text-sm mt-2">
                        Unsupported file type
                    </p>
                )}
        </div>
    );
};

export default FileInput;

