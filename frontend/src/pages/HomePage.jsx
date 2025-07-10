import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Reusable component for animating elements on scroll
const FadeInOnScroll = ({ children, className = '' }) => {
    const domRef = useRef();
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        if (domRef.current) observer.observe(domRef.current);
        
        return () => {
            if (domRef.current) observer.unobserve(domRef.current);
        };
    }, []);

    return (
        <div className={`fade-in-section ${className}`} ref={domRef}>
            {children}
        </div>
    );
};

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative w-full py-24 px-4 text-center flex flex-col items-center justify-center min-h-screen z-10">
                <FadeInOnScroll>
                    <h1 className="text-5xl sm:text-7xl font-extrabold mb-6 leading-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                            Quizzer
                        </span>: Master Your Knowledge
                    </h1>
                </FadeInOnScroll>
                <FadeInOnScroll className="delay-100">
                    <p className="text-lg sm:text-xl text-gray-300 mb-12 max-w-4xl">
                        Dive into a universe of interactive quizzes designed to challenge and educate. 
                        Whether you're a student, professional, or just curious, our platform offers 
                        a seamless and engaging learning experience.
                    </p>
                </FadeInOnScroll>
                <FadeInOnScroll className="delay-200">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        <button
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            onClick={() => navigate('/register')}
                        >
                            Get Started
                        </button>
                        <button
                            className="bg-transparent text-cyan-400 border-2 border-cyan-400/50 hover:border-cyan-400 px-8 py-4 rounded-full text-lg font-semibold hover:bg-cyan-400/10 transition-all duration-300 hover:-translate-y-1"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </button>
                    </div>
                </FadeInOnScroll>
            </section>

            {/* Features Section */}
            <section className="w-full py-24 px-4 bg-gray-800/40 backdrop-blur-sm">
                <div className="container mx-auto text-center">
                    <FadeInOnScroll>
                        <h2 className="text-4xl font-bold text-white mb-16">
                            Key Features
                        </h2>
                    </FadeInOnScroll>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature Card 1 */}
                        <FadeInOnScroll className="delay-100">
                            <div className="bg-gray-800/70 p-8 rounded-xl border border-gray-700 hover:border-cyan-400/30 transition-all duration-500 hover:-translate-y-2 shadow-lg hover:shadow-xl">
                                <div className="text-cyan-400 mb-6">
                                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Timed Challenges</h3>
                                <p className="text-gray-400">
                                    Test your speed and accuracy with timed quizzes across various categories, pushing your limits.
                                </p>
                            </div>
                        </FadeInOnScroll>

                        {/* Feature Card 2 */}
                        <FadeInOnScroll className="delay-200">
                            <div className="bg-gray-800/70 p-8 rounded-xl border border-gray-700 hover:border-blue-400/30 transition-all duration-500 hover:-translate-y-2 shadow-lg hover:shadow-xl">
                                <div className="text-blue-400 mb-6">
                                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Admin Control</h3>
                                <p className="text-gray-400">
                                    Admins can effortlessly create, manage, and evaluate quizzes with a powerful dashboard.
                                </p>
                            </div>
                        </FadeInOnScroll>

                        {/* Feature Card 3 */}
                        <FadeInOnScroll className="delay-300">
                            <div className="bg-gray-800/70 p-8 rounded-xl border border-gray-700 hover:border-purple-400/30 transition-all duration-500 hover:-translate-y-2 shadow-lg hover:shadow-xl">
                                <div className="text-purple-400 mb-6">
                                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.001 12.001 0 002.92 12c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Instant Results</h3>
                                <p className="text-gray-400">
                                    Get immediate scores and detailed performance analysis after each quiz submission.
                                </p>
                            </div>
                        </FadeInOnScroll>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="w-full py-24 px-4 bg-gray-800/30 backdrop-blur-sm">
                <div className="container mx-auto text-center">
                    <FadeInOnScroll>
                        <h2 className="text-4xl font-bold text-white mb-16">
                            How It Works
                        </h2>
                    </FadeInOnScroll>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <FadeInOnScroll className="delay-100">
                            <div className="bg-gray-800/70 p-8 rounded-xl border border-gray-700 hover:border-cyan-400/30 transition-all duration-500 hover:-translate-y-1 shadow-lg">
                                <div className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 text-6xl font-extrabold mb-4">1</div>
                                <h3 className="text-2xl font-semibold text-white mb-2">Register/Login</h3>
                                <p className="text-gray-400">
                                    Create your free account or log in to access the platform.
                                </p>
                            </div>
                        </FadeInOnScroll>
                        <FadeInOnScroll className="delay-200">
                            <div className="bg-gray-800/70 p-8 rounded-xl border border-gray-700 hover:border-blue-400/30 transition-all duration-500 hover:-translate-y-1 shadow-lg">
                                <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 text-6xl font-extrabold mb-4">2</div>
                                <h3 className="text-2xl font-semibold text-white mb-2">Explore Quizzes</h3>
                                <p className="text-gray-400">
                                    Browse a wide range of quizzes by category and difficulty.
                                </p>
                            </div>
                        </FadeInOnScroll>
                        <FadeInOnScroll className="delay-300">
                            <div className="bg-gray-800/70 p-8 rounded-xl border border-gray-700 hover:border-purple-400/30 transition-all duration-500 hover:-translate-y-1 shadow-lg">
                                <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-6xl font-extrabold mb-4">3</div>
                                <h3 className="text-2xl font-semibold text-white mb-2">Take the Quiz</h3>
                                <p className="text-gray-400">
                                    Answer questions within the time limit and submit your responses.
                                </p>
                            </div>
                        </FadeInOnScroll>
                        <FadeInOnScroll className="delay-400">
                            <div className="bg-gray-800/70 p-8 rounded-xl border border-gray-700 hover:border-green-400/30 transition-all duration-500 hover:-translate-y-1 shadow-lg">
                                <div className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400 text-6xl font-extrabold mb-4">4</div>
                                <h3 className="text-2xl font-semibold text-white mb-2">View Results</h3>
                                <p className="text-gray-400">
                                    Get instant feedback and detailed insights into your performance.
                                </p>
                            </div>
                        </FadeInOnScroll>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="w-full py-24 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-center">
                <div className="container mx-auto">
                    <FadeInOnScroll>
                        <h2 className="text-4xl font-bold mb-8">
                            Ready to Ignite Your Mind?
                        </h2>
                    </FadeInOnScroll>
                    <FadeInOnScroll className="delay-100">
                        <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
                            Join thousands of users who are challenging themselves daily. 
                            Sign up now and start your quiz journey!
                        </p>
                    </FadeInOnScroll>
                    <FadeInOnScroll className="delay-200">
                        <button
                            onClick={() => navigate('/register')}
                            className="bg-white text-blue-700 hover:text-blue-800 px-10 py-4 rounded-full text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                        >
                            Sign Up for Free
                        </button>
                    </FadeInOnScroll>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full py-8 bg-gray-900/80 text-gray-400 text-center text-sm border-t border-gray-800">
                <div className="container mx-auto">
                    <p>&copy; 2025 Quizzer. All rights reserved.</p>
                    <p className="mt-2">Designed with passion and knowledge.</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;