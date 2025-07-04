// frontend/src/pages/LoginPage.jsx     // Login form page (Enhanced)

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../utils/validationSchemas'; // Import login schema
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook

const LoginPage = ({ navigate }) => {
    const { login: authLogin, showMessage } = useAuth(); // Get login function and showMessage from AuthContext

    // Initialize react-hook-form with yup resolver
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginSchema),
    });

    // Handle form submission
    const onSubmit = async (data) => {
        const success = await authLogin(data.email, data.password);
        if (success) {
            navigate('dashboard'); // Redirect to dashboard on successful login
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-5xl">
                {/* Left Section: Marketing/Visual Content */}
                <div className="md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex flex-col justify-center items-center text-center">
                    <h2 className="text-4xl font-extrabold mb-4 leading-tight">Welcome Back!</h2>
                    <p className="text-lg mb-6 opacity-90">
                        Sign in to continue your journey of knowledge and explore exciting new quizzes.
                    </p>
                    {/* Placeholder for an SVG icon or image */}
                    <svg className="w-24 h-24 text-white opacity-80 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                    <p className="text-sm opacity-70">
                        New to the platform? Join our community and start quizzing today!
                    </p>
                    <button
                        onClick={() => navigate('register')}
                        className="mt-6 bg-white text-purple-700 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-purple-100 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
                    >
                        Register Now
                    </button>
                </div>

                {/* Right Section: Login Form */}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-center text-purple-700 mb-8">Login to Your Account</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                {...register('email')}
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                {...register('password')}
                                placeholder="Enter your password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-bold text-lg shadow-md transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
                        >
                            Login
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Forgot your password? <span className="text-purple-600 hover:underline cursor-pointer">Reset it here</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;