import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';

const TakeQuizPage = () => {
    const { currentUser, loadingAuth, showMessage } = useAuth();
    const navigate = useNavigate();
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizFinished, setQuizFinished] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            if (!quizId) {
                showMessage('No quiz ID provided.', 'error');
                navigate('/dashboard');
                return;
            }
            try {
                const res = await api.get(`/quizzes/${quizId}`);
                const fetchedQuiz = res.data;
                setQuiz(fetchedQuiz);
                setTimeLeft(fetchedQuiz.duration * 60);
            } catch (error) {
                console.error("Error fetching quiz:", error);
                showMessage("Failed to load quiz.", 'error');
                navigate('/dashboard');
            }
        };

        if (!loadingAuth && quizId) {
            fetchQuiz();
        }
    }, [quizId, navigate, showMessage, loadingAuth]);

    useEffect(() => {
        if (quizStarted && timeLeft > 0 && !quizFinished) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0 && quizStarted && !quizFinished) {
            handleSubmitQuiz();
        }

        return () => clearInterval(timerRef.current);
    }, [quizStarted, timeLeft, quizFinished]);

    if (loadingAuth || !quiz) {
        return <LoadingSpinner />;
    }

    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
                <div className="text-center text-2xl text-red-400">Please log in to take quizzes.</div>
            </div>
        );
    }

    const handleOptionSelect = (option) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: option
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            handleSubmitQuiz();
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const startQuiz = () => {
        setQuizStarted(true);
    };

    const handleSubmitQuiz = async () => {
        setQuizFinished(true);
        clearInterval(timerRef.current);

        let score = 0;
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
                userAnswers: selectedAnswers
            };
            const res = await api.post('/results', resultData);
            showMessage('Quiz submitted successfully!', 'success');
            navigate(`/quiz-results/${res.data._id}`);
        } catch (error) {
            console.error("Error submitting quiz results:", error);
            showMessage(`Failed to submit quiz: ${error.response?.data?.message || error.message}`, 'error');
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const currentQuestion = quiz.questions[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    {quiz.title}
                </h1>
                <p className="text-lg text-gray-300 mb-8 text-center">{quiz.description}</p>

                {!quizStarted && !quizFinished && (
                    <div className="text-center p-8 bg-gray-800/70 rounded-xl shadow-lg max-w-md mx-auto border border-gray-700">
                        <p className="text-xl text-gray-300 mb-4">Duration: {quiz.duration} minutes</p>
                        <p className="text-xl text-gray-300 mb-6">Total Questions: {quiz.questions.length}</p>
                        <button
                            onClick={startQuiz}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-cyan-600 font-semibold text-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            Start Quiz
                        </button>
                    </div>
                )}

                {quizStarted && !quizFinished && (
                    <div className="bg-gray-800/70 backdrop-blur-sm p-8 rounded-xl shadow-xl w-full max-w-3xl mx-auto border border-gray-700 space-y-6">
                        <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-700">
                            <h2 className="text-2xl font-bold text-white">
                                Question {currentQuestionIndex + 1} of {quiz.questions.length}
                            </h2>
                            <div className={`text-xl font-bold ${timeLeft < 60 ? 'text-red-400' : 'text-cyan-400'}`}>
                                Time Left: {formatTime(timeLeft)}
                            </div>
                        </div>

                        <p className="text-lg text-gray-300 mb-6">{currentQuestion.questionText}</p>

                        <div className="space-y-4">
                            {currentQuestion.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleOptionSelect(option)}
                                    className={`w-full text-left p-4 rounded-md border text-lg transition-all duration-300 ${
                                        selectedAnswers[currentQuestionIndex] === option
                                            ? 'bg-blue-600/30 border-blue-400 text-white shadow-md'
                                            : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                                    }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-between mt-8">
                            <button
                                onClick={handlePrevious}
                                disabled={currentQuestionIndex === 0}
                                className="bg-gray-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-500 disabled:opacity-50 font-semibold text-base transition-all duration-300"
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleNext}
                                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg shadow-md hover:from-blue-600 hover:to-cyan-600 font-semibold text-base transition-all duration-300 hover:-translate-y-1"
                            >
                                {currentQuestionIndex === quiz.questions.length - 1 ? 'Submit Quiz' : 'Next'}
                            </button>
                        </div>
                    </div>
                )}

                {quizFinished && (
                    <div className="text-center p-8 bg-gray-800/70 rounded-xl shadow-lg max-w-md mx-auto border border-gray-700">
                        <h2 className="text-3xl font-bold text-green-400 mb-4">Quiz Completed!</h2>
                        <p className="text-xl text-gray-300 mb-6">Your results are being processed and saved.</p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-cyan-600 font-semibold text-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TakeQuizPage;