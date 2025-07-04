import React from 'react';

const NotFoundPage = ({ navigate }) => {
    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-gray-100 text-center p-4">
            <h1 className="text-6xl font-extrabold text-red-600 mb-4">404</h1>
            <p className="text-2xl text-gray-700 mb-6">Page Not Found</p>
            <p className="text-lg text-gray-600 mb-8">Oops! The page you are looking for does not exist.</p>
            <button
                onClick={() => navigate('home')}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-700 font-semibold text-lg"
            >
                Go to Home
            </button>
        </div>
    );
};

export default NotFoundPage;
