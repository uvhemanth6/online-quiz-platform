import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';

const QuizResultsPage = () => {
    const { currentUser, loadingAuth, showMessage } = useAuth();
    const navigate = useNavigate();
    const { resultId } = useParams();
    const [result, setResult] = useState(null);
    const [loadingResult, setLoadingResult] = useState(true);
    const [quiz, setQuiz] = useState(null);
    const [explanations, setExplanations] = useState({});
    const [explainingQuestionIndex, setExplainingQuestionIndex] = useState(null);

    useEffect(() => {
        const fetchResult = async () => {
            if (!resultId) {
                showMessage('No result ID provided.', 'error');
                navigate('/dashboard');
                setLoadingResult(false);
                return;
            }
            try {
                const res = await api.get(`/results/${resultId}`);
                const fetchedResult = res.data;
                setResult(fetchedResult);

                const quizRes = await api.get(`/quizzes/${fetchedResult.quizId}`);
                setQuiz(quizRes.data);

            } catch (error) {
                console.error("Error fetching result or quiz:", error);
                showMessage("Failed to load quiz results.", 'error');
                navigate('/dashboard');
            } finally {
                setLoadingResult(false);
            }
        };

        if (!loadingAuth && currentUser) {
            fetchResult();
        }
    }, [resultId, navigate, showMessage, loadingAuth, currentUser]);

    const explainAnswerWithLLM = async (questionIndex, questionText, options, correctAnswer) => {
        setExplainingQuestionIndex(questionIndex);
        setExplanations(prev => ({ ...prev, [questionIndex]: 'Generating explanation...' }));

        try {
            const prompt = `Provide a concise explanation for the following multiple-choice question and its correct answer.
            Question: "${questionText}"
            Options: ${options.join(', ')}
            Correct Answer: "${correctAnswer}"
            Keep the explanation to 3-4 sentences.`;

            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            if (!apiKey) {
                showMessage('Gemini API Key is not configured.', 'error');
                return;
            }
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] })
            });

            const result = await response.json();
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                setExplanations(prev => ({ ...prev, [questionIndex]: result.candidates[0].content.parts[0].text }));
            } else {
                setExplanations(prev => ({ ...prev, [questionIndex]: 'Failed to get explanation.' }));
            }
        } catch (error) {
            setExplanations(prev => ({ ...prev, [questionIndex]: `Error: ${error.message}` }));
        } finally {
            setExplainingQuestionIndex(null);
        }
    };

    if (loadingAuth || loadingResult || !quiz) {
        return <LoadingSpinner />;
    }

    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
                <div className="text-center text-2xl text-red-400">Please log in to view results.</div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
                <div className="text-center text-2xl text-red-400">Could not load quiz results.</div>
            </div>
        );
    }

    const percentage = ((result.score / result.totalQuestions) * 100).toFixed(2);

    return (
        <div className="classic-bg min-h-screen flex items-center justify-center p-4">
            <Card className="bg-gray-900/80 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl w-full max-w-4xl mx-auto border border-pink-700/40 hover:border-purple-400/50 transition-all duration-300">
                <CardHeader>
                    <CardTitle className="text-4xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 drop-shadow-lg">
                        Quiz Results: {result.quizTitle}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center space-y-4 mb-8 pb-4 border-b border-gray-700">
                        <p className="text-xl text-gray-300">Quiz: <span className="font-semibold text-pink-400">{result.quizTitle || 'N/A'}</span></p>
                        <p className="text-2xl font-bold text-green-400">Score: {result.score} / {result.totalQuestions}</p>
                        <p className="text-3xl font-extrabold text-purple-400">Percentage: {percentage}%</p>
                        {result.submittedAt && (
                            <p className="text-sm text-gray-400">Submitted On: {new Date(result.submittedAt).toLocaleString()}</p>
                        )}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Your Answers Review</h3>
                    <div className="space-y-6">
                        {quiz.questions.map((q, index) => (
                            <Card key={index} className="border border-gray-700 p-4 rounded-xl bg-gray-800/50">
                                <CardContent>
                                    <p className="text-lg font-semibold text-white mb-2">Q{index + 1}: {q.questionText}</p>
                                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                                        {q.options.map((option, optIndex) => (
                                            <li key={optIndex} className={`${option === q.correctAnswer ? 'text-green-400 font-bold' : ''} ${result.userAnswers[index] === option && option !== q.correctAnswer ? 'text-red-400 line-through' : ''}`}>{option}
                                                {result.userAnswers[index] === option && (
                                                    <span className="ml-2 text-sm italic text-gray-400"> (Your Answer)</span>
                                                )}
                                                {option === q.correctAnswer && (
                                                    <span className="ml-2 text-sm italic text-gray-400"> (Correct Answer)</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-4 text-right">
                                        <Button
                                            onClick={() => explainAnswerWithLLM(index, q.questionText, q.options, q.correctAnswer)}
                                            disabled={explainingQuestionIndex === index}
                                            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-md hover:from-pink-600 hover:to-purple-600 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
                                                '✨ Explain Answer'
                                            )}
                                        </Button>
                                    </div>
                                    {explanations[index] && (
                                        <div className="mt-4 p-3 bg-gray-700 rounded-xl border border-gray-600 text-gray-200 text-sm">
                                            <p className="font-semibold mb-1 text-pink-400">Explanation:</p>
                                            <p>{explanations[index]}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={() => navigate('/dashboard')}
                        size="lg"
                        className="mt-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-lg shadow-lg hover:from-pink-600 hover:to-purple-600 font-semibold text-lg w-full transition-all duration-300 hover:-translate-y-1"
                    >
                        Back to Dashboard
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default QuizResultsPage;