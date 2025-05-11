import React, { useState, useEffect } from 'react';
import Modal from '@/Components/Modal.jsx';
import SecondaryButton from '@/Components/SecondaryButton.jsx';
import PrimaryButton from '@/Components/PrimaryButton.jsx';
import axios from 'axios';

export default function RequirementsViewerModal({ show, onClose, applicationId }) {
    const [requirements, setRequirements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeFile, setActiveFile] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        if (show && applicationId) {
            fetchRequirements();
        } else {
            setRequirements([]);
            setActiveFile(null);
            setError(null);
        }
    }, [show, applicationId]);

    const fetchRequirements = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.get(`/api/applications/${applicationId}/requirements`);
            if (data.success) {
                setRequirements(data.requirements || data.data);
                if (data.requirements?.length > 0 || data.data?.length > 0) {
                    setActiveFile((data.requirements || data.data)[0]);
                }
            } else {
                setError('Failed to load requirements');
            }
        } catch (err) {
            console.error('Error fetching requirements:', err);
            setError('An error occurred while fetching requirements');
        } finally {
            setLoading(false);
        }
    };

    const renderIcon = (filename) => {
        const ext = filename?.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return <i className="text-green-500 text-xl">🖼️</i>;
        if (ext === 'pdf') return <i className="text-red-500 text-xl">📄</i>;
        if (['doc', 'docx'].includes(ext)) return <i className="text-blue-500 text-xl">📑</i>;
        return <i className="text-gray-500 text-xl">📁</i>;
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'pending':
            default:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    const renderPreview = (file) => {
        if (!file) return <div className="flex items-center justify-center h-64 text-gray-500">No file selected</div>;

        const ext = file.original_filename?.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
            return (
                <div className="flex flex-col items-center justify-center h-full">
                    <img
                        src={file.file_path}
                        alt={file.original_filename}
                        className="max-w-full max-h-[500px] object-contain"
                    />
                    <p className="mt-2 text-sm text-gray-500">{file.original_filename}</p>
                </div>
            );
        } else if (ext === 'pdf') {
            return (
                <div className="flex flex-col h-full">
                    <iframe
                        src={file.file_path}
                        className="w-full flex-grow border-0"
                        title={file.original_filename}
                    />
                    <p className="mt-2 text-sm text-gray-500">{file.original_filename}</p>
                </div>
            );
        } else {
            return (
                <div className="flex flex-col items-center justify-center p-8 h-full">
                    <div className="text-5xl mb-4">{renderIcon(file.original_filename)}</div>
                    <p className="text-lg mb-4">{file.original_filename}</p>
                    <p className="mb-6 text-gray-500">Cannot preview this file type.</p>
                    <a
                        href={file.file_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        download={file.original_filename}
                    >
                        Download File
                    </a>
                </div>
            );
        }
    };

    const filteredRequirements = statusFilter === 'all'
        ? requirements
        : requirements.filter(req => req.status?.toLowerCase() === statusFilter.toLowerCase());

    const updateRequirementStatus = async (requirementId, newStatus) => {
        try {
            setLoading(true);
            const { data } = await axios.patch(`/api/requirements/${requirementId}/status`, {
                status: newStatus
            });

            if (data.success) {
                // Update the requirement status in the local state
                setRequirements(requirements.map(req =>
                    req.id === requirementId ? {...req, status: newStatus} : req
                ));

                // Update active file if it's the one being changed
                if (activeFile && activeFile.id === requirementId) {
                    setActiveFile({...activeFile, status: newStatus});
                }
            } else {
                setError('Failed to update requirement status');
            }
        } catch (err) {
            console.error('Error updating requirement status:', err);
            setError('An error occurred while updating the status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="6xl">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                <h2 className="text-xl font-semibold">Application Documents</h2>
                <SecondaryButton onClick={onClose}>Close</SecondaryButton>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 p-4 border-b">
                {['all', 'pending', 'approved', 'rejected'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1 rounded-full text-sm border transition ${
                            statusFilter === status
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
                        }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            {loading && !requirements.length ? (
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : error ? (
                <div className="p-6 text-red-600 text-center rounded-md bg-red-50 m-4">
                    <p className="font-medium">Error</p>
                    <p>{error}</p>
                </div>
            ) : filteredRequirements.length === 0 ? (
                <div className="p-12 text-gray-500 text-center">
                    {requirements.length === 0
                        ? "No documents found for this application."
                        : `No ${statusFilter} documents found.`}
                </div>
            ) : (
                <div className="flex flex-col md:flex-row h-[600px]">
                    {/* File list */}
                    <div className="md:w-1/3 lg:w-1/4 overflow-y-auto border-r">
                        <div className="p-2">
                            <p className="text-sm text-gray-500 mb-2 px-2">
                                {filteredRequirements.length} document{filteredRequirements.length !== 1 ? 's' : ''}
                            </p>
                            {filteredRequirements.map((file) => (
                                <div
                                    key={file.id}
                                    onClick={() => setActiveFile(file)}
                                    className={`flex items-start p-3 cursor-pointer rounded mb-1 border ${
                                        activeFile?.id === file.id
                                            ? 'bg-blue-50 border-blue-200'
                                            : 'hover:bg-gray-50 border-transparent'
                                    }`}
                                >
                                    <div className="mr-3 mt-1">
                                        {renderIcon(file.original_filename)}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className="font-medium truncate">{file.requirement_name || "Document"}</p>
                                        <p className="text-sm text-gray-500 truncate">{file.original_filename}</p>
                                        <div className="mt-1">
                                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(file.status)}`}>
                                                {file.status || 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Preview area */}
                    <div className="md:w-2/3 lg:w-3/4 overflow-y-auto flex flex-col">
                        <div className="flex-grow p-4">
                            {renderPreview(activeFile)}
                        </div>

                        {/* Actions footer */}
                        {activeFile && (
                            <div className="border-t p-4 bg-gray-50 flex items-center justify-between">
                                <div className="flex gap-2">
                                    {activeFile.status !== 'approved' && (
                                        <PrimaryButton
                                            onClick={() => updateRequirementStatus(activeFile.id, 'approved')}
                                            className="bg-green-600 hover:bg-green-700"
                                            disabled={loading}
                                        >
                                            Approve
                                        </PrimaryButton>
                                    )}
                                    {activeFile.status !== 'rejected' && (
                                        <SecondaryButton
                                            onClick={() => updateRequirementStatus(activeFile.id, 'rejected')}
                                            className="text-red-600 border-red-600 hover:bg-red-50"
                                            disabled={loading}
                                        >
                                            Reject
                                        </SecondaryButton>
                                    )}
                                </div>
                                <div>
                                    <a
                                        href={activeFile.file_path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-flex items-center"
                                        download={activeFile.original_filename}
                                    >
                                        <span className="mr-1">⬇️</span> Download
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    );
}
