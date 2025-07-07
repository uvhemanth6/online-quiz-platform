// frontend/src/pages/UserResultsComponent.jsx // Component to list a user's past quiz results

import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner'; // Import LoadingSpinner
import { useAuth } from '../contexts/AuthContext'; // Import useAuth for showMessage
import api from '../api/axiosInstance'; // Import configured axios instance
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const UserResultsComponent = ({ userId }) => { // Removed navigate from props
    const [userResults, setUserResults] = useState([]);
    const [loadingResults, setLoadingResults] = useState(true);
    const { showMessage } = useAuth(); // Access showMessage for notifications
    const navigate = useNavigate(); // Initialize useNavigate hook

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
        return <div className="text-center text-dark text-md py-4">No results yet. Take a quiz to see your scores!</div>;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-primary-100 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userResults.map(result => (
                    <div key={result._id} className="border border-info-200 p-4 rounded-xl bg-info-50 shadow-sm flex flex-col justify-between">
                        <div>
                            <h4 className="text-lg font-bold text-info-700 mb-1">{result.quizTitle || 'Unknown Quiz'}</h4>
                            <p className="text-md text-dark">Score: {result.score} / {result.totalQuestions}</p>
                            <p className="text-sm text-gray-500">
                                Submitted: {new Date(result.submittedAt).toLocaleDateString()}
                            </p>
                        </div>
                        <button
                            onClick={() => navigate(`/quiz-results/${result._id}`)} // Use React Router navigate with dynamic path
                            className="mt-3 bg-info text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm font-semibold"
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
