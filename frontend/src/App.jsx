import React, { useState } from 'react';
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
    // State to manage the current active page
    const [currentPage, setCurrentPage] = useState('home');
    // State to pass parameters to pages (e.g., quizId for TakeQuizPage)
    const [pageParams, setPageParams] = useState({});
    // Get authentication loading status and message from AuthContext
    const { loadingAuth, message } = useAuth();

    // Navigation function to change pages and pass parameters
    const navigate = (page, params = {}) => {
        setCurrentPage(page);
        setPageParams(params);
    };

    // Show a loading spinner if authentication is still in progress
    if (loadingAuth) {
        return <LoadingSpinner />;
    }

    // Determine which page component to render based on currentPage state
    let PageComponent;
    switch (currentPage) {
        case 'home':
            PageComponent = <HomePage navigate={navigate} />;
            break;
        case 'login':
            PageComponent = <LoginPage navigate={navigate} />;
            break;
        case 'register':
            PageComponent = <RegisterPage navigate={navigate} />;
            break;
        case 'dashboard':
            PageComponent = <DashboardPage navigate={navigate} />;
            break;
        case 'create-quiz':
            PageComponent = <CreateEditQuizPage navigate={navigate} />;
            break;
        case 'edit-quiz':
            // Pass quizIdToEdit parameter to the CreateEditQuizPage
            PageComponent = <CreateEditQuizPage navigate={navigate} quizIdToEdit={pageParams.quizId} />;
            break;
        case 'take-quiz':
            // Pass quizId parameter to the TakeQuizPage
            PageComponent = <TakeQuizPage navigate={navigate} quizId={pageParams.quizId} />;
            break;
        case 'quiz-results':
            // Pass resultId parameter to the QuizResultsPage
            PageComponent = <QuizResultsPage navigate={navigate} resultId={pageParams.resultId} />;
            break;
        default:
            // Render 404 page for unknown routes
            PageComponent = <NotFoundPage navigate={navigate} />;
    }

    return (
        <div className="App min-h-screen flex flex-col">
            {/* Navbar is always present */}
            <Navbar navigate={navigate} />
            {/* Main content area, where page components are rendered */}
            <main className="flex-grow">
                {PageComponent}
            </main>
            {/* Message box for global notifications */}
            <MessageBox message={message} />
        </div>
    );
};

// RootApp wraps the main App component with the AuthProvider
// This makes authentication context available throughout the application
const RootApp = () => (
    <AuthProvider>
        <App />
    </AuthProvider>
);

export default RootApp;