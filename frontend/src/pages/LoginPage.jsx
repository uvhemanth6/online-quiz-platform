// frontend/src/pages/LoginPage.jsx     // Login form page (Enhanced)

import React, { useState } from 'react'; // Import useState
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const LoginPage = () => {
    const { login: authLogin, showMessage } = useAuth(); // Get login function and showMessage from AuthContext
    const navigate = useNavigate(); // Initialize useNavigate hook

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        if (!email || !password) {
            showMessage('Email and password are required!', 'error');
            return;
        }
        const success = await authLogin(email, password);
        if (success) {
            navigate('/dashboard'); // Redirect to dashboard on successful login
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4 sm:p-8">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-5xl">
                {/* Left Section: Marketing/Visual Content */}
                <div className="md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-primary-600 to-primary-700 text-white flex flex-col justify-center items-center text-center">
                    <h2 className="text-4xl font-extrabold mb-4 leading-tight">Welcome Back!</h2>
                    <p className="text-lg mb-6 opacity-90">
                        Sign in to continue your journey of knowledge and explore exciting new quizzes.
                    </p>
                    {/* Placeholder for an SVG icon or image - replaced with a simpler one */}
                    <svg className="w-24 h-24 text-white opacity-80 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                    </svg>
                    <p className="text-sm opacity-70">
                        New to the platform? Join our community and start quizzing today!
                    </p>
                    <button
                        onClick={() => navigate('/register')}
                        className="mt-6 bg-white text-primary-700 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-primary-100 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-300"
                    >
                        Register Now
                    </button>
                </div>

                {/* Right Section: Login Form */}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-center text-primary-700 mb-8">Login to Your Account</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-dark text-sm font-semibold mb-2" htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-dark text-sm font-semibold mb-2" htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="********"
                                className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 font-bold text-lg shadow-md transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-300"
                        >
                            Login
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Forgot your password? <span className="text-primary-600 hover:underline cursor-pointer">Reset it here</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
