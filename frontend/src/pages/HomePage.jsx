import React from 'react';

const HomePage = ({ navigate }) => {
    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 text-center p-4">
            <h1 className="text-5xl font-extrabold text-purple-800 mb-6 drop-shadow-lg">Welcome to the Online Quiz Platform!</h1>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl">Test your knowledge with engaging quizzes. Admins can create and manage quizzes with ease.</p>
            <div className="flex space-x-4">
                <button
                    className="bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-purple-700 transform hover:scale-105"
                    onClick={() => navigate('dashboard')}
                >
                    Get Started
                </button>
                <button
                    className="bg-white text-purple-600 border border-purple-600 px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-purple-50 transform hover:scale-105"
                    onClick={() => navigate('register')}
                >
                    Join Now
                </button>
            </div>
            <div className="mt-12 text-gray-600 text-sm">
                <p>&copy; 2025 Online Quiz Platform. All rights reserved.</p>
            </div>
        </div>
    );
};

export default HomePage;