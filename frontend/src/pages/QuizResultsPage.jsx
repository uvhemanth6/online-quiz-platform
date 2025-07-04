import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook
import LoadingSpinner from '../components/LoadingSpinner'; // Import LoadingSpinner
import api from '../api/axiosInstance'; // Import configured axios instance

const QuizResultsPage = ({ navigate, resultId }) => {
    const { currentUser, loadingAuth, showMessage } = useAuth();
    const [result, setResult] = useState(null);
    const [loadingResult, setLoadingResult] = useState(true);
    const [quiz, setQuiz] = useState(null); // To store quiz details for answer review

    // Effect to fetch quiz result and associated quiz details
    useEffect(() => {
        const fetchResult = async () => {
            if (!resultId) {
                showMessage('No result ID provided.', 'error');
                navigate('dashboard'); // Redirect if no result ID
                setLoadingResult(false);
                return;
            }
            try {
                // Fetch the specific result from the backend
                const res = await api.get(`/results/${resultId}`);
                const fetchedResult = res.data;
                setResult(fetchedResult);

                // Fetch the original quiz details to display questions and correct answers for review
                const quizRes = await api.get(`/quizzes/${fetchedResult.quizId}`);
                setQuiz(quizRes.data);

            } catch (error) {
                console.error("Error fetching result or quiz:", error.response?.data || error.message);
                showMessage("Failed to load quiz results.", 'error');
                navigate('dashboard'); // Redirect on error
            } finally {
                setLoadingResult(false); // Stop loading regardless of success/failure
            }
        };

        if (!loadingAuth && currentUser) { // Fetch only if authenticated
            fetchResult();
        }
    }, [resultId, navigate, showMessage, loadingAuth, currentUser]); // Dependencies for useEffect

    // Show loading spinner while fetching data
    if (loadingAuth || loadingResult || !quiz) { // Wait for quiz data too for review
        return <LoadingSpinner />;
    }

    // Redirect to login if not authenticated
    if (!currentUser) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
                <div className="text-center text-red-600 text-xl">Please log in to view results.</div>
            </div>
        );
    }

    // Display message if result data is missing after loading
    if (!result) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
                <div className="text-center text-red-600 text-xl">Could not load quiz results.</div>
            </div>
        );
    }

    // Calculate score percentage
    const percentage = ((result.score / result.totalQuestions) * 100).toFixed(2);

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl mx-auto border border-gray-200">
                <h2 className="text-4xl font-bold text-purple-700 mb-6 text-center">Quiz Results: {result.quizTitle}</h2>
                <div className="text-center space-y-4 mb-8 pb-4 border-b border-gray-200">
                    <p className="text-xl text-gray-800">Quiz: <span className="font-semibold text-indigo-600">{result.quizTitle || 'N/A'}</span></p>
                    <p className="text-2xl font-bold text-green-600">Score: {result.score} / {result.totalQuestions}</p>
                    <p className="text-3xl font-extrabold text-blue-600">Percentage: {percentage}%</p>
                    {result.submittedAt && (
                        <p className="text-sm text-gray-500">Submitted On: {new Date(result.submittedAt).toLocaleString()}</p>
                    )}
                </div>

                <h3 className="text-2xl font-bold text-purple-700 mb-4">Your Answers Review</h3>
                <div className="space-y-6">
                    {/* Map through original quiz questions to display questions and user's answers */}
                    {quiz.questions.map((q, index) => (
                        <div key={index} className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                            <p className="text-lg font-semibold text-gray-800 mb-2">Q{index + 1}: {q.questionText}</p>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {q.options.map((option, optIndex) => (
                                    <li key={optIndex} className={`${
                                        // Highlight correct answer in green
                                        option === q.correctAnswer ? 'text-green-600 font-bold' : ''
                                    } ${
                                        // If user's answer and it's wrong, highlight in red and strike-through
                                        result.userAnswers[index] === option && option !== q.correctAnswer ? 'text-red-600 line-through' : ''
                                    }`}>
                                        {option}
                                        {result.userAnswers[index] === option && (
                                            <span className="ml-2 text-sm italic"> (Your Answer)</span>
                                        )}
                                        {option === q.correctAnswer && (
                                            <span className="ml-2 text-sm italic"> (Correct Answer)</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => navigate('dashboard')}
                    className="mt-8 bg-purple-600 text-white px-8 py-3 rounded-lg shadow-md hover:bg-purple-700 font-semibold text-lg w-full"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default QuizResultsPage;