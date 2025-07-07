// frontend/src/components/NavBar.jsx // Main navigation bar

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import { useAuth } from '../contexts/AuthContext';

const NavBar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate(); // Initialize useNavigate hook
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // This function is for programmatic navigation, e.g., after logout
    const handleNavigation = (path) => {
        navigate(path);
        setIsMobileMenuOpen(false); // Close mobile menu on navigation
    };

    const handleLogout = () => {
        logout(); // Call the logout function from AuthContext
        navigate('/login'); // Redirect to login after logout
        setIsMobileMenuOpen(false); // Close mobile menu on logout
    };

    return (
        <nav className="bg-primary-800 text-white p-4 shadow-md sticky top-0 z-40">
            <div className="container mx-auto flex justify-between items-center flex-wrap">
                {/* Logo/Brand */}
                <Link
                    to="/" // Use Link component for navigation
                    className="text-2xl font-bold cursor-pointer text-primary-100 hover:text-primary-50 transition-colors duration-200"
                >
                    Quizzer
                </Link>

                {/* Mobile Menu Button (Hamburger) */}
                <div className="block lg:hidden">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-primary-100 hover:text-primary-50 focus:outline-none focus:text-primary-50"
                        aria-label="Toggle navigation"
                    >
                        <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M18.278 16.864a1 1 0 0 0 0-1.414l-4.243-4.243a1 1 0 1 0-1.414 1.414l4.243 4.243a1 1 0 0 0 1.414 0zM5.722 16.864a1 1 0 0 1 0-1.414l4.243-4.243a1 1 0 1 1 1.414 1.414l-4.243 4.243a1 1 0 0 1 0-1.414zM18.278 7.136a1 1 0 0 0-1.414 0l-4.243 4.243a1 1 0 1 0 1.414 1.414l4.243-4.243a1 1 0 0 0 0-1.414zM5.722 7.136a1 1 0 0 1 1.414 0l4.243 4.243a1 1 0 1 1-1.414 1.414l-4.243-4.243a1 1 0 0 1 0-1.414z"
                                />
                            ) : (
                                <path
                                    fillRule="evenodd"
                                    d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Desktop Menu & Mobile Menu Content */}
                <div
                    className={`${
                        isMobileMenuOpen ? 'block' : 'hidden'
                    } w-full lg:flex lg:items-center lg:w-auto`}
                >
                    <ul className="text-xl lg:flex items-center space-y-4 lg:space-y-0 lg:space-x-8 mt-4 lg:mt-0">
                        <li>
                            <Link
                                to="/"
                                className="block w-full text-left lg:inline-block hover:text-primary-300 transition-colors duration-200"
                                onClick={() => setIsMobileMenuOpen(false)} // Close mobile menu on click
                            >
                                Home
                            </Link>
                        </li>
                        {isAuthenticated ? (
                            <>
                                <li>
                                    <Link
                                        to="/dashboard"
                                        className="block w-full text-left lg:inline-block hover:text-primary-300 transition-colors duration-200"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                                {user?.role === 'admin' && (
                                    <li>
                                        <Link
                                            to="/create-quiz"
                                            className="block w-full text-left lg:inline-block hover:text-primary-300 transition-colors duration-200"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Create Quiz
                                        </Link>
                                    </li>
                                )}
                                <li>
                                    <button
                                        onClick={handleLogout} // This is the logout button
                                        className="block w-full text-left lg:inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                                    >
                                        Logout ({user?.name || 'User'})
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        to="/login"
                                        className="block w-full text-left lg:inline-block hover:text-primary-300 transition-colors duration-200"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/register"
                                        className="block w-full text-left lg:inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
