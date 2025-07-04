import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook
import LoadingSpinner from '../components/LoadingSpinner'; // Import LoadingSpinner
import api from '../api/axiosInstance'; // Import configured axios instance

const TakeQuizPage = ({ navigate, quizId }) => {
    const { currentUser, loadingAuth, showMessage } = useAuth();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({}); // Stores { questionIndex: 'selectedOptionText' }
    const [timeLeft, setTimeLeft] = useState(0); // Time left in seconds
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizFinished, setQuizFinished] = useState(false);
    const timerRef = useRef(null); // Ref to store the interval ID for the timer

    // Effect to fetch quiz data when component mounts or quizId changes
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await api.get(`/quizzes/${quizId}`); // Fetch quiz by ID from backend
                const fetchedQuiz = res.data;
                setQuiz(fetchedQuiz);
                setTimeLeft(fetchedQuiz.duration * 60); // Initialize timer with quiz duration in seconds
            } catch (error) {
                console.error("Error fetching quiz:", error.response?.data || error.message);
                showMessage("Failed to load quiz.", 'error');
                navigate('dashboard'); // Redirect to dashboard if quiz fetch fails
            }
        };

        if (!loadingAuth && quizId) { // Fetch only if auth is loaded and quizId is provided
            fetchQuiz();
        }
    }, [quizId, navigate, showMessage, loadingAuth]); // Dependencies for useEffect

    // Effect for the quiz timer logic
    useEffect(() => {
        if (quizStarted && timeLeft > 0 && !quizFinished) {
            // Start interval timer if quiz started, time left, and not finished
            timerRef.current = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1); // Decrement time every second
            }, 1000);
        } else if (timeLeft === 0 && quizStarted && !quizFinished) {
            // If time runs out, automatically submit the quiz
            handleSubmitQuiz();
        }

        // Cleanup function: clear interval when component unmounts or dependencies change
        return () => clearInterval(timerRef.current);
    }, [quizStarted, timeLeft, quizFinished]); // eslint-disable-line react-hooks/exhaustive-deps
    // Added eslint-disable-line because handleSubmitQuiz is not in dependencies, but it's called
    // If handleSubmitQuiz was added to dependencies, it would cause an infinite loop if not memoized.
    // In this case, it's acceptable as it triggers a state change (quizFinished) which naturally ends the timer.


    // Show loading spinner while authenticating or fetching quiz data
    if (loadingAuth || !quiz) {
        return <LoadingSpinner />;
    }

    // Redirect to login if not authenticated
    if (!currentUser) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
                <div className="text-center text-red-600 text-xl">Please log in to take quizzes.</div>
            </div>
        );
    }

    // Handle selection of an answer option
    const handleOptionSelect = (option) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: option // Store selected option for current question
        }));
    };

    // Navigate to the next question or submit quiz if it's the last question
    const handleNext = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1); // Move to next question
        } else {
            handleSubmitQuiz(); // Submit quiz if all questions answered
        }
    };

    // Navigate to the previous question
    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1); // Move to previous question
        }
    };

    // Start the quiz (resets state and starts timer)
    const startQuiz = () => {
        setQuizStarted(true);
    };

    // Calculate score and submit quiz results to the backend
    const handleSubmitQuiz = async () => {
        setQuizFinished(true); // Mark quiz as finished
        clearInterval(timerRef.current); // Stop the timer

        let score = 0;
        // Calculate score by comparing selected answers with correct answers
        quiz.questions.forEach((q, index) => {
            if (selectedAnswers[index] === q.correctAnswer) {
                score++;
            }
        });

        try {
            const resultData = {
                quizId: quiz._id,
                score: score,
                totalQuestions: quiz.questions.length,
                userAnswers: selectedAnswers // Store user's answers for review
            };
            const res = await api.post('/results', resultData); // Send results to backend
            showMessage('Quiz submitted successfully!', 'success');
            navigate('quiz-results', { resultId: res.data._id }); // Navigate to results page with the new result ID
        } catch (error) {
            console.error("Error submitting quiz results:", error.response?.data || error.message);
            showMessage(`Failed to submit quiz: ${error.response?.data?.message || error.message}`, 'error');
        }
    };

    // Format time from seconds into MM:SS format
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const currentQuestion = quiz.questions[currentQuestionIndex]; // Get the current question object

    return (
        <div className="container py-8 bg-gray-50 min-h-[calc(100vh-80px)]">
            <h1 className="text-4xl font-bold text-purple-700 mb-6 text-center">{quiz.title}</h1>
            <p className="text-lg text-gray-600 mb-4 text-center">{quiz.description}</p>

            {/* Initial quiz start screen */}
            {!quizStarted && !quizFinished && (
                <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto border border-gray-200">
                    <p className="text-xl text-gray-700 mb-4">Duration: {quiz.duration} minutes</p>
                    <p className="text-xl text-gray-700 mb-6">Total Questions: {quiz.questions.length}</p>
                    <button
                        onClick={startQuiz}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 font-semibold text-lg"
                    >
                        Start Quiz
                    </button>
                </div>
            )}

            {/* Quiz taking interface */}
            {quizStarted && !quizFinished && (
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl mx-auto border border-gray-200 space-y-6">
                    <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200">
                        <h2 className="text-2xl font-bold text-purple-700">Question {currentQuestionIndex + 1} of {quiz.questions.length}</h2>
                        {/* Display time left, color changes to red when less than 60 seconds */}
                        <div className={`text-xl font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-blue-600'}`}>
                            Time Left: {formatTime(timeLeft)}
                        </div>
                    </div>

                    <p className="text-lg text-gray-800 mb-6">{currentQuestion.questionText}</p>

                    <div className="space-y-4">
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleOptionSelect(option)}
                                className={`w-full text-left p-4 rounded-md border text-lg transition duration-300 ${selectedAnswers[currentQuestionIndex] === option
                                    ? 'bg-blue-200 border-blue-500 text-blue-800 shadow-md' // Style for selected option
                                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 hover:border-gray-400' // Default style
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-between mt-8">
                        <button
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0} // Disable 'Previous' on first question
                            className="bg-gray-400 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-500 disabled:opacity-50 font-semibold text-base"
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNext}
                            className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-700 font-semibold text-base"
                        >
                            {currentQuestionIndex === quiz.questions.length - 1 ? 'Submit Quiz' : 'Next'}
                        </button>
                    </div>
                </div>
            )}

            {/* Quiz completion message */}
            {quizFinished && (
                <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto border border-gray-200">
                    <h2 className="text-3xl font-bold text-green-600 mb-4">Quiz Completed!</h2>
                    <p className="text-xl text-gray-700 mb-6">Your results are being processed and saved.</p>
                    <button
                        onClick={() => navigate('dashboard')}
                        className="bg-purple-600 text-white px-8 py-3 rounded-lg shadow-md hover:bg-purple-700 font-semibold text-lg"
                    >
                        Go to Dashboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default TakeQuizPage;