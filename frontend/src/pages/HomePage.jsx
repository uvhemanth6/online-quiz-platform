// frontend/src/pages/HomePage.jsx      // Home page content (Enhanced)

import React from 'react';

const HomePage = ({ navigate }) => {
    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 text-center p-4 sm:p-8">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-purple-800 mb-6 drop-shadow-lg leading-tight">
                Master Your Knowledge with Our <span className="text-indigo-600">Dynamic Quiz Platform</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-10 max-w-3xl">
                Dive into a world of interactive quizzes designed to challenge and educate. Whether you're a student, professional, or just curious, our platform offers a seamless and engaging learning experience.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl w-full">
                {/* Feature Card 1 */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 transform hover:scale-105 transition duration-300">
                    <div className="text-indigo-500 mb-4">
                        <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Timed Challenges</h3>
                    <p className="text-gray-600 text-sm">Test your speed and accuracy with timed quizzes across various categories.</p>
                </div>

                {/* Feature Card 2 */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 transform hover:scale-105 transition duration-300">
                    <div className="text-green-500 mb-4">
                        <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Admin Control</h3>
                    <p className="text-gray-600 text-sm">Admins can effortlessly create, manage, and evaluate quizzes.</p>
                </div>

                {/* Feature Card 3 */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 transform hover:scale-105 transition duration-300">
                    <div className="text-yellow-500 mb-4">
                        <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c1.657 0 3 .895 3 2v2.219a2.001 2.001 0 01-.5 1.419L11 15h2a2 2 0 012 2v2a2 2 0 01-2 2H7a2 0 01-2-2v-2a2 2 0 012-2h2l-1.5-1.5A2.001 2.001 0 019 10c0-1.105.895-2 2-2h1z"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Instant Results</h3>
                    <p className="text-gray-600 text-sm">Get immediate scores and detailed performance analysis after each quiz.</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                    className="bg-purple-600 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-xl hover:bg-purple-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
                    onClick={() => navigate('dashboard')}
                >
                    Get Started
                </button>
                <button
                    className="bg-white text-purple-600 border-2 border-purple-600 px-10 py-4 rounded-full text-lg font-semibold shadow-xl hover:bg-purple-50 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
                    onClick={() => navigate('register')}
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