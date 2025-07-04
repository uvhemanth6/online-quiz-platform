import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook
import LoadingSpinner from '../components/LoadingSpinner'; // Import LoadingSpinner
import UserResultsComponent from './UserResultsComponent'; // Component for user results
import AdminQuizStatisticsComponent from './AdminQuizStatisticsComponent'; // Component for admin stats
import api from '../api/axiosInstance'; // Import configured axios instance

const DashboardPage = ({ navigate }) => {
    const { currentUser, loadingAuth, showMessage } = useAuth();
    const [quizzes, setQuizzes] = useState([]);
    const [loadingQuizzes, setLoadingQuizzes] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await api.get('/quizzes'); // Fetch all quizzes from backend
                setQuizzes(res.data);
            } catch (error) {
                console.error("Error fetching quizzes: ", error.response?.data || error.message);
                showMessage("Failed to load quizzes.", 'error');
            } finally {
                setLoadingQuizzes(false);
            }
        };

        if (!loadingAuth && currentUser) { // Fetch quizzes only after auth state is known
            fetchQuizzes();
        } else if (!loadingAuth && !currentUser) {
            setLoadingQuizzes(false); // If not logged in, no quizzes to fetch (or will be redirected)
        }
    }, [currentUser, loadingAuth, showMessage]); // Re-fetch when currentUser or auth loading changes

    // Show loading spinner while authenticating or fetching quizzes
    if (loadingAuth || loadingQuizzes) {
        return <LoadingSpinner />;
    }

    // Redirect to login if not authenticated
    if (!currentUser) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
                <div className="text-center text-red-600 text-xl">Please log in to view the dashboard.</div>
            </div>
        );
    }

    const isAdmin = currentUser.role === 'admin'; // Check if current user is admin

    // Handle quiz deletion (Admin only)
    const handleDeleteQuiz = async (quizId, quizTitle) => {
        if (window.confirm(`Are you sure you want to delete "${quizTitle}"?`)) { // Confirmation dialog
            try {
                await api.delete(`/quizzes/${quizId}`); // Delete quiz via API
                setQuizzes(quizzes.filter(q => q._id !== quizId)); // Optimistically update UI
                showMessage('Quiz deleted successfully!', 'success');
            } catch (error) {
                console.error("Error deleting quiz:", error.response?.data || error.message);
                showMessage(`Failed to delete quiz: ${error.response?.data?.message || error.message}`, 'error');
            }
        }
    };

    return (
        <div className="container py-8 bg-gray-50 min-h-[calc(100vh-80px)]">
            <h1 className="text-4xl font-bold text-purple-700 mb-8 text-center">
                {isAdmin ? 'Admin Dashboard' : 'User Dashboard'}
            </h1>

            {/* Button to create new quiz (Admin only) */}
            {isAdmin && (
                <div className="mb-8 text-center">
                    <button
                        onClick={() => navigate('create-quiz')}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 font-semibold text-lg flex items-center justify-center mx-auto"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        Create New Quiz
                    </button>
                </div>
            )}

            {/* Display list of quizzes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.length === 0 ? (
                    <div className="col-span-full text-center text-gray-600 text-lg py-10">No quizzes available. {isAdmin && "Start by creating one!"}</div>
                ) : (
                    quizzes.map(quiz => (
                        <div key={quiz._id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col justify-between transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                            <div>
                                <h3 className="text-2xl font-bold text-purple-800 mb-2">{quiz.title}</h3>
                                <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>
                                <p className="text-gray-500 text-xs mb-2">Category: <span className="font-medium text-purple-600">{quiz.category}</span></p>
                                <p className="text-gray-500 text-xs mb-4">Duration: <span className="font-medium text-purple-600">{quiz.duration} minutes</span></p>
                                <p className="text-gray-500 text-xs">Questions: <span className="font-medium text-purple-600">{quiz.questions.length}</span></p>
                            </div>
                            <div className="mt-6 flex space-x-3">
                                {!isAdmin ? (
                                    // Button for users to take the quiz
                                    <button
                                        onClick={() => navigate('take-quiz', { quizId: quiz._id })}
                                        className="flex-1 bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 font-semibold text-base"
                                    >
                                        Take Quiz
                                    </button>
                                ) : (
                                    // Buttons for admins to edit or delete quizzes
                                    <>
                                        <button
                                            onClick={() => navigate('edit-quiz', { quizId: quiz._id })}
                                            className="flex-1 bg-yellow-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-yellow-600 font-semibold text-base"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteQuiz(quiz._id, quiz.title)}
                                            className="flex-1 bg-red-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-red-700 font-semibold text-base"
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
                    <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">Your Quiz Results</h2>
                    <UserResultsComponent userId={currentUser._id} navigate={navigate} />
                </div>
            )}

            {/* Admin-specific Quiz Statistics component */}
            {isAdmin && (
                <div className="mt-12">
                    <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">All User Results</h2>
                    <AdminQuizStatisticsComponent quizzes={quizzes} />
                </div>
            )}
        </div>
    );
};

export default DashboardPage;