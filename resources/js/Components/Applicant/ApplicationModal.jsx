import React from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from "@/Components/Modal.jsx";
import SecondaryButton from "@/Components/SecondaryButton.jsx";

export default function ApplicationModal({ isOpen, onClose, onApply, job, user }) {
    if (!isOpen) return null;

    console.log('job', job)
    console.log('user', user)

    const handleFileChange = (e) => {
        console.log('Files selected:', e.target.files);
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="4xl">
            <div className="bg-white rounded-lg shadow-lg w-full max-h-[80vh] overflow-hidden flex flex-col">

                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Job Application</h2>
                        <div className="flex space-x-2">

                            <SecondaryButton onClick={onClose}>
                                Close
                            </SecondaryButton>
                        </div>
                    </div>

                    <p className="text-gray-600 mt-1">
                        Job Title: <span className="font-semibold">{job.job_title}  {job.company} </span>
                    </p>
                </div>

                {/* Content */}
                <div className="flex flex-col md:flex-row overflow-y-auto p-6">
                    {/* Left Column - Job Information */}
                    <div className="flex-1 pr-0 md:pr-4 mb-6 md:mb-0">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-dark mb-2">Skills Required</h3>
                            <div className="flex flex-wrap gap-2">
                                {job.skills?.map((skill) => (
                                    <span key={skill.skill_id} className="bg-gray-100 text-dark px-3 py-1 rounded-full text-sm">
                                        {skill.skill_name}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-dark mb-2">Required Education</h3>
                            <p className="text-gray-600">{job.degree?.name || 'Not specified'}</p>
                        </div>


                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-dark mb-2">Requirements</h3>
                            <ul className="list-disc ml-5 text-gray-700">
                                {job.requirements?.map((req) => (
                                    <li key={req.requirement_id} className="text-gray-600">{req.requirement_name}</li>
                                ))}
                            </ul>
                        </div>


                    </div>

                    <div className="flex-1 pl-0 md:pl-4 md:border-l border-gray-200">
                        <div className="bg-gray-50 rounded-lg p-3">
                            <h3 className="text-lg font-semibold text-dark mb-4">Upload Documents</h3>

                            {job.requirements && job.requirements.length > 0 && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Requirements
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div className="flex text-sm text-gray-600">
                                                <label htmlFor="requirements-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                                    <span>Upload files</span>
                                                    <input id="requirements-upload" name="requirements-upload" type="file" multiple className="sr-only" onChange={handleFileChange} />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                (PDF, DOC, JPG up to 100MB each)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {job.degree && job.degree.name && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Degree
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div className="flex text-sm text-gray-600">
                                                <label htmlFor="degree-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                                    <span>Upload files</span>
                                                    <input id="degree-upload" name="degree-upload" type="file" multiple className="sr-only" onChange={handleFileChange} />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                (PDF, DOC, JPG up to 100MB each)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {job.certificates && job.certificates.length > 0 && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Certificate
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <div className="flex text-sm text-gray-600">
                                                <label htmlFor="certificate-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                                    <span>Upload files</span>
                                                    <input id="certificate-upload" name="certificate-upload" type="file" multiple className="sr-only" onChange={handleFileChange} />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                (PDF, DOC, JPG up to 100MB each)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer with Action Buttons */}
                <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-800"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <PrimaryButton
                        onClick={() => {
                            onApply();
                            onClose();
                        }}
                    >
                        Submit Application
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
}
