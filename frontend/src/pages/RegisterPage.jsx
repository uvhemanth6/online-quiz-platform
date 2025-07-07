// frontend/src/pages/RegisterPage.jsx  // Registration form page

import React, { useState } from 'react'; // Import useState
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const RegisterPage = () => {
    const { register: authRegister, showMessage } = useAuth(); // Get register function and showMessage from AuthContext
    const navigate = useNavigate(); // Initialize useNavigate hook

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // Default role for registration

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        if (!name || !email || !password) {
            showMessage('All fields are required for registration!', 'error');
            return;
        }
        const success = await authRegister(name, email, password, role);
        if (success) {
            navigate('/login'); // Redirect to login after successful registration
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-light p-4">
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-primary-200">
                <h2 className="text-3xl font-bold text-center text-primary-700 mb-6">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-dark text-sm font-semibold mb-2" htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-dark text-sm font-semibold mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@example.com"
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
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-dark text-sm font-semibold mb-2" htmlFor="role">Role</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 font-bold text-lg"
                    >
                        Register
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-gray-600">Already have an account? <span className="text-primary-600 hover:underline cursor-pointer" onClick={() => navigate('/login')}>Login here</span></p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
