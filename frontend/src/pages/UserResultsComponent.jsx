import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner'; // Import LoadingSpinner
import { useAuth } from '../contexts/AuthContext'; // Import useAuth for showMessage
import api from '../api/axiosInstance'; // Import configured axios instance

const UserResultsComponent = ({ userId, navigate }) => {
    const [userResults, setUserResults] = useState([]);
    const [loadingResults, setLoadingResults] = useState(true);
    const { showMessage } = useAuth(); // Access showMessage for notifications

    useEffect(() => {
        const fetchUserResults = async () => {
            try {
                const res = await api.get('/results/my-results'); // Fetch results for the current user
                setUserResults(res.data);
            } catch (error) {
                console.error("Error fetching user results: ", error.response?.data || error.message);
                showMessage("Failed to load your results.", 'error');
            } finally {
                setLoadingResults(false); // Stop loading regardless of success/failure
            }
        };
        fetchUserResults();
    }, [userId, showMessage]); // Re-fetch if userId or showMessage changes

    if (loadingResults) {
        return <LoadingSpinner />;
    }

    if (userResults.length === 0) {
        return <div className="text-center text-gray-600 text-md py-4">No results yet. Take a quiz to see your scores!</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userResults.map(result => (
                    <div key={result._id} className="border border-blue-200 p-4 rounded-lg bg-blue-50 shadow-sm flex flex-col justify-between">
                        <div>
                            <h4 className="text-lg font-bold text-blue-700 mb-1">{result.quizTitle || 'Unknown Quiz'}</h4>
                            <p className="text-md text-gray-700">Score: {result.score} / {result.totalQuestions}</p>
                            <p className="text-sm text-gray-500">
                                Submitted: {new Date(result.submittedAt).toLocaleDateString()}
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('quiz-results', { resultId: result._id })} // Navigate to detailed result page
                            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm font-semibold"
                        >
                            View Details
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserResultsComponent;