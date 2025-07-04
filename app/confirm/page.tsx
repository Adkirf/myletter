'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ConfirmPageInner() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const email = searchParams.get('email');
        const name = searchParams.get('name');
        const newsletters = searchParams.get('newsletters');
        const subscribedNewsletter = newsletters ? JSON.parse(decodeURIComponent(newsletters)) : [];

        if (!email || !name || !subscribedNewsletter) {
            setStatus('error');
            setMessage('Missing parameters');
            return;
        }

        // Call the API endpoint
        fetch(`/api/onboarding?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&newsletters=${encodeURIComponent(JSON.stringify(subscribedNewsletter))}`)
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    setStatus('success');
                    setMessage(data.message);
                } else {
                    setStatus('error');
                    setMessage(data.error || 'Something went wrong');
                }
            })
            .catch((error: Error) => {
                setStatus('error');
                setMessage(error.message || 'Something went wrong');
            });
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
                {status === 'loading' && (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Confirming your action...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">Success!</h3>
                        <p className="mt-2 text-gray-600">{message}</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">Error</h3>
                        <p className="mt-2 text-gray-600">{message}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ConfirmPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div><p className="mt-4 text-gray-600">Loading...</p></div></div>}>
            <ConfirmPageInner />
        </Suspense>
    );
} 