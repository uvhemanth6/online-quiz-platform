import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';

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
        <div className="classic-bg min-h-screen flex items-center justify-center p-4 sm:p-8">
            <div className="bg-gradient-to-br from-gray-900/90 to-blue-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-5xl border border-blue-700/40 hover:border-cyan-400/50 transition-all duration-300">
                {/* Left Section: Marketing/Visual Content */}
                <div className="md:w-1/2 p-10 md:p-14 bg-gradient-to-br from-blue-700 via-cyan-600 to-blue-500 text-white flex flex-col justify-center items-center text-center">
                    <h2 className="text-5xl font-extrabold mb-4 leading-tight drop-shadow-xl">Welcome Back!</h2>
                    <p className="text-lg mb-6 text-blue-100 font-medium">
                        Sign in to continue your journey of knowledge and explore exciting new quizzes.
                    </p>
                    <svg className="w-24 h-24 text-white opacity-90 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                    </svg>
                    <p className="text-sm text-blue-200">
                        New to the platform? Join our community and start quizzing today!
                    </p>
                    <Button
                        onClick={() => navigate('/register')}
                        size="lg"
                        className="mt-6 bg-white text-blue-700 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-100 hover:text-blue-800 transition-all duration-300 hover:-translate-y-1"
                    >
                        Register Now
                    </Button>
                </div>

                {/* Right Section: Login Form */}
                <div className="md:w-1/2 p-10 md:p-14 flex flex-col justify-center">
                    <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-10 drop-shadow-lg">
                        Login to Your Account
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="********"
                                required
                                className="mt-2"
                            />
                        </div>
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            Login
                        </Button>
                    </form>
                    <div className="mt-8 text-center">
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