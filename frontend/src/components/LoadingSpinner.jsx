// frontend/src/components/LoadingSpinner.jsx // Simple loading spinner component

import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
    let spinnerSizeClass = '';
    let spinnerColorClass = '';
    let borderStyle = 'border-t-4 border-r-4'; // Default to a standard spinner style

    switch (size) {
        case 'sm':
            spinnerSizeClass = 'w-6 h-6';
            break;
        case 'md':
            spinnerSizeClass = 'w-10 h-10';
            break;
        case 'lg':
            spinnerSizeClass = 'w-16 h-16';
            break;
        default:
            spinnerSizeClass = 'w-10 h-10';
    }

    switch (color) {
        case 'primary':
            spinnerColorClass = 'border-primary-500 border-solid';
            break;
        case 'secondary':
            spinnerColorClass = 'border-secondary-500 border-solid';
            break;
        case 'info':
            spinnerColorClass = 'border-info-500 border-solid';
            break;
        case 'danger':
            spinnerColorClass = 'border-danger-500 border-solid';
            break;
        case 'dark':
            spinnerColorClass = 'border-dark border-solid';
            break;
        case 'white':
            spinnerColorClass = 'border-white border-solid';
            break;
        default:
            spinnerColorClass = 'border-gray-500 border-solid';
    }

    return (
        <div className="flex justify-center items-center h-full min-h-[100px] py-8">
            <div
                className={`animate-spin rounded-full ${spinnerSizeClass} ${borderStyle} ${spinnerColorClass} border-opacity-75`}
                style={{ borderColor: `var(--color-${color}-500)`}} // Fallback/direct color use
            ></div>
        </div>
    );
};

export default LoadingSpinner;
