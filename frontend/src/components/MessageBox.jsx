import React from 'react';

const MessageBox = ({ message }) => {
    if (!message || !message.text) return null; // Don't render if no message

    // Determine background color based on message type
    const bgColor = message.type === 'success' ? 'bg-green-500' :
                    message.type === 'error' ? 'bg-red-500' : 'bg-blue-500';

    return (
        <div className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded-md shadow-lg z-50 transition-opacity duration-300 ${message.text ? 'opacity-100' : 'opacity-0'}`}>
            {message.text}
        </div>
    );
};

export default MessageBox;
