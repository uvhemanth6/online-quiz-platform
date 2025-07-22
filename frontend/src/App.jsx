// frontend/src/App.jsx                   // Main application component, handles routing and context providers

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import React Router components
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Import AuthProvider and useAuth hook
import MessageBox from './components/MessageBox'; // Import MessageBox component
import LoadingSpinner from './components/LoadingSpinner'; // Import LoadingSpinner component
import Navbar from './components/Navbar'; // Import Navbar component

// Import all page components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateEditQuizPage from './pages/CreateEditQuizPage';
import TakeQuizPage from './pages/TakeQuizPage';
import QuizResultsPage from './pages/QuizResultsPage';
import NotFoundPage from './pages/NotFoundPage';

// Main App component that handles routing and overall layout
const App = () => {
    // Get authentication loading status and message from AuthContext
    const { loadingAuth, message, showMessage } = useAuth();

    // Show a loading spinner if authentication is still in progress
    if (loadingAuth) {
        return <LoadingSpinner />;
    }

    return (
        <div className="App min-h-screen flex flex-col bg-light text-dark">
            {/* REMOVE: <Particles id="tsparticles" init={particlesInit} options={particlesOptions} className="fixed inset-0 z-0" /> */}
            <Navbar />
            <main className="flex-grow py-8"> {/* Added vertical padding for content */}
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/create-quiz" element={<CreateEditQuizPage />} />
                    {/* Route for editing a quiz, expects a quizId parameter */}
                    <Route path="/edit-quiz/:quizId" element={<CreateEditQuizPage />} />
                    {/* Route for taking a quiz, expects a quizId parameter */}
                    <Route path="/take-quiz/:quizId" element={<TakeQuizPage />} />
                    {/* Route for viewing quiz results, expects a resultId parameter */}
                    <Route path="/quiz-results/:resultId" element={<QuizResultsPage />} />
                    {/* Catch-all route for 404 Not Found */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
            {/* Pass message object and showMessage to MessageBox */}
            {message && <MessageBox message={message} type={message.type} onClose={() => showMessage(null)} />}
        </div>
    );
};

// RootApp wraps the main App component with the AuthProvider and BrowserRouter
// This makes authentication context and routing context available throughout the application
const RootApp = () => (
    <AuthProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </AuthProvider>
);

export default RootApp;
