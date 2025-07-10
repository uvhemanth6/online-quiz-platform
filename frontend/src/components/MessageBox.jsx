import React, { useEffect, useState } from 'react';

const MessageBox = ({ message, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(100);
    const duration = 5000; // 5 seconds

    useEffect(() => {
        if (message?.text) {
            setIsVisible(true);
            setProgress(100);
            
            const timer = setTimeout(() => {
                handleClose();
            }, duration);

            const interval = setInterval(() => {
                setProgress(prev => Math.max(0, prev - (100 / (duration / 100))));
            }, 100);

            return () => {
                clearTimeout(timer);
                clearInterval(interval);
            };
        } else {
            setIsVisible(false);
        }
    }, [message]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose?.();
        }, 300); // Match transition duration
    };

    if (!message?.text && !isVisible) return null;

    // Determine message type and color
    const getMessageColor = () => {
        // If type is explicitly provided
        if (message.type === 'success') return { bg: 'bg-green-500', border: 'border-green-600' };
        if (message.type === 'error') return { bg: 'bg-red-500', border: 'border-red-600' };
        
        // Auto-detect based on message content (case insensitive)
        const text = message.text.toLowerCase();
        const successKeywords = ['success', 'logged in', 'logged out', 'welcome', 'thank you'];
        const errorKeywords = ['error', 'fail', 'invalid', 'wrong', 'rejected'];
        
        if (successKeywords.some(keyword => text.includes(keyword))) {
            return { bg: 'bg-green-500', border: 'border-green-600' };
        }
        if (errorKeywords.some(keyword => text.includes(keyword))) {
            return { bg: 'bg-red-500', border: 'border-red-600' };
        }
        
        // Default to green for positive messages
        return { bg: 'bg-green-500', border: 'border-green-600' };
    };

    const { bg, border } = getMessageColor();

    return (
        <div className={`
            fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border
            transform transition-all duration-300 ease-out
            ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            ${bg} ${border}
            min-w-[280px] max-w-sm
        `}>
            <div className="flex items-start justify-between gap-3">
                <p className="text-white font-medium text-sm flex-grow">
                    {message.text}
                </p>
                <button
                    onClick={handleClose}
                    className="text-white hover:text-gray-200 focus:outline-none"
                    aria-label="Close message"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="relative w-full h-1 bg-white bg-opacity-30 rounded-full mt-2 overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-full bg-white transition-all duration-100"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

export default MessageBox;