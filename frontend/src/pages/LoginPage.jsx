import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const { login: authLogin, showMessage } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            showMessage('Email and password are required!', 'error');
            return;
        }
        const success = await authLogin(email, password);
        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8">
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-5xl border border-gray-700 hover:border-cyan-400/30 transition-all duration-300">
                {/* Left Section: Marketing/Visual Content */}
                <div className="md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-blue-600 to-cyan-600 text-white flex flex-col justify-center items-center text-center">
                    <h2 className="text-4xl font-extrabold mb-4 leading-tight">Welcome Back!</h2>
                    <p className="text-lg mb-6 text-blue-100">
                        Sign in to continue your journey of knowledge and explore exciting new quizzes.
                    </p>
                    <svg className="w-24 h-24 text-white opacity-80 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                    </svg>
                    <p className="text-sm text-blue-200">
                        New to the platform? Join our community and start quizzing today!
                    </p>
                    <button
                        onClick={() => navigate('/register')}
                        className="mt-6 bg-white text-blue-700 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-100 hover:text-blue-800 transition-all duration-300 hover:-translate-y-1"
                    >
                        Register Now
                    </button>
                </div>

                {/* Right Section: Login Form */}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
                        Login to Your Account
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="********"
                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-200"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            Login
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            Forgot your password?{' '}
                            <span className="text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer transition-colors duration-200">
                                Reset it here
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;