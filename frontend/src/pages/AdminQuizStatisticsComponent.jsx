// frontend/src/pages/AdminQuizStatisticsComponent.jsx // Component to display overall quiz stats for admin

import React from 'react'; // Removed useState, useEffect as data is passed via props
// import LoadingSpinner from '../components/LoadingSpinner'; // No longer needed as parent handles loading
// import { useAuth } from '../contexts/AuthContext'; // No longer needed for fetching
// import api from '../api/axiosInstance'; // No longer needed for fetching

// This component now receives quizzes and allResults as props from its parent (DashboardPage)
const AdminQuizStatisticsComponent = ({ quizzes, allResults }) => {
    // No local state or useEffect for fetching needed here, as data comes from props.

    // If there are no quiz results, display a message.
    if (allResults.length === 0) {
        return <div className="text-center text-gray-600 text-md py-4">No user results available yet.</div>;
    }

    // Calculate average scores per quiz for overall statistics
    // Initialize quiz statistics based on the 'quizzes' prop
    const quizStats = quizzes.reduce((acc, quiz) => {
        acc[quiz._id] = {
            title: quiz.title,
            totalSubmissions: 0,
            totalScore: 0,
            averageScore: 0,
            totalQuestions: quiz.questions.length
        };
        return acc;
    }, {});

    // Aggregate results from 'allResults' into the 'quizStats'
    allResults.forEach(result => {
        // Ensure the quiz ID from the result exists in our quiz list
        if (quizStats[result.quizId]) {
            quizStats[result.quizId].totalSubmissions++;
            quizStats[result.quizId].totalScore += result.score;
        }
    });

    // Calculate the average score for each quiz
    Object.keys(quizStats).forEach(quizId => {
        if (quizStats[quizId].totalSubmissions > 0) {
            // Calculate average score as (totalScore / totalQuestions)
            // Note: This calculates average score per question, not average percentage.
            // If you want average percentage, it would be (totalScore / (totalSubmissions * totalQuestions)) * 100
            quizStats[quizId].averageScore = (quizStats[quizId].totalScore / quizStats[quizId].totalQuestions).toFixed(2);
        }
    });

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mt-6">
            <h3 className="text-2xl font-bold text-purple-700 mb-4">Overall Quiz Performance</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Quiz Title</th>
                            <th className="py-3 px-6 text-left">Total Submissions</th>
                            <th className="py-3 px-6 text-left">Avg. Score</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm">
                        {/* Display overall stats per quiz */}
                        {Object.values(quizStats).map((stats, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-6 text-left whitespace-nowrap">{stats.title}</td>
                                <td className="py-3 px-6 text-left">{stats.totalSubmissions}</td>
                                <td className="py-3 px-6 text-left">{stats.averageScore} / {stats.totalQuestions}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h3 className="text-2xl font-bold text-purple-700 mt-8 mb-4">All User Submissions</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">User Name / Email</th>
                            <th className="py-3 px-6 text-left">Quiz</th>
                            <th className="py-3 px-6 text-left">Score</th>
                            <th className="py-3 px-6 text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm">
                        {/* Display individual user submissions */}
                        {allResults.map(result => (
                            <tr key={result._id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                    {/* Display user name and email if populated by backend */}
                                    {result.userId ? `${result.userId.name} (${result.userId.email})` : 'N/A'}
                                </td>
                                <td className="py-3 px-6 text-left">{result.quizId ? result.quizId.title : result.quizTitle || 'N/A'}</td>
                                <td className="py-3 px-6 text-left">{result.score} / {result.totalQuestions}</td>
                                <td className="py-3 px-6 text-left">{new Date(result.submittedAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminQuizStatisticsComponent;
