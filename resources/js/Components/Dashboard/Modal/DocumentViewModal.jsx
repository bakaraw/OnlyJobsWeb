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
                                                    applicantDetails = null,
                                                    applicantInfo = null,
                                                    filteredApplicants

                                                }) {
        const { csrf } = usePage().props
        const [loading, setLoading] = useState(true)
        const [error, setError] = useState(null)
        const [document, setDocument] = useState(null)
        const [documents, setDocuments] = useState([])
        const [currentDocIndex, setCurrentDocIndex] = useState(0)
        const [activeTab, setActiveTab] = useState('documents') // 'documents', 'profile', 'skills', 'education', 'work', 'certifications'
        const [applicantData, setApplicantData] = useState(null)


        console.log(filteredApplicants)


        const matchingApplicant = applicantInfo;


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

        // Fetch applicant details
        const fetchApplicantDetails = async (appId) => {
            try {
                const response = await axios.get(`/applicant-details/${appId}`, {
                    headers: { 'X-CSRF-TOKEN': csrf }
                });

                if (response.data.success) {
                    setApplicantData({
                        ...response.data.applicant,
                        current_application: response.data.application,
                        documents: response.data.documents
                    });

                    // If we get documents from this API call, use them
                    if (response.data.documents && response.data.documents.length > 0) {
                        setDocuments(response.data.documents);
                        setDocument(response.data.documents[0]);
                        setCurrentDocIndex(0);
                    }
                } else {
                    console.error('Failed to load applicant details:', response.data.message);
                }
            } catch (err) {
                console.error('Error fetching applicant details:', err);
            }
        }
        // Load data when modal opens
        useEffect(() => {
            if (isOpen) {
                // If applicantDetails is already provided via props, use it
                if (applicantDetails) {
                    setApplicantData(applicantDetails);

                    // If documents are included in applicantDetails, use them
                    if (applicantDetails.documents && applicantDetails.documents.length > 0) {
                        setDocuments(applicantDetails.documents);
                        setDocument(applicantDetails.documents[0]);
                        setCurrentDocIndex(0);
                        setLoading(false);
                        return;
                    }
                }

                if (documentId) {
                    fetchDocument(documentId);
                } else if (applicationId) {
                    fetchApplicationDocuments(applicationId);
                    fetchApplicantDetails(applicationId);
                } else {
                    setError('No document or application specified');
                    setLoading(false);
                }
            } else {
                // Reset state when modal closes
                setDocument(null);
                setDocuments([]);
                setError(null);
                setActiveTab('profile');
                setApplicantData(null);
            }
        }, [isOpen, documentId, applicationId, applicantDetails])
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


// 1. First, add this function to your DocumentViewerModal component:

        const exportPDF = async () => {
            try {
                // Show loading state if you have one
                setLoading(true);

                if (!filteredApplicants || filteredApplicants.length === 0) {
                    alert('No applicant data available for export.');
                    return;
                }

                // Get applicant ID from filtered applicants
                const applicantId = filteredApplicants[0]?.user?.id || filteredApplicants[0]?.id;

                if (!applicantId) {
                    alert('Unable to export: Applicant ID not found');
                    return;
                }

                // Build URL with application ID if available
                let url = `/applicants/${applicantId}/pdf`;
                if (applicationId) {
                    url += `?application_id=${applicationId}`;
                }

                // Make the API request
                const response = await axios.get(url, {
                    responseType: 'blob' // Important for handling PDF binary data
                });

                // Create a blob from the PDF data
                const blob = new Blob([response.data], { type: 'application/pdf' });

                // Create download URL
                const fileURL = window.URL.createObjectURL(blob);

                // Use window.document explicitly to avoid conflicts
                const downloadLink = window.document.createElement('a');
                downloadLink.href = fileURL;
                downloadLink.setAttribute('download', `applicant_${applicantId}_profile.pdf`);

                // Append to body, click, and remove
                window.document.body.appendChild(downloadLink);
                downloadLink.click();
                window.document.body.removeChild(downloadLink);

                // Clean up URL object
                window.URL.revokeObjectURL(fileURL);
            } catch (err) {
                console.error('Error exporting PDF:', err);
                alert(`Failed to export PDF: ${err.message || 'Unknown error'}`);
            } finally {
                setLoading(false);
            }
        };
        if (!isOpen) return null

        return (
            <Modal show={isOpen} onClose={onClose} maxWidth="6xl">
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">Applicant Information</span>
                        <div className="flex gap-2">
                            <SecondaryButton onClick={exportPDF}>
                                Export PDF
                            </SecondaryButton>
                            <SecondaryButton onClick={onClose}>Close</SecondaryButton>
                        </div>
                    </div>
                    {applicantInfo && (
                        <div className="mt-2">
                            <p className="text-gray-600">
                                <span className="font-bold"> {applicantInfo.name}</span> -
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

                {/* Navigation Tabs */}
                <div className="border-b px-6 pt-4">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`pb-4 px-1 border-b-2 transition-colors ${
                                activeTab === 'profile'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent hover:border-gray-300'
                            }`}
                        >
                            Personal Info
                        </button>
                        <button
                            onClick={() => setActiveTab('documents')}
                            className={`pb-4 px-1 border-b-2 transition-colors ${
                                activeTab === 'documents'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent hover:border-gray-300'
                            }`}
                        >
                            Documents
                        </button>

                        <button
                            onClick={() => setActiveTab('skills')}
                            className={`pb-4 px-1 border-b-2 transition-colors ${
                                activeTab === 'skills'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent hover:border-gray-300'
                            }`}
                        >
                            Qualifications
                        </button>

                        <button
                            onClick={() => setActiveTab('work')}
                            className={`pb-4 px-1 border-b-2 transition-colors ${
                                activeTab === 'work'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent hover:border-gray-300'
                            }`}
                        >
                            Professional Background
                        </button>

                    </div>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {/* Documents Tab */}
                    {activeTab === 'profile' && (
                        matchingApplicant ? (
                            <div className="mb-6 space-y-8">
                                {filteredApplicants.length > 0 ? (
                                    filteredApplicants.map((applicant, idx) => {
                                        const u = applicant.user;
                                        const addr = u.address || {};
                                        const fullName = [
                                            u.first_name,
                                            u.middle_name,
                                            u.last_name,
                                            u.suffix && `, ${u.suffix}`,
                                        ]
                                            .filter(Boolean)
                                            .join(' ');

                                        return (
                                            <div key={u.id || idx} className="border rounded-lg p-4 shadow-sm">
                                                <h4 className="text-md font-semibold mb-4 text-lg">{fullName || 'Unnamed Applicant'}</h4>
                                                {matchingApplicant.user.first_name} {matchingApplicant.user.last_name}

                                                {/* Personal Info Table */}
                                                <table className="table-auto w-full mb-6">
                                                    <thead className="bg-gray-100"></thead>
                                                    <tbody>
                                                    <tr>
                                                        <td className="py-1 px-2 font-medium">Email</td>
                                                        <td className="py-1 px-2">{u.email || 'Not specified'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-1 px-2 font-medium">Contact Number</td>
                                                        <td className="py-1 px-2">{u.contact_number || 'Not specified'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-1 px-2 font-medium">Gender</td>
                                                        <td className="py-1 px-2">{u.gender || 'Not specified'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-1 px-2 font-medium">Birthdate</td>
                                                        <td className="py-1 px-2">
                                                            {u.birthdate
                                                                ? new Date(u.birthdate).toLocaleDateString()
                                                                : 'Not specified'}
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>

                                                {/* Address Table */}
                                                <table className="table-auto w-full">
                                                    <thead className="bg-gray-100"></thead>
                                                    <tbody>
                                                    <tr>
                                                        <td className="py-1 px-2 font-medium">Street</td>
                                                        <td className="py-1 px-2">{addr.street || 'N/A'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-1 px-2 font-medium">Street 2</td>
                                                        <td className="py-1 px-2">{addr.street2 || 'N/A'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-1 px-2 font-medium">City</td>
                                                        <td className="py-1 px-2">{addr.city || 'N/A'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-1 px-2 font-medium">Province</td>
                                                        <td className="py-1 px-2">{addr.province || 'N/A'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-1 px-2 font-medium">Postal Code</td>
                                                        <td className="py-1 px-2">{addr.postal_code || 'N/A'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-1 px-2 font-medium">Country</td>
                                                        <td className="py-1 px-2">{addr.country || 'N/A'}</td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-gray-600">No personal information available</p>
                                )}
                            </div>
                        ) : null
                    )}
                    {activeTab === 'documents' && (
                        <>
                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
                                </div>
                            ) : error ? (
                                <div className="text-red-600 text-center py-8">{error}</div>
                            ) : document ? (
                                <div className="flex flex-col space-y-4">
                                    {/* Document metadata */}
                                    <div className="text-center">
                                        <h3 className="font-semibold text-lg">{document.requirement_name}</h3>
                                        <p className="text-sm text-gray-600">
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
                                    <div className="flex justify-center items-center">
                                        <a
                                            href={document.file_path}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="accent-white flex items-center gap-2"
                                        >
                                            <SecondaryButton>
                                                Download
                                            </SecondaryButton>
                                        </a>
                                    </div>

                                    {/* Navigation for multiple documents */}
                                    {documents.length > 1 && (
                                        <div className="flex justify-between items-center pt-4 border-t">
                                            <SecondaryButton
                                                onClick={goToPrevious}
                                                disabled={currentDocIndex === 0}
                                                className={currentDocIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                                            >
                                                Previous
                                            </SecondaryButton>
                                            <span>
                                                Document {currentDocIndex + 1} of {documents.length}
                                            </span>
                                            <SecondaryButton
                                                onClick={goToNext}
                                                disabled={currentDocIndex === documents.length - 1}
                                                className={currentDocIndex === documents.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}
                                            >
                                                Next
                                            </SecondaryButton>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">No document found</div>
                            )}
                        </>
                    )}

                    {/* Profile Tab */}
                    {/* Profile Tab */}
                    {/* Profile Tab */}
                    {/* Profile Tab */}
                    {activeTab === 'skills' && (
                        <div className="mb-6">

                            {filteredApplicants.some(a => a.user.user_skills?.length > 0) ? (
                                <table className="table-auto w-full border-collapse mb-6">
                                    <thead className="bg-gray-100 text-left">
                                    <tr>
                                        <th className="py-2 px-4">Skill</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredApplicants.map((applicant, aIdx) => {
                                        const skills = applicant.user.user_skills || [];

                                        return skills.map((skill, rowIdx) => (
                                            <tr key={`${aIdx}-${rowIdx}`} className="border-b">

                                                <td className="py-2 px-4">
                                                    {skill.skill?.name || skill.skill_name || 'N/A'}
                                                </td>
                                            </tr>
                                        ));
                                    })}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-600">No skills information available</p>
                            )}


                            {filteredApplicants.some(a => a.user.educations?.length > 0) ? (
                                <table className="table-auto w-full border-collapse">
                                    <thead className="bg-gray-100 text-left">
                                    <tr>
                                        <th className="py-2 px-4">Education Level</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredApplicants.map((applicant, aIdx) => {
                                        const educations = applicant.user.educations || [];

                                        return educations.map((education, rowIdx) => (
                                            <tr key={`${aIdx}-${rowIdx}`} className="border-b">

                                                <td className="py-2 px-4">
                                                    {education.education_level || 'N/A'}
                                                </td>
                                            </tr>
                                        ));
                                    })}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-600">No education information available</p>
                            )}
                        </div>
                    )}
                    {/* Work Experience Tab */}
                    {/* Work & Certifications Tab */}
                    {activeTab === 'work' && (
                        <div className="mb-6">

                            <h3 className="text-lg font-semibold mb-4">Work History</h3>

                            {filteredApplicants.some(applicant => applicant.user.work_histories?.length > 0) ? (
                                <table className="table-auto w-full border-collapse mb-8">
                                    <thead className="bg-gray-100 text-left">
                                    <tr>
                                        <th className="py-2 px-4">Job Title</th>
                                        <th className="py-2 px-4">Employer</th>
                                        <th className="py-2 px-4">Period</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredApplicants.flatMap((applicant, aIdx) =>
                                        (applicant.user.work_histories || []).map((hist, hIdx) => {
                                            const start = hist.start_date
                                                ? new Date(hist.start_date).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })
                                                : '?';
                                            const end = hist.end_date
                                                ? new Date(hist.end_date).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })
                                                : 'Present';
                                            return (
                                                <tr key={`hist-${aIdx}-${hIdx}`} className="border-b">
                                                    <td className="py-2 px-4">{hist.job_title || 'N/A'}</td>
                                                    <td className="py-2 px-4">{hist.employer || 'N/A'}</td>
                                                    <td className="py-2 px-4">{start} – {end}</td>
                                                </tr>
                                            );
                                        })
                                    )}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-600 mb-8">No work history information available</p>
                            )}

                            {/* --- Certifications Table --- */}
                            <h3 className="text-lg font-semibold mb-4">Certifications</h3>

                            {filteredApplicants.some(a => a.user.certifications?.length > 0) ? (
                                <table className="table-auto w-full border-collapse">
                                    <thead className="bg-gray-100 text-left">
                                    <tr>
                                        <th className="py-2 px-4">Title</th>
                                        <th className="py-2 px-4">Description</th>
                                        <th className="py-2 px-4">Year</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredApplicants.flatMap((applicant, aIdx) =>
                                        (applicant.user.certifications || []).map((cert, cIdx) => (
                                            <tr key={`cert-${aIdx}-${cIdx}`} className="border-b">

                                                <td className="py-2 px-4">{cert.title || 'N/A'}</td>
                                                <td className="py-2 px-4">{cert.description || 'N/A'}</td>
                                                <td className="py-2 px-4">{cert.year || 'N/A'}</td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-600">No certification information available</p>
                            )}
                        </div>
                    )}



                    {/* Applications Tab */}
                    {activeTab === 'applications' && applicantDetails && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Applications</h3>
                            {applicantDetails.applications && applicantDetails.applications.length > 0 ? (
                                <table className="table-auto w-full border-collapse">
                                    <thead className="bg-gray-100 text-left">
                                    <tr>
                                        <th className="py-2 px-4">Job Title</th>
                                        <th className="py-2 px-4">Company</th>
                                        <th className="py-2 px-4">Date Applied</th>
                                        <th className="py-2 px-4">Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {applicantDetails.applications.map((application, index) => (
                                        <tr key={application.id || index} className="border-b">
                                            <td className="py-2 px-4">
                                                {application.job_post?.job_title || application.job_title || "N/A"}
                                            </td>
                                            <td className="py-2 px-4">{application.job_post?.company || application.company || "N/A"}</td>
                                            <td className="py-2 px-4">
                                                {application.created_at
                                                    ? new Date(application.created_at).toLocaleDateString()
                                                    : "N/A"}
                                            </td>
                                            <td className={`py-2 px-4 ${getStatusColor(application.status)}`}>
                                                {application.status || "Pending"}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-600">No application information available</p>
                            )}
                        </div>
                    )}
                </div>
            </Modal>
        )
    }
