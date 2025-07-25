// resources/js/Components/ConfirmModal.jsx
import React, { useEffect } from 'react';

export default function ConfirmModal({
                                         show = false,
                                         type = 'success',
                                         message = '',
                                         onClose = () => {},
                                         onConfirm = null, // Changed from unspecified to explicit null default
                                         autoClose = true,
                                         duration = 3000
                                     }) {
    useEffect(() => {
        if (show && autoClose) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, autoClose, duration, onClose]);

    if (!show) return null;

    const bgColor = type === 'success'
        ? 'bg-green-100 border-green-500 text-green-700'
        : type === 'warning'
            ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
            : 'bg-red-100 border-red-500 text-red-700';

    const icon = type === 'success'
        ? (
            <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        )
        : type === 'warning'
            ? (
                <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
            )
            : (
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
            );

    return (
        <div className="fixed top-4 right-4 z-50">
            <div className={`max-w-sm rounded-lg shadow-md border-l-4 p-4 ${bgColor}`}>
                <div className="flex items-center">
                    <div className="flex-shrink-0">{icon}</div>
                    <div className="ml-3">
                        <p className="text-sm">{message}</p>
                    </div>

                    {/* Display confirmation button if onConfirm is provided */}
                    {onConfirm && type === 'warning' && (
                        <button
                            onClick={onConfirm}
                            className="ml-3 px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                        >
                            Proceed
                        </button>
                    )}

                    {onConfirm && type === 'success' && (
                        <button
                            onClick={onConfirm}
                            className="ml-3 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                            Confirm
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex text-gray-500 hover:text-gray-700"
                    >
                        <span className="sr-only">Close</span>
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
