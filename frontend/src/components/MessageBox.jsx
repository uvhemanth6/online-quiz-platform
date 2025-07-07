// frontend/src/components/MessageBox.jsx // Component to display system messages (success, error, info)

import React, { useEffect, useState } from 'react';

const MessageBox = ({ message, type, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(100);
    const duration = 5000; // 5 seconds

    useEffect(() => {
        if (message && message.text) { // Check for message.text to ensure it's valid
            setIsVisible(true);
            setProgress(100); // Reset progress on new message
            const timer = setTimeout(() => {
                setIsVisible(false);
                // Give some time for fade-out animation before calling onClose
                setTimeout(() => onClose(), 300);
            }, duration);

            const interval = setInterval(() => {
                setProgress(prev => Math.max(0, prev - (100 / (duration / 100)))); // Decrease progress over time
            }, 100);

            return () => {
                clearTimeout(timer);
                clearInterval(interval);
            };
        } else {
            setIsVisible(false);
            setProgress(100); // Reset progress when no message
        }
    }, [message, onClose]);

    // Only render if there's a message text or it's currently fading out
    if (!message || !message.text && !isVisible) return null;

    let bgColorClass = '';
    let textColorClass = 'text-white';
    let borderColorClass = '';

    // Use message.type for dynamic styling
    switch (message.type) {
        case 'success':
            bgColorClass = 'bg-secondary-500';
            borderColorClass = 'border-secondary-600';
            break;
        case 'error':
            bgColorClass = 'bg-danger-500';
            borderColorClass = 'border-danger-600';
            break;
        case 'info':
            bgColorClass = 'bg-info-500';
            borderColorClass = 'border-info-600';
            break;
        case 'warning':
            bgColorClass = 'bg-warning-500';
            borderColorClass = 'border-warning-600';
            break;
        default:
            bgColorClass = 'bg-gray-700';
            borderColorClass = 'border-gray-800';
    }

    const containerClasses = `
        fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center justify-between space-x-4
        transform transition-all duration-300 ease-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${bgColorClass} ${borderColorClass} border
        min-w-[280px] max-w-sm
    `;

    return (
        <div className={containerClasses}>
            <p className={`${textColorClass} font-semibold text-sm flex-grow`}>
                {message.text} {/* FIX: Render message.text instead of message object */}
            </p>
            <div className="relative w-full h-1 bg-white bg-opacity-30 rounded-full mt-2 overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-full bg-white transition-all duration-100 linear"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <button
                onClick={() => setIsVisible(false)} // Trigger fade-out
                className="text-white hover:text-gray-200 focus:outline-none ml-4 -mt-6"
                aria-label="Close message"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    );
};

export default MessageBox;
