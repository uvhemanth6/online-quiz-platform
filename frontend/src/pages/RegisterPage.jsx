import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const { register: authRegister, showMessage } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) {
            showMessage('All fields are required for registration!', 'error');
            return;
        }
        const success = await authRegister(name, email, password, role);
        if (success) {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
            <div className="bg-gray-800/70 backdrop-blur-sm p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-700 hover:border-cyan-400/30 transition-all duration-300">
                <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6">
                    Create Account
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@example.com"
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
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
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="role">
                            Role
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
                        >
                            <option value="user" className="bg-gray-800">User</option>
                            <option value="admin" className="bg-gray-800">Admin</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        Register Now
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-gray-400">
                        Already have an account?{' '}
                        <span 
                            className="text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer transition-colors duration-200"
                            onClick={() => navigate('/login')}
                        >
                            Login here
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;