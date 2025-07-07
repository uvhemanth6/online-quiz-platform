// frontend/src/pages/NotFoundPage.jsx  // 404 error page

import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const NotFoundPage = () => { // Removed navigate from props
    const navigate = useNavigate(); // Initialize useNavigate hook

    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-light text-center p-4">
            <h1 className="text-6xl font-extrabold text-danger mb-4">404</h1>
            <p className="text-2xl text-dark mb-6">Page Not Found</p>
            <p className="text-lg text-gray-600 mb-8">Oops! The page you are looking for does not exist.</p>
            <button
                onClick={() => navigate('/')} // Use React Router navigate
                className="bg-primary-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-primary-700 font-semibold text-lg"
            >
                Go to Home
            </button>
        </div>
    );
};

export default NotFoundPage;
