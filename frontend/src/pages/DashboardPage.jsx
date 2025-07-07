// frontend/src/pages/DashboardPage.jsx // User/Admin dashboard displaying quizzes

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook
import LoadingSpinner from '../components/LoadingSpinner'; // Import LoadingSpinner
import UserResultsComponent from './UserResultsComponent'; // Component for user results
import AdminQuizStatisticsComponent from './AdminQuizStatisticsComponent'; // Component for admin stats
import api from '../api/axiosInstance'; // Import configured axios instance
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const DashboardPage = () => {
    const { currentUser, loadingAuth, showMessage } = useAuth();
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [allResults, setAllResults] = useState([]); // State to hold all quiz results for admin stats
    const [loadingQuizzes, setLoadingQuizzes] = useState(true);
    const [loadingAllResults, setLoadingAllResults] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            console.log("Dashboard fetchData: loadingAuth =", loadingAuth, "currentUser =", currentUser);

            // Wait until authentication state is no longer loading
            if (loadingAuth) {
                console.log("Dashboard: Auth still loading, returning.");
                return;
            }

            // If no user is logged in after auth loads, set loading states to false and return.
            // This ensures the "Please log in" message appears quickly.
            if (!currentUser) {
                console.log("Dashboard: No current user, setting loading to false.");
                setLoadingQuizzes(false);
                setLoadingAllResults(false);
                return;
            }

            // Set loading states to true before fetching data
            setLoadingQuizzes(true);
            setLoadingAllResults(true);
            console.log("Dashboard: Fetching data for user:", currentUser._id); // Use currentUser._id for Node.js backend

            try {
                // Fetch quizzes
                const quizzesRes = await api.get('/quizzes');
                setQuizzes(quizzesRes.data);
                setLoadingQuizzes(false);
                console.log("Dashboard: Quizzes fetched successfully.");

                // Fetch all results if the current user is an admin
                if (currentUser.role === 'admin') {
                    const resultsRes = await api.get('/results/all');
                    setAllResults(resultsRes.data);
                    console.log("Dashboard: All results fetched successfully (Admin).");
                }
                setLoadingAllResults(false);

            } catch (error) {
                console.error("Error fetching dashboard data: ", error.response?.data || error.message);
                showMessage("Failed to load dashboard data.", 'error');
                setLoadingQuizzes(false);
                setLoadingAllResults(false);
            }
        };

        fetchData(); // Call fetchData on component mount and when dependencies change
    }, [currentUser, loadingAuth, showMessage]); // Re-fetch when currentUser or auth loading changes

    // Show loading spinner while authenticating or fetching dashboard data
    if (loadingAuth || loadingQuizzes || loadingAllResults) {
        console.log("Dashboard: Displaying LoadingSpinner.");
        return <LoadingSpinner />;
    }

    // Redirect to login if not authenticated (after loadingAuth is false)
    if (!currentUser) {
        console.log("Dashboard: No current user, displaying login prompt.");
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
                <div className="text-center text-danger text-xl">Please log in to view the dashboard.</div>
            </div>
        );
    }

    const isAdmin = currentUser.role === 'admin'; // Check if current user is admin

    // Handle quiz deletion (Admin only)
    const handleDeleteQuiz = async (quizId, quizTitle) => {
        // IMPORTANT: Replace window.confirm with a custom modal for better UI/UX
        if (window.confirm(`Are you sure you want to delete "${quizTitle}"?`)) {
            try {
                await api.delete(`/quizzes/${quizId}`); // Delete quiz via API
                setQuizzes(prevQuizzes => prevQuizzes.filter(q => q._id !== quizId)); // Optimistically update UI
                // Also re-fetch all results to update statistics if admin
                if (isAdmin) {
                    const resultsRes = await api.get('/results/all');
                    setAllResults(resultsRes.data);
                }
                showMessage('Quiz deleted successfully!', 'success');
            } catch (error) {
                console.error("Error deleting quiz:", error.response?.data || error.message);
                showMessage(`Failed to delete quiz: ${error.response?.data?.message || error.message}`, 'error');
            }
        }
    };

    return (
        <div className="container py-8 bg-light min-h-[calc(100vh-80px)]">
            <h1 className="text-4xl font-bold text-primary-700 mb-8 text-center">
                {isAdmin ? 'Admin Dashboard' : 'User Dashboard'}
            </h1>

            {/* Button to create new quiz (Admin only) */}
            {isAdmin && (
                <div className="mb-8 text-center">
                    <button
                        onClick={() => navigate('/create-quiz')}
                        className="bg-secondary-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-secondary-700 font-semibold text-lg flex items-center justify-center mx-auto"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        Create New Quiz
                    </button>
                </div>
            )}

            {/* Display list of quizzes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.length === 0 ? (
                    <div className="col-span-full text-center text-dark text-lg py-10">No quizzes available. {isAdmin && "Start by creating one!"}</div>
                ) : (
                    quizzes.map(quiz => (
                        <div key={quiz._id} className="bg-white p-6 rounded-xl shadow-lg border border-primary-100 flex flex-col justify-between transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                            <div>
                                <h3 className="text-2xl font-bold text-primary-800 mb-2">{quiz.title}</h3>
                                <p className="text-dark text-sm mb-4">{quiz.description}</p>
                                <p className="text-gray-500 text-xs mb-2">Category: <span className="font-medium text-primary-600">{quiz.category}</span></p>
                                <p className="text-gray-500 text-xs mb-4">Duration: <span className="font-medium text-primary-600">{quiz.duration} minutes</span></p>
                                <p className="text-gray-500 text-xs">Questions: <span className="font-medium text-primary-600">{quiz.questions.length}</span></p>
                            </div>
                            <div className="mt-6 flex space-x-3">
                                {!isAdmin ? (
                                    // Button for users to take the quiz
                                    <button
                                        onClick={() => navigate(`/take-quiz/${quiz._id}`)}
                                        className="flex-1 bg-info text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 font-semibold text-base"
                                    >
                                        Take Quiz
                                    </button>
                                ) : (
                                    // Buttons for admins to edit or delete quizzes
                                    <>
                                        <button
                                            onClick={() => navigate(`/edit-quiz/${quiz._id}`)}
                                            className="flex-1 bg-warning text-white px-5 py-2 rounded-lg shadow-md hover:bg-warning-600 font-semibold text-base"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteQuiz(quiz._id, quiz.title)}
                                            className="flex-1 bg-danger text-white px-5 py-2 rounded-lg shadow-md hover:bg-danger-700 font-semibold text-base"
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* User-specific Results component */}
            {!isAdmin && (
                <div className="mt-12">
                    <h2 className="text-3xl font-bold text-primary-700 mb-6 text-center">Your Quiz Results</h2>
                    <UserResultsComponent userId={currentUser._id} /> {/* Pass Node.js user ID */}
                </div>
            )}

            {/* Admin-specific Quiz Statistics component */}
            {isAdmin && (
                <div className="mt-12">
                    <h2 className="text-3xl font-bold text-primary-700 mb-6 text-center">All User Results</h2>
                    {/* Pass both quizzes and allResults to the AdminQuizStatisticsComponent */}
                    <AdminQuizStatisticsComponent quizzes={quizzes} allResults={allResults} />
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
