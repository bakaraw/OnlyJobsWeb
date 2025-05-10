import React, { useState, useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import axios from 'axios'
import Modal from '@/Components/Modal'
import SecondaryButton from '@/Components/SecondaryButton'
import PrimaryButton from '@/Components/PrimaryButton'

export default function DocumentViewerModal({
                                                isOpen,
                                                onClose,
                                                documentId,
                                                applicationId,
                                                applicantInfo = null
                                            }) {
    const { csrf } = usePage().props
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [document, setDocument] = useState(null)
    const [documents, setDocuments] = useState([])
    const [currentDocIndex, setCurrentDocIndex] = useState(0)

    // Fetch a single document by ID
    const fetchDocument = async (id) => {
        try {
            setLoading(true)
            const response = await axios.get(`/document/${id}`, {
                headers: { 'X-CSRF-TOKEN': csrf }
            })

            if (response.data.success) {
                setDocument(response.data.document)
                setError(null)
            } else {
                setError('Failed to load document')
            }
        } catch (err) {
            setError(`Error: ${err.response?.data.message || 'Could not load document'}`)
        } finally {
            setLoading(false)
        }
    }

    // Fetch all documents for an application
    const fetchApplicationDocuments = async (appId) => {
        try {
            setLoading(true)
            const response = await axios.get(`/application/${appId}/documents`, {
                headers: { 'X-CSRF-TOKEN': csrf }
            })

            if (response.data.success && response.data.documents.length > 0) {
                setDocuments(response.data.documents)
                setDocument(response.data.documents[0]) // Set first document as current
                setCurrentDocIndex(0)
                setError(null)
            } else {
                setError('No documents found for this applicant')
            }
        } catch (err) {
            setError(`Error: ${err.response?.data.message || 'Could not load documents'}`)
        } finally {
            setLoading(false)
        }
    }

    // Load data when modal opens
    useEffect(() => {
        if (isOpen) {
            if (documentId) {
                fetchDocument(documentId)
            } else if (applicationId) {
                fetchApplicationDocuments(applicationId)
            } else {
                setError('No document or application specified')
                setLoading(false)
            }
        } else {
            // Reset state when modal closes
            setDocument(null)
            setDocuments([])
            setError(null)
        }
    }, [isOpen, documentId, applicationId])

    // Navigate between documents
    const goToPrevious = () => {
        if (currentDocIndex > 0) {
            setCurrentDocIndex(prev => prev - 1)
            setDocument(documents[currentDocIndex - 1])
        }
    }

    const goToNext = () => {
        if (currentDocIndex < documents.length - 1) {
            setCurrentDocIndex(prev => prev + 1)
            setDocument(documents[currentDocIndex + 1])
        }
    }

    // Determine file type for display
    const getFileType = (filename) => {
        if (!filename) return 'unknown'
        const extension = filename.split('.').pop().toLowerCase()

        const imageTypes = ['jpg', 'jpeg', 'png', 'gif']
        const docTypes = ['pdf', 'doc', 'docx']

        if (imageTypes.includes(extension)) return 'image'
        if (docTypes.includes(extension)) return 'document'
        return 'unknown'
    }

    // Check if the URL is valid for iframe embedding
    const canEmbed = (url) => {
        // For PDF files, check if they can be embedded
        if (url?.toLowerCase().endsWith('.pdf')) return true
        return false
    }

    // Get file extension
    const getExtension = (filename) => {
        if (!filename) return ''
        return filename.split('.').pop().toLowerCase()
    }

    // Get status color
    const getStatusColor = (status) => {
        const statusColors = {
            'Accepted': 'bg-green-300 text-green-900',
            'Qualified': 'bg-blue-300 text-blue-900',
            'Pending': 'bg-yellow-300 text-yellow-900',
            'Rejected': 'bg-red-300 text-red-900',
        }
        return statusColors[status] || 'bg-gray-300 text-gray-800'
    }

    if (!isOpen) return null

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="6xl">
            <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-bold">Document Viewer</h2>
                        {applicantInfo && (
                            <div className="mt-2">
                                <p className="text-gray-600">
                                    <span className="font-medium">{applicantInfo.name}</span> -
                                    <span className={`ml-2 px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(applicantInfo.status)}`}>
                                        {applicantInfo.status}
                                    </span>
                                </p>
                                <p className="text-sm text-gray-500">
                                    Applied for: {applicantInfo.jobTitle} on {applicantInfo.dateApplied}
                                </p>
                            </div>
                        )}
                    </div>
                    <SecondaryButton onClick={onClose}>Close</SecondaryButton>
                </div>
            </div>

            <div className="p-6">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
                    </div>
                ) : error ? (
                    <div className="text-red-600 text-center py-8">{error}</div>
                ) : document ? (
                    <div className="flex flex-col space-y-4">
                        {/* Document metadata */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg">{document.requirement_name}</h3>
                            <p className="text-sm text-gray-600">
                                File: {document.original_filename} •
                                Status: <span className={`${
                                document.status === 'approved' ? 'text-green-600' :
                                    document.status === 'rejected' ? 'text-red-600' :
                                        'text-yellow-600'
                            }`}>{document.status}</span> •
                                Uploaded: {document.created_at}
                            </p>
                        </div>

                        {/* Document preview */}
                        <div className="border rounded-lg overflow-hidden bg-gray-100 min-h-[400px] flex items-center justify-center">
                            {getFileType(document.original_filename) === 'image' ? (
                                <img
                                    src={document.file_path}
                                    alt={document.original_filename}
                                    className="max-w-full max-h-[600px] object-contain"
                                />
                            ) : canEmbed(document.file_path) ? (
                                <iframe
                                    src={document.file_path}
                                    className="w-full h-[600px]"
                                    title={document.original_filename}
                                />
                            ) : (
                                <div className="text-center p-8">
                                    <div className="text-4xl mb-4">📄</div>
                                    <p className="mb-2">
                                        {getExtension(document.original_filename).toUpperCase()} file
                                    </p>
                                    <a
                                        href={document.file_path}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Download or Open in New Tab
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Document action buttons */}
                        <div className="flex justify-between items-center">
                            <div>
                                {document.status !== 'approved' && (
                                    <PrimaryButton
                                        type="button"
                                        onClick={() => {
                                            // In a real application, you would call an API to update the document status
                                            alert("This would approve the document in a real implementation");
                                        }}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        Approve Document
                                    </PrimaryButton>
                                )}
                            </div>
                            <a
                                href={document.file_path}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download
                            </a>
                        </div>

                        {/* Navigation for multiple documents */}
                        {documents.length > 1 && (
                            <div className="flex justify-between items-center pt-4 border-t">
                                <button
                                    onClick={goToPrevious}
                                    disabled={currentDocIndex === 0}
                                    className={`px-4 py-2 rounded ${
                                        currentDocIndex === 0
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    Previous
                                </button>
                                <span>
                                    Document {currentDocIndex + 1} of {documents.length}
                                </span>
                                <button
                                    onClick={goToNext}
                                    disabled={currentDocIndex === documents.length - 1}
                                    className={`px-4 py-2 rounded ${
                                        currentDocIndex === documents.length - 1
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8">No document found</div>
                )}
            </div>

            <div className="p-6 border-t flex justify-end">
                <PrimaryButton
                    type="button"
                    onClick={onClose}
                >
                    Close Viewer
                </PrimaryButton>
            </div>
        </Modal>
    )
}
