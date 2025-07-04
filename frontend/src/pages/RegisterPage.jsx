import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '../utils/validationSchemas'; // Import register schema
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook

const RegisterPage = ({ navigate }) => {
    const { register: authRegister, showMessage } = useAuth(); // Get register function and showMessage from AuthContext

    // Initialize react-hook-form with yup resolver
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(registerSchema),
        defaultValues: {
            role: 'user' // Set default role for registration
        }
    });

    // Handle form submission
    const onSubmit = async (data) => {
        const success = await authRegister(data.name, data.email, data.password, data.role);
        if (success) {
            navigate('login'); // Redirect to login after successful registration
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
                <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Register</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            {...register('name')} // Register input
                            placeholder="Your Name"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            {...register('email')} // Register input
                            placeholder="your@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            {...register('password')} // Register input
                            placeholder="********"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="role">Role</label>
                        <select
                            id="role"
                            {...register('role')} // Register select input
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 font-bold text-lg"
                    >
                        Register
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-gray-600">Already have an account? <span className="text-purple-600 hover:underline cursor-pointer" onClick={() => navigate('login')}>Login here</span></p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
