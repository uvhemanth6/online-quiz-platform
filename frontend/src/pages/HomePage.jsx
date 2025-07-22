import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

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
    const featuresRef = useRef(null);

    const scrollToFeatures = () => {
        featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="classic-bg min-h-screen flex flex-col items-center text-gray-100 overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative w-full py-24 px-4 text-center flex flex-col items-center justify-center min-h-screen z-10">
                <FadeInOnScroll>
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                            QuizMaster
                        </span> - Test Your Knowledge
                    </h1>
                </FadeInOnScroll>
                <FadeInOnScroll className="delay-100">
                    <p className="text-lg sm:text-xl text-gray-300 mb-12 max-w-3xl">
                        A free platform for learners to take timed quizzes and for educators to create them.
                        Perfect for exam preparation and interactive learning.
                    </p>
                </FadeInOnScroll>
                <FadeInOnScroll className="delay-200">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        <Button
                            size="lg"
                            className="rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
                            onClick={() => navigate('/register')}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            Get Started
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="rounded-full text-lg font-semibold border-cyan-400/50 hover:border-cyan-400 hover:bg-cyan-400/10 text-cyan-400 flex items-center justify-center gap-2"
                            onClick={scrollToFeatures}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                            Explore More
                        </Button>
                    </div>
                </FadeInOnScroll>
            </section>

            {/* Features Section */}
            <section ref={featuresRef} className="w-full py-24 px-4 bg-gray-800/40 backdrop-blur-sm">
                <div className="container mx-auto">
                    <FadeInOnScroll className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Platform Features
                        </h2>
                        <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                            Everything you need for effective learning and teaching
                        </p>
                    </FadeInOnScroll>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: (
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                ),
                                title: "Timed Quizzes",
                                description: "Take quizzes with countdown timers to simulate exam conditions",
                                color: "text-green-400"
                            },
                            {
                                icon: (
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                ),
                                title: "Admin Dashboard",
                                description: "Create and manage quizzes with our intuitive admin interface",
                                color: "text-blue-400"
                            },
                            {
                                icon: (
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                ),
                                title: "Instant Results",
                                description: "Get your score immediately after quiz submission",
                                color: "text-purple-400"
                            },
                            {
                                icon: (
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                ),
                                title: "Multiple Categories",
                                description: "Quizzes available across various subjects and topics",
                                color: "text-yellow-400"
                            },
                            {
                                icon: (
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                ),
                                title: "Secure Access",
                                description: "JWT authentication protects all user data",
                                color: "text-red-400"
                            },
                            {
                                icon: (
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                ),
                                title: "Progress Tracking",
                                description: "View your quiz history and improvement over time",
                                color: "text-cyan-400"
                            }
                        ].map((feature, index) => (
                            <FadeInOnScroll key={index} className={`delay-${(index + 1) * 100}`}>
                                <Card className="hover:border-cyan-400/30 transition-all duration-500 hover:-translate-y-2 h-full bg-gray-800/70 border border-gray-700">
                                    <CardHeader className="mb-4">
                                        <div className={`${feature.color} mb-2`}>{feature.icon}</div>
                                        <CardTitle className="text-white">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-400">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            </FadeInOnScroll>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="w-full py-24 px-4 bg-gray-800/20">
                <div className="container mx-auto max-w-4xl">
                    <FadeInOnScroll className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            How It Works
                        </h2>
                    </FadeInOnScroll>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "1",
                                title: "Sign Up",
                                description: "Create your free account as a learner or educator",
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                )
                            },
                            {
                                step: "2",
                                title: "Take or Create",
                                description: "Browse quizzes or create your own (admin only)",
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                )
                            },
                            {
                                step: "3",
                                title: "Get Results",
                                description: "View your score and track your progress",
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                )
                            }
                        ].map((step, index) => (
                            <FadeInOnScroll key={index} className={`delay-${(index + 1) * 100}`}>
                                <Card className="bg-gray-800/50 border border-gray-700 text-center h-full">
                                    <CardHeader className="text-cyan-400 mb-4 mx-auto w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-2xl font-bold">
                                        {step.step}
                                    </CardHeader>
                                    <CardTitle className="text-xl font-bold text-white mb-3">{step.title}</CardTitle>
                                    <CardContent>
                                        <p className="text-gray-400">{step.description}</p>
                                    </CardContent>
                                </Card>
                            </FadeInOnScroll>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="w-full py-24 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-center">
                <div className="container mx-auto max-w-3xl">
                    <FadeInOnScroll>
                        <h2 className="text-3xl md:text-4xl font-bold mb-8">
                            Ready to Start Learning?
                        </h2>
                    </FadeInOnScroll>
                    <FadeInOnScroll className="delay-100">
                        <p className="text-xl text-blue-100 mb-10">
                            Join our community of learners and educators today - completely free!
                        </p>
                    </FadeInOnScroll>
                    <FadeInOnScroll className="delay-200">
                        <Button
                            onClick={() => navigate('/register')}
                            size="lg"
                            className="bg-white text-blue-700 hover:text-blue-800 px-10 py-4 rounded-full text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                        >
                            Get Started Now
                        </Button>
                    </FadeInOnScroll>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full py-12 bg-gray-900/80 text-gray-400 border-t border-gray-800">
                <div className="container mx-auto px-4 text-center">
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-white mb-4">QuizMaster</h3>
                        <p className="max-w-2xl mx-auto">
                            A free online quiz platform for learners and educators.
                        </p>
                    </div>
                    <div className="pt-8 border-t border-gray-800">
                        <p className="text-sm">
                            &copy; {new Date().getFullYear()} QuizMaster. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;