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
        if (message.type === 'success') return { bg: 'bg-green-500/90', border: 'border-green-400/80', shadow: 'shadow-green-400/40' };
        if (message.type === 'error') return { bg: 'bg-pink-600/90', border: 'border-pink-400/80', shadow: 'shadow-pink-400/40' };
        const text = message.text.toLowerCase();
        const successKeywords = ['success', 'logged in', 'logged out', 'welcome', 'thank you'];
        const errorKeywords = ['error', 'fail', 'invalid', 'wrong', 'rejected'];
        if (successKeywords.some(keyword => text.includes(keyword))) {
            return { bg: 'bg-green-500/90', border: 'border-green-400/80', shadow: 'shadow-green-400/40' };
        }
        if (errorKeywords.some(keyword => text.includes(keyword))) {
            return { bg: 'bg-pink-600/90', border: 'border-pink-400/80', shadow: 'shadow-pink-400/40' };
        }
        return { bg: 'bg-purple-500/90', border: 'border-purple-400/80', shadow: 'shadow-purple-400/40' };
    };

    const { bg, border, shadow } = getMessageColor();

    return (
        <div className={`
            fixed top-4 right-4 z-50 p-4 rounded-2xl border-2 backdrop-blur-xl
            transform transition-all duration-300 ease-out
            ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            ${bg} ${border} ${shadow}
            min-w-[280px] max-w-sm
            animate-pulse border-gradient-to-r from-pink-400 via-purple-400 to-indigo-400
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