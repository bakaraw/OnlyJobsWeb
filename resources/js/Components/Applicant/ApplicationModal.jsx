import React, { useState } from 'react'
import { usePage } from '@inertiajs/react'
import axios from 'axios'
import Modal from '@/Components/Modal'
import PrimaryButton from '@/Components/PrimaryButton'
import SecondaryButton from '@/Components/SecondaryButton'
import ConfirmModal from '@/Components/ConfirmModal'

export default function ApplicationModal({ isOpen, onClose, onApply, job }) {
    const { auth, csrf } = usePage().props
    const [reqFiles, setReqFiles] = useState({})
    const [errors, setErrors] = useState({})
    const [uploading, setUploading] = useState(false)
    const [notif, setNotif] = useState({ show: false, type: 'success', message: '', onConfirm: null })

    if (!isOpen) return null

    const handleFileChange = (reqId, e) => {
        const file = e.target.files?.[0]
        if (file) {
            setReqFiles(f => ({ ...f, [reqId]: file }))
            setErrors(err => { const e2 = { ...err }; delete e2[reqId]; return e2 })
        }
    }

    const closeNotif = () => setNotif(s => ({ ...s, show: false }))

    const submit = async e => {
        e.preventDefault()
        if (Object.keys(reqFiles).length === 0) {
            return setNotif({
                show: true,
                type: 'error',
                message: 'Please select at least one file.',
                onConfirm: closeNotif
            })
        }

        setUploading(true)
        setErrors({})

        const data = new FormData()
        data.append('job_id', job.id)
        data.append('user_id', auth.user.id)
        // append each file under files[<requirement_id>]
        Object.entries(reqFiles).forEach(([reqId, file]) => {
            data.append(`files[${reqId}]`, file)
        })

        try {
            const res = await axios.post('/application/upload-requirements', data, {
                headers: {
                    'X-CSRF-TOKEN': csrf,
                },
            })

            if (res.data.success) {
                setNotif({
                    show: true,
                    type: 'success',
                    message: 'Requirements uploaded successfully!',
                    onConfirm: () => {
                        onApply()
                        onClose()
                        closeNotif()
                        setReqFiles({})
                    }
                })
            }
        } catch (err) {
            const resp = err.response?.data
            if (resp?.errors) {
                // map Laravel’s files.0 => errors[0], etc.
                const fieldErrors = {}
                Object.keys(resp.errors).forEach(key => {
                    const m = key.match(/files\.(\d+)/)
                    if (m) fieldErrors[m[1]] = resp.errors[key][0]
                })
                setErrors(fieldErrors)
            }

            setNotif({
                show: true,
                type: 'error',
                message: resp?.message || 'Upload failed.',
                onConfirm: closeNotif
            })
        } finally {
            setUploading(false)
        }
    }

    // helper for showing existing status
    const yourApp = job.applications?.find(a => a.user_id === auth.user.id)
    const statusStyles = {
        Accepted: 'bg-green-300 text-green-900',
        Qualified: 'bg-blue-300 text-blue-900',
        Pending: 'bg-yellow-300 text-yellow-900',
        Rejected: 'bg-red-300 text-red-900',
    }

    return (
        <>
            <Modal show={isOpen} onClose={onClose} maxWidth="4xl">
                <form onSubmit={submit} encType="multipart/form-data">
                    <div className="p-6 border-b">
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${yourApp ? statusStyles[yourApp.status] : 'bg-gray-300 text-gray-800'}`}>
                            {yourApp?.status || 'No Status'}
                        </span>
                        <div className="flex justify-between items-center mt-4">
                            <h2 className="text-2xl font-bold">{job.job_title}</h2>
                            <SecondaryButton onClick={onClose}>Close</SecondaryButton>
                        </div>
                    </div>

                    <div className="p-6 flex flex-col text-gray-600 md:flex-row gap-6">
                        {/* Left: Requirements list */}
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                            {job.requirements?.length
                                ? <ul className="list-disc pl-5 space-y-1">
                                    {job.requirements.map(req => (
                                        <li key={req.requirement_id}>{req.requirement_name}</li>
                                    ))}
                                </ul>
                                : <p>No requirements specified.</p>
                            }
                            <div className='mt-4'>
                                <dt className="text-lg font-semibold text-dark">Company Remarks on you:</dt>
                                <dd className="mt-1 text-gray-600 leading-relaxed">
                                    {job.applications?.[0]?.remarks || "None"}
                                </dd>
                            </div>
                        </div>

                        {/* Right: File uploads */}
                        <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4">Upload Documents</h3>
                            {job.requirements?.map(req => (
                                <div key={req.requirement_id} className="mb-4">
                                    <label className="block text-sm font-medium mb-1">{req.requirement_name}</label>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        onChange={e => handleFileChange(req.requirement_id, e)}
                                    />
                                    {reqFiles[req.requirement_id] && (
                                        <p className="text-xs text-green-600 mt-1">
                                            Selected: {reqFiles[req.requirement_id].name}
                                        </p>
                                    )}
                                    {errors[req.requirement_id] && (
                                        <p className="text-xs text-red-600 mt-1">{errors[req.requirement_id]}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 border-t flex justify-between items-center">
                        <div>
                            <h4 className="font-semibold">Company:</h4>
                            <p>{job.company}</p>
                        </div>
                        <div className="space-x-2">
                            <PrimaryButton type="submit" disabled={uploading}>
                                {uploading ? 'Uploading…' : 'Submit Application'}
                            </PrimaryButton>
                        </div>
                    </div>
                </form>
            </Modal>

            <ConfirmModal
                show={notif.show}
                type={notif.type}
                message={notif.message}
                onClose={closeNotif}
                onConfirm={notif.onConfirm}
                confirmText="OK"
            />
        </>
    )
}
