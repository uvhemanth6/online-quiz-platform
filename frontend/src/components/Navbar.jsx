import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';

const NavBar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleNavigation = (path) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMobileMenuOpen(false);
    };

    // Close mobile menu when clicking outside
    const handleClickOutside = (e) => {
        if (!e.target.closest('.nav-container')) {
            setIsMobileMenuOpen(false);
        }
    };

    // Add event listener for outside clicks
    React.useEffect(() => {
        if (isMobileMenuOpen) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    return (
        <nav className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 animate-gradient-x bg-[length:400%_400%] text-white sticky top-0 z-40 shadow-lg">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    {/* Logo/Brand */}
                    <Link
                        to="/"
                        className="text-2xl font-bold text-primary-100 hover:text-white transition-colors duration-200"
                    >
                        QuizMaster
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden text-primary-100 hover:text-white focus:outline-none"
                        aria-expanded={isMobileMenuOpen}
                        aria-label="Toggle navigation"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-6">
                        <Link to="/" className="hover:text-primary-200 transition-colors duration-200">
                            Home
                        </Link>
                        
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="hover:text-primary-200 transition-colors duration-200">
                                    Dashboard
                                </Link>
                                {user?.role === 'admin' && (
                                    <Link to="/create-quiz" className="hover:text-primary-200 transition-colors duration-200">
                                        Create Quiz
                                    </Link>
                                )}
                                <div className="flex items-center space-x-4">
                                    <span className="text-primary-100">Hi, {user?.name || 'User'}</span>
                                    <Button
                                        onClick={handleLogout}
                                        className="bg-pink-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-semibold"
                                    >
                                        Logout
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="hover:text-primary-200 transition-colors duration-200">
                                    Login
                                </Link>
                                <Button
                                    onClick={() => handleNavigation('/register')}
                                    className="bg-pink-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-semibold"
                                >
                                    Register
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                <div className={`nav-container lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} mt-4 pb-4`}>
                    <div className="flex flex-col space-y-4">
                        <Link 
                            to="/" 
                            className="py-2 hover:text-primary-200 transition-colors duration-200"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        
                        {isAuthenticated ? (
                            <>
                                <Link 
                                    to="/dashboard" 
                                    className="py-2 hover:text-primary-200 transition-colors duration-200"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                {user?.role === 'admin' && (
                                    <Link 
                                        to="/create-quiz" 
                                        className="py-2 hover:text-primary-200 transition-colors duration-200"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Create Quiz
                                    </Link>
                                )}
                                <div className="pt-2 border-t border-primary-700">
                                    <span className="block py-2 text-primary-100">Logged in as {user?.name || 'User'}</span>
                                    <Button
                                        onClick={handleLogout}
                                        className="w-full bg-pink-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors duration-200 font-semibold"
                                    >
                                        Logout
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/login" 
                                    className="py-2 hover:text-primary-200 transition-colors duration-200"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Button 
                                    onClick={() => { handleNavigation('/register'); setIsMobileMenuOpen(false); }}
                                    className="bg-pink-600 hover:bg-purple-700 text-white py-2 text-center rounded-lg transition-colors duration-200 font-semibold"
                                >
                                    Register
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;