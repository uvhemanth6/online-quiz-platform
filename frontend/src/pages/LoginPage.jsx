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
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
                <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Login</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            {...register('email')} // Register input with react-hook-form
                            placeholder="your@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            {...register('password')} // Register input with react-hook-form
                            placeholder="********"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 font-bold text-lg"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-gray-600">Don't have an account? <span className="text-purple-600 hover:underline cursor-pointer" onClick={() => navigate('register')}>Register here</span></p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
