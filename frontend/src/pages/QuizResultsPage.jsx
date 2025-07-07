// frontend/src/pages/QuizResultsPage.jsx // Displays results for a specific quiz submission

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook
import LoadingSpinner from '../components/LoadingSpinner'; // Import LoadingSpinner
import api from '../api/axiosInstance'; // Import configured axios instance
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate and useParams

const QuizResultsPage = () => { // Removed resultId from props
    const { currentUser, loadingAuth, showMessage } = useAuth();
    const navigate = useNavigate(); // Initialize useNavigate hook
    const { resultId } = useParams(); // Get resultId from URL parameters
    const [result, setResult] = useState(null);
    const [loadingResult, setLoadingResult] = useState(true);
    const [quiz, setQuiz] = useState(null); // To store quiz details for answer review
    // New state to manage explanations for each question
    const [explanations, setExplanations] = useState({}); // {questionIndex: "explanation text"}
    const [explainingQuestionIndex, setExplainingQuestionIndex] = useState(null); // Tracks which question is being explained

    // Effect to fetch quiz result and associated quiz details
    useEffect(() => {
        const fetchResult = async () => {
            if (!resultId) {
                showMessage('No result ID provided.', 'error');
                navigate('/dashboard'); // Redirect if no result ID
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
                navigate('/dashboard'); // Redirect on error
            } finally {
                setLoadingResult(false); // Stop loading regardless of success/failure
            }
        };

        if (!loadingAuth && currentUser) { // Fetch only if authenticated
            fetchResult();
        }
    }, [resultId, navigate, showMessage, loadingAuth, currentUser]); // Dependencies for useEffect

    // --- Gemini API Integration: Explain Answer ---
    const explainAnswerWithLLM = async (questionIndex, questionText, options, correctAnswer) => {
        setExplainingQuestionIndex(questionIndex); // Set loading for this specific question
        setExplanations(prev => ({ ...prev, [questionIndex]: 'Generating explanation...' })); // Show loading text

        try {
            const prompt = `Provide a concise explanation for the following multiple-choice question and its correct answer.
            Question: "${questionText}"
            Options: ${options.join(', ')}
            Correct Answer: "${correctAnswer}"
            Keep the explanation to 3-4 sentences.`;

            console.log("Gemini API Request Prompt:", prompt); // Log the prompt
            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });

            const payload = { contents: chatHistory };
            console.log("Gemini API Request Payload:", JSON.stringify(payload, null, 2)); // Log the payload

            // IMPORTANT: Replace "YOUR_GEMINI_API_KEY_HERE" with your actual Gemini API key
            // You can get one from Google AI Studio: https://aistudio.google.com/app/apikey
             const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // Access API key from environment variable
            if (!apiKey) {
                showMessage('Gemini API Key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.', 'error');
                return;
            }
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            console.log("Gemini API Raw Response:", response); // Log raw response object
            const result = await response.json();
            console.log("Gemini API Parsed Result:", result); // Log parsed JSON result

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const explanationText = result.candidates[0].content.parts[0].text;
                console.log("Gemini API Generated Explanation Text:", explanationText);
                setExplanations(prev => ({ ...prev, [questionIndex]: explanationText }));
            } else {
                setExplanations(prev => ({ ...prev, [questionIndex]: 'Failed to get explanation. Check console for details.' }));
                console.error("Gemini API response structure unexpected:", result);
            }
        } catch (error) {
            setExplanations(prev => ({ ...prev, [questionIndex]: `Error: ${error.message}` }));
            console.error("Error calling Gemini API for explanation:", error);
        } finally {
            setExplainingQuestionIndex(null); // Clear loading state
        }
    };
    // --- End Gemini API Integration ---


    // Show loading spinner while fetching data
    if (loadingAuth || loadingResult || !quiz) { // Wait for quiz data too for review
        return <LoadingSpinner />;
    }

    // Redirect to login if not authenticated
    if (!currentUser) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
                <div className="text-center text-danger text-xl">Please log in to view results.</div>
            </div>
        );
    }

    // Display message if result data is missing after loading
    if (!result) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
                <div className="text-center text-danger text-xl">Could not load quiz results.</div>
            </div>
        );
    }

    // Calculate score percentage
    const percentage = ((result.score / result.totalQuestions) * 100).toFixed(2);

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-light p-4">
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-4xl mx-auto border border-primary-200">
                <h2 className="text-4xl font-bold text-primary-700 mb-6 text-center">Quiz Results: {result.quizTitle}</h2>
                <div className="text-center space-y-4 mb-8 pb-4 border-b border-primary-200">
                    <p className="text-xl text-dark">Quiz: <span className="font-semibold text-primary-600">{result.quizTitle || 'N/A'}</span></p>
                    <p className="text-2xl font-bold text-secondary-600">Score: {result.score} / {result.totalQuestions}</p>
                    <p className="text-3xl font-extrabold text-primary-600">Percentage: {percentage}%</p>
                    {result.submittedAt && (
                        <p className="text-sm text-gray-500">Submitted On: {new Date(result.submittedAt).toLocaleString()}</p>
                    )}
                </div>

                <h3 className="text-2xl font-bold text-primary-700 mb-4">Your Answers Review</h3>
                <div className="space-y-6">
                    {/* Map through original quiz questions to display questions and user's answers */}
                    {quiz.questions.map((q, index) => (
                        <div key={index} className="border border-primary-200 p-4 rounded-xl bg-primary-50">
                            <p className="text-lg font-semibold text-dark mb-2">Q{index + 1}: {q.questionText}</p>
                            <ul className="list-disc list-inside space-y-1 text-dark">
                                {q.options.map((option, optIndex) => (
                                    <li key={optIndex} className={`${
                                        // Highlight correct answer in secondary (green)
                                        option === q.correctAnswer ? 'text-secondary-600 font-bold' : ''
                                    } ${
                                        // If user's answer and it's wrong, highlight in danger (red) and strike-through
                                        result.userAnswers[index] === option && option !== q.correctAnswer ? 'text-danger line-through' : ''
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
                            {/* Gemini API button for explanation */}
                            <div className="mt-4 text-right">
                                <button
                                    onClick={() => explainAnswerWithLLM(index, q.questionText, q.options, q.correctAnswer)}
                                    disabled={explainingQuestionIndex === index}
                                    className="bg-info text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {explainingQuestionIndex === index ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Explaining...
                                        </>
                                    ) : (
                                        <>
                                            ✨ Explain Answer
                                        </>
                                    )}
                                </button>
                            </div>
                            {/* Display explanation if available */}
                            {explanations[index] && (
                                <div className="mt-4 p-3 bg-info-50 rounded-xl border border-info-200 text-info-800 text-sm">
                                    <p className="font-semibold mb-1">Explanation:</p>
                                    <p>{explanations[index]}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => navigate('/dashboard')} // Use React Router navigate
                    className="mt-8 bg-primary-600 text-white px-8 py-3 rounded-lg shadow-md hover:bg-primary-700 font-semibold text-lg w-full"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default QuizResultsPage;
