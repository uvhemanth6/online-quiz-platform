import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Label } from '../components/ui/Label';

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
        <div className="classic-bg min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-lg">
                    {quiz.title}
                </h1>
                <p className="text-lg text-gray-300 mb-8 text-center">{quiz.description}</p>

                {!quizStarted && !quizFinished && (
                    <Card className="text-center p-8 bg-gray-800/70 rounded-xl shadow-lg max-w-md mx-auto border border-gray-700">
                        <CardContent>
                            <p className="text-xl text-gray-300 mb-4">Duration: {quiz.duration} minutes</p>
                            <p className="text-xl text-gray-300 mb-6">Total Questions: {quiz.questions.length}</p>
                            <Button
                                onClick={startQuiz}
                                size="lg"
                                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-cyan-600 font-semibold text-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                Start Quiz
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {quizStarted && !quizFinished && (
                    <Card className="bg-gray-800/70 backdrop-blur-sm p-8 rounded-xl shadow-xl w-full max-w-3xl mx-auto border border-gray-700 space-y-6">
                        <CardHeader className="flex justify-between items-center mb-6 border-b pb-4 border-gray-700">
                            <CardTitle className="text-2xl font-bold text-white">
                                Question {currentQuestionIndex + 1} of {quiz.questions.length}
                            </CardTitle>
                            <div className={`text-xl font-bold ${timeLeft < 60 ? 'text-red-400' : 'text-cyan-400'}`}>
                                Time Left: {formatTime(timeLeft)}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Label className="text-lg text-gray-300 mb-6 block">{currentQuestion.questionText}</Label>
                            <div className="space-y-4">
                                {currentQuestion.options.map((option, index) => (
                                    <Button
                                        key={index}
                                        type="button"
                                        onClick={() => handleOptionSelect(option)}
                                        variant={selectedAnswers[currentQuestionIndex] === option ? 'default' : 'outline'}
                                        className={`w-full text-left p-4 rounded-md border text-lg transition-all duration-300 ${selectedAnswers[currentQuestionIndex] === option ? 'bg-blue-600/30 border-blue-400 text-white shadow-md' : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'}`}
                                    >
                                        {option}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between mt-8">
                            <Button
                                onClick={handlePrevious}
                                disabled={currentQuestionIndex === 0}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md font-semibold text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-700 hover:bg-blue-700 hover:text-white"
                                style={{ opacity: 1, pointerEvents: currentQuestionIndex === 0 ? 'none' : 'auto' }}
                            >
                                Previous
                            </Button>
                            <Button
                                onClick={handleNext}
                                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg shadow-md hover:from-blue-600 hover:to-cyan-600 font-semibold text-base transition-all duration-300 hover:-translate-y-1"
                            >
                                {currentQuestionIndex === quiz.questions.length - 1 ? 'Submit Quiz' : 'Next'}
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {quizFinished && (
                    <Card className="text-center p-8 bg-gray-800/70 rounded-xl shadow-lg max-w-md mx-auto border border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold text-green-400 mb-4">Quiz Completed!</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl text-gray-300 mb-6">Your results are being processed and saved.</p>
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={() => navigate('/dashboard')}
                                size="lg"
                                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-cyan-600 font-semibold text-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                Go to Dashboard
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default TakeQuizPage;