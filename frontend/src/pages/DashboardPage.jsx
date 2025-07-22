import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import UserResultsComponent from './UserResultsComponent';
import AdminQuizStatisticsComponent from './AdminQuizStatisticsComponent';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';

const DashboardPage = () => {
    const { currentUser, loadingAuth, showMessage } = useAuth();
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [allResults, setAllResults] = useState([]);
    const [loadingQuizzes, setLoadingQuizzes] = useState(true);
    const [loadingAllResults, setLoadingAllResults] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (loadingAuth) return;

            if (!currentUser) {
                setLoadingQuizzes(false);
                setLoadingAllResults(false);
                return;
            }

            setLoadingQuizzes(true);
            setLoadingAllResults(true);

            try {
                const quizzesRes = await api.get('/quizzes');
                setQuizzes(quizzesRes.data);
                setLoadingQuizzes(false);

                if (currentUser.role === 'admin') {
                    const resultsRes = await api.get('/results/all');
                    setAllResults(resultsRes.data);
                }
                setLoadingAllResults(false);

            } catch (error) {
                console.error("Error fetching dashboard data: ", error);
                showMessage("Failed to load dashboard data.", 'error');
                setLoadingQuizzes(false);
                setLoadingAllResults(false);
            }
        };

        fetchData();
    }, [currentUser, loadingAuth, showMessage]);

    if (loadingAuth || loadingQuizzes || loadingAllResults) {
        return <LoadingSpinner />;
    }

    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
                <div className="text-center text-2xl text-red-400">Please log in to view the dashboard.</div>
            </div>
        );
    }

    const isAdmin = currentUser.role === 'admin';

    const handleDeleteQuiz = async (quizId, quizTitle) => {
        if (window.confirm(`Are you sure you want to delete "${quizTitle}"?`)) {
            try {
                await api.delete(`/quizzes/${quizId}`);
                setQuizzes(prevQuizzes => prevQuizzes.filter(q => q._id !== quizId));
                if (isAdmin) {
                    const resultsRes = await api.get('/results/all');
                    setAllResults(resultsRes.data);
                }
                showMessage('Quiz deleted successfully!', 'success');
            } catch (error) {
                console.error("Error deleting quiz:", error);
                showMessage(`Failed to delete quiz: ${error.response?.data?.message || error.message}`, 'error');
            }
        }
    };

    return (
        <div className="classic-bg min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-lg">
                    {isAdmin ? 'Admin Dashboard' : 'Your Dashboard'}
                </h1>

                {isAdmin && (
                    <div className="mb-12 text-center">
                        <Button
                            onClick={() => navigate('/create-quiz')}
                            size="lg"
                            className="px-8 py-3 rounded-full font-bold text-lg shadow-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Create New Quiz
                        </Button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {quizzes.length === 0 ? (
                        <div className="col-span-full text-center text-gray-400 text-xl py-16">
                            No quizzes available. {isAdmin && "Start by creating one!"}
                        </div>
                    ) : (
                        quizzes.map(quiz => (
                            <Card key={quiz._id} className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700 hover:border-cyan-400/30 transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
                                <CardHeader className="mb-6">
                                    <CardTitle className="text-2xl font-bold text-white mb-3">{quiz.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-300 text-sm mb-4">{quiz.description}</p>
                                    <div className="flex justify-between text-xs mb-4">
                                        <span className="bg-gray-700/50 px-3 py-1 rounded-full text-cyan-400">Category: {quiz.category}</span>
                                        <span className="bg-gray-700/50 px-3 py-1 rounded-full text-blue-400">{quiz.duration} mins</span>
                                        <span className="bg-gray-700/50 px-3 py-1 rounded-full text-purple-400">{quiz.questions.length} Qs</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="mt-auto flex space-x-3">
                                    {!isAdmin ? (
                                        <Button
                                            onClick={() => navigate(`/take-quiz/${quiz._id}`)}
                                            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                                        >
                                            Take Quiz
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                onClick={() => navigate(`/edit-quiz/${quiz._id}`)}
                                                className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold transition-all duration-300 border border-purple-700 hover:bg-purple-700 hover:text-white"
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() => handleDeleteQuiz(quiz._id, quiz.title)}
                                                variant="destructive"
                                                className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300"
                                            >
                                                Delete
                                            </Button>
                                        </>
                                    )}
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>

                {!isAdmin && (
                    <div className="mt-16">
                        <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                            Your Quiz Results
                        </h2>
                        <UserResultsComponent userId={currentUser._id} />
                    </div>
                )}

                {isAdmin && (
                    <div className="mt-16 bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                        <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                            All User Results
                        </h2>
                        <div className="bg-gray-700/50 p-6 rounded-lg">
                            <AdminQuizStatisticsComponent quizzes={quizzes} allResults={allResults} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;