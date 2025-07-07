// frontend/src/pages/HomePage.jsx      // Home page content (Enhanced)

import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const HomePage = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook

    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 text-center p-4 sm:p-8">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-primary-800 mb-6 drop-shadow-lg leading-tight">
                Master Your Knowledge with Our <span className="text-primary-600">Dynamic Quiz Platform</span>
            </h1>
            <p className="text-lg sm:text-xl text-dark mb-10 max-w-3xl">
                Dive into a world of interactive quizzes designed to challenge and educate. Whether you're a student, professional, or just curious, our platform offers a seamless and engaging learning experience.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl w-full">
                {/* Feature Card 1 */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-primary-100 transform hover:scale-105 transition duration-300">
                    <div className="text-primary-500 mb-4">
                        {/* Icon for Timed Challenges */}
                        <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-dark mb-2">Timed Challenges</h3>
                    <p className="text-gray-600 text-sm">Test your speed and accuracy with timed quizzes across various categories.</p>
                </div>

                {/* Feature Card 2 */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-primary-100 transform hover:scale-105 transition duration-300">
                    <div className="text-secondary-500 mb-4">
                        {/* Icon for Admin Control */}
                        <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-dark mb-2">Admin Control</h3>
                    <p className="text-gray-600 text-sm">Admins can effortlessly create, manage, and evaluate quizzes.</p>
                </div>

                {/* Feature Card 3 */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-primary-100 transform hover:scale-105 transition duration-300">
                    <div className="text-accent mb-4">
                        {/* Icon for Instant Results */}
                        <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.001 12.001 0 002.92 12c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-dark mb-2">Instant Results</h3>
                    <p className="text-gray-600 text-sm">Get immediate scores and detailed performance analysis after each quiz.</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                    className="bg-primary-600 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-xl hover:bg-primary-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-300"
                    onClick={() => navigate('/dashboard')} // Use React Router navigate
                >
                    Get Started
                </button>
                <button
                    className="bg-white text-primary-600 border-2 border-primary-600 px-10 py-4 rounded-full text-lg font-semibold shadow-xl hover:bg-primary-50 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-300"
                    onClick={() => navigate('/register')} // Use React Router navigate
                >
                    Join Now
                </button>
            </div>
            <div className="mt-16 text-gray-600 text-sm">
                <p>&copy; 2025 Online Quiz Platform. All rights reserved.</p>
            </div>
        </div>
    );
};

export default HomePage;
