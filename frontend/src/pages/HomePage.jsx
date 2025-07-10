// frontend/src/pages/HomePage.jsx      // Home page content with scroll animations and new dark theme

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
                    observer.unobserve(entry.target); // Stop observing once visible
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
        });

        if (domRef.current) {
            observer.observe(domRef.current);
        }

        return () => {
            if (domRef.current) {
                observer.unobserve(domRef.current);
            }
        };
    }, []);

    return (
        <div
            className={`fade-in-section ${className}`}
            ref={domRef}
        >
            {children}
        </div>
    );
};


const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center bg-dark-bg text-dark-text overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative w-full py-24 px-4 text-center flex flex-col items-center justify-center min-h-[calc(100vh-80px)] z-10">
                <FadeInOnScroll>
                    <h1 className="text-5xl sm:text-7xl font-extrabold text-dark-text-light mb-6 leading-tight drop-shadow-lg">
                        <span className="text-accent-primary">Quizzer</span>: Master Your Knowledge
                    </h1>
                </FadeInOnScroll>
                <FadeInOnScroll className="delay-100">
                    <p className="text-lg sm:text-xl text-dark-text-muted mb-12 max-w-4xl">
                        Dive into a universe of interactive quizzes designed to challenge and educate. Whether you're a student, professional, or just curious, our platform offers a seamless and engaging learning experience.
                    </p>
                </FadeInOnScroll>
                <FadeInOnScroll className="delay-200">
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                        <button
                            className="bg-gradient-to-r from-accent-primary to-accent-primary-dark text-white px-12 py-4 rounded-full text-lg font-semibold shadow-glow-md hover:shadow-glow-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-accent-primary-light"
                            onClick={() => navigate('/register')}
                            //  {/* Changed to /register */}
                        >
                            Get Started
                        </button>
                        <button
                            className="bg-dark-bg-light text-accent-primary border-2 border-accent-primary px-12 py-4 rounded-full text-lg font-semibold shadow-glow-sm hover:bg-dark-bg-lighter hover:border-accent-primary-light transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-accent-primary-light"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </button>
                    </div>
                </FadeInOnScroll>
            </section>

            {/* Features Section */}
            <section className="w-full py-20 px-4 bg-dark-bg-light shadow-inner z-10">
                <div className="container mx-auto text-center">
                    <FadeInOnScroll>
                        <h2 className="text-4xl font-bold text-dark-text-light mb-16">Key Features</h2>
                    </FadeInOnScroll>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Feature Card 1 */}
                        <FadeInOnScroll className="delay-100">
                            <div className="bg-dark-bg-lighter p-8 rounded-xl shadow-glow-md border border-dark-bg-lighter transform hover:scale-105 transition duration-300">
                                <div className="text-accent-primary text-opacity-80 mb-6">
                                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-dark-text-light mb-3">Timed Challenges</h3>
                                <p className="text-dark-text-muted text-base">Test your speed and accuracy with timed quizzes across various categories, pushing your limits.</p>
                            </div>
                        </FadeInOnScroll>

                        {/* Feature Card 2 */}
                        <FadeInOnScroll className="delay-200">
                            <div className="bg-dark-bg-lighter p-8 rounded-xl shadow-glow-md border border-dark-bg-lighter transform hover:scale-105 transition duration-300">
                                <div className="text-accent-secondary text-opacity-80 mb-6">
                                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-dark-text-light mb-3">Admin Control</h3>
                                <p className="text-dark-text-muted text-base">Admins can effortlessly create, manage, and evaluate quizzes with a powerful dashboard.</p>
                            </div>
                        </FadeInOnScroll>

                        {/* Feature Card 3 */}
                        <FadeInOnScroll className="delay-300">
                            <div className="bg-dark-bg-lighter p-8 rounded-xl shadow-glow-md border border-dark-bg-lighter transform hover:scale-105 transition duration-300">
                                <div className="text-info text-opacity-80 mb-6">
                                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.001 12.001 0 002.92 12c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-dark-text-light mb-3">Instant Results</h3>
                                <p className="text-dark-text-muted text-base">Get immediate scores and detailed performance analysis after each quiz submission.</p>
                            </div>
                        </FadeInOnScroll>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="w-full py-20 px-4 bg-dark-bg-light">
                <div className="container mx-auto text-center">
                    <FadeInOnScroll>
                        <h2 className="text-4xl font-bold text-dark-text-light mb-16">How It Works</h2>
                    </FadeInOnScroll>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        <FadeInOnScroll className="delay-100">
                            <div className="p-8 rounded-xl shadow-glow-md bg-dark-bg-lighter border border-dark-bg-lighter">
                                <div className="text-accent-primary text-6xl font-extrabold mb-4">1</div>
                                <h3 className="text-2xl font-semibold text-dark-text-light mb-2">Register/Login</h3>
                                <p className="text-dark-text-muted text-base">Create your free account or log in to access the platform.</p>
                            </div>
                        </FadeInOnScroll>
                        <FadeInOnScroll className="delay-200">
                            <div className="p-8 rounded-xl shadow-glow-md bg-dark-bg-lighter border border-dark-bg-lighter">
                                <div className="text-accent-primary text-6xl font-extrabold mb-4">2</div>
                                <h3 className="text-2xl font-semibold text-dark-text-light mb-2">Explore Quizzes</h3>
                                <p className="text-dark-text-muted text-base">Browse a wide range of quizzes by category and difficulty.</p>
                            </div>
                        </FadeInOnScroll>
                        <FadeInOnScroll className="delay-300">
                            <div className="p-8 rounded-xl shadow-glow-md bg-dark-bg-lighter border border-dark-bg-lighter">
                                <div className="text-accent-primary text-6xl font-extrabold mb-4">3</div>
                                <h3 className="text-2xl font-semibold text-dark-text-light mb-2">Take the Quiz</h3>
                                <p className="text-dark-text-muted text-base">Answer questions within the time limit and submit your responses.</p>
                            </div>
                        </FadeInOnScroll>
                        <FadeInOnScroll className="delay-400">
                            <div className="p-8 rounded-xl shadow-glow-md bg-dark-bg-lighter border border-dark-bg-lighter">
                                <div className="text-accent-primary text-6xl font-extrabold mb-4">4</div>
                                <h3 className="text-2xl font-semibold text-dark-text-light mb-2">View Results</h3>
                                <p className="text-dark-text-muted text-base">Get instant feedback and detailed insights into your performance.</p>
                            </div>
                        </FadeInOnScroll>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="w-full py-20 px-4 bg-gradient-to-r from-accent-primary-dark to-accent-primary-darker text-white text-center shadow-inner">
                <div className="container mx-auto">
                    <FadeInOnScroll>
                        <h2 className="text-4xl font-bold mb-8">Ready to Ignite Your Mind?</h2>
                    </FadeInOnScroll>
                    <FadeInOnScroll className="delay-100">
                        <p className="text-lg opacity-90 mb-10 max-w-3xl mx-auto">
                            Join thousands of users who are challenging themselves daily. Sign up now and start your quiz journey!
                        </p>
                    </FadeInOnScroll>
                    <FadeInOnScroll className="delay-200">
                        <button
                            onClick={() => navigate('/register')}
                            className="bg-white text-accent-primary-darker px-12 py-4 rounded-full text-xl font-bold shadow-glow-lg hover:bg-dark-text-light hover:text-accent-primary-darker transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-accent-primary-light"
                        >
                            Sign Up for Free
                        </button>
                    </FadeInOnScroll>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full py-8 bg-dark-bg-light text-dark-text-muted text-center text-sm border-t border-dark-bg-lighter">
                <div className="container mx-auto">
                    <p>&copy; 2025 Quizzer. All rights reserved.</p>
                    <p className="mt-2">Designed with passion and knowledge.</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
