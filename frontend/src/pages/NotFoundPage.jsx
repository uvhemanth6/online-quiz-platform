import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-center p-4">
            <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500 mb-4">
                404
            </h1>
            <p className="text-3xl text-white mb-6">Page Not Found</p>
            <p className="text-xl text-gray-400 mb-8">
                Oops! The page you are looking for doesn't exist or has been moved.
            </p>
            <button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-lg shadow-lg hover:from-blue-600 hover:to-cyan-600 font-bold text-lg transition-all duration-300 hover:-translate-y-1"
            >
                Go to Home
            </button>
        </div>
    );
};

export default NotFoundPage;