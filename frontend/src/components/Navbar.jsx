// frontend/src/components/Navbar.jsx   // Navigation bar component

import React from 'react';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook

const Navbar = ({ navigate }) => {
    const { currentUser, logout } = useAuth(); // Get current user and logout function from AuthContext

    return (
        <nav className="bg-gradient-to-r from-purple-600 to-indigo-700 p-4 shadow-lg">
            <div className="container flex justify-between items-center">
                {/* Application title/logo, navigates to home */}
                <div className="text-white text-2xl font-bold cursor-pointer" onClick={() => navigate('home')}>Online Quiz</div>
                <div className="flex items-center space-x-4">
                    {/* Conditional rendering based on authentication status */}
                    {currentUser ? (
                        <>
                            {/* Display user name and role */}
                            <span className="text-white text-sm">Welcome, {currentUser.name}! ({currentUser.role})</span>
                            {/* Dashboard button */}
                            <button className="text-white hover:text-purple-200 transition duration-300" onClick={() => navigate('dashboard')}>Dashboard</button>
                            {/* Logout button */}
                            <button className="bg-white text-purple-600 px-4 py-2 rounded-full shadow-md hover:bg-purple-100 transition duration-300 font-semibold" onClick={logout}>Logout</button>
                        </>
                    ) : (
                        <>
                            {/* Login button */}
                            <button className="text-white hover:text-purple-200 transition duration-300" onClick={() => navigate('login')}>Login</button>
                            {/* Register button */}
                            <button className="text-white hover:text-purple-200 transition duration-300" onClick={() => navigate('register')}>Register</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;