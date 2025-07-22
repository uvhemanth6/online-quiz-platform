import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';

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
        <div className="classic-bg min-h-screen flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-gray-900/90 to-blue-900/80 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl w-full max-w-lg border border-blue-700/40 hover:border-cyan-400/50 transition-all duration-300">
                <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-10 drop-shadow-lg">
                    Create Account
                </h2>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                            required
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@example.com"
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
                    <div>
                        <Label htmlFor="role">Role</Label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent mt-2"
                        >
                            <option value="user" className="bg-gray-800">User</option>
                            <option value="admin" className="bg-gray-800">Admin</option>
                        </select>
                    </div>
                    <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        Register Now
                    </Button>
                </form>
                <div className="mt-8 text-center">
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