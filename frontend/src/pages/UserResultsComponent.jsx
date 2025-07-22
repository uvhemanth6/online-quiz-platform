import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const UserResultsComponent = ({ userId }) => {
    const [userResults, setUserResults] = useState([]);
    const [loadingResults, setLoadingResults] = useState(true);
    const { showMessage } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserResults = async () => {
            try {
                const res = await api.get('/results/my-results');
                setUserResults(res.data);
            } catch (error) {
                console.error("Error fetching user results: ", error);
                showMessage("Failed to load your results.", 'error');
            } finally {
                setLoadingResults(false);
            }
        };
        fetchUserResults();
    }, [userId, showMessage]);

    if (loadingResults) {
        return <LoadingSpinner />;
    }

    if (userResults.length === 0) {
        return (
            <div className="text-center text-gray-400 text-md py-4">
                No results yet. Take a quiz to see your scores!
            </div>
        );
    }

    return (
        <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userResults.map(result => {
                    const percentage = ((result.score / result.totalQuestions) * 100).toFixed(0);
                    return (
                        <div 
                            key={result._id} 
                            className="border border-gray-700 p-4 rounded-xl bg-gray-800/30 hover:bg-gray-700/50 transition-colors duration-200 flex flex-col justify-between"
                        >
                            <div>
                                <h4 className="text-lg font-bold text-white mb-1">
                                    {result.quizTitle || 'Unknown Quiz'}
                                </h4>
                                <div className="flex items-center space-x-2 mb-2">
                                    <span className="text-gray-300">Score:</span>
                                    <span className={`text-lg font-semibold ${
                                        percentage >= 70 ? 'text-green-400' :
                                        percentage >= 40 ? 'text-yellow-400' :
                                        'text-red-400'
                                    }`}>
                                        {result.score}/{result.totalQuestions}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-400">
                                    Submitted: {new Date(result.submittedAt).toLocaleDateString()}
                                </p>
                            </div>
                            <Button
                                onClick={() => navigate(`/quiz-results/${result._id}`)}
                                size="sm"
                                className="mt-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-md hover:from-pink-600 hover:to-purple-600 text-sm font-semibold transition-all duration-300 hover:-translate-y-1 shadow-md"
                            >
                                View Details
                            </Button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UserResultsComponent;