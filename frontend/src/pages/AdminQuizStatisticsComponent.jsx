// frontend/src/pages/AdminQuizStatisticsComponent.jsx // Component to display overall quiz stats for admin (Dark Theme with Inline Search)

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminQuizStatisticsComponent = ({ quizzes, allResults }) => {
    const [searchTerm, setSearchTerm] = useState(''); // State for the search input

    // Initialize quizStats with all quizzes, setting up their initial counters
    const quizStats = quizzes.reduce((acc, quiz) => {
        acc[quiz._id] = {
            title: quiz.title,
            totalSubmissions: 0,
            totalCorrectAnswers: 0,
            totalPossibleAnswers: 0,
            averageScorePercentage: 0,
        };
        return acc;
    }, {});

    // Iterate through all results to populate quizStats
    allResults.forEach(result => {
        const currentQuizId = result.quizId && typeof result.quizId === 'object' ? result.quizId._id : result.quizId;

        if (quizStats[currentQuizId]) {
            quizStats[currentQuizId].totalSubmissions++;
            quizStats[currentQuizId].totalCorrectAnswers += result.score;
            quizStats[currentQuizId].totalPossibleAnswers += result.totalQuestions;
        }
    });

    // Prepare data for the chart
    const chartData = [];
    Object.keys(quizStats).forEach(quizId => {
        const stats = quizStats[quizId];
        let calculatedAverage = 0;

        if (stats.totalSubmissions > 0 && stats.totalPossibleAnswers > 0) {
            calculatedAverage = ((stats.totalCorrectAnswers / stats.totalPossibleAnswers) * 100).toFixed(2);
        }

        chartData.push({
            name: stats.title,
            'Average Score (%)': parseFloat(calculatedAverage)
        });
    });

    // Filtered results for the table based on searchTerm
    const filteredResults = allResults.filter(result => {
        const userDisplayName = result.userId ? `${result.userId.name} ${result.userId.email}` : 'N/A';
        const quizTitle = result.quizTitle || 'N/A';
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        return (
            userDisplayName.toLowerCase().includes(lowerCaseSearchTerm) ||
            quizTitle.toLowerCase().includes(lowerCaseSearchTerm)
        );
    });

    if (allResults.length === 0) {
        return <div className="text-center text-dark-text-muted text-md py-4">No user results available yet.</div>;
    }

    return (
        <div className="bg-dark-bg-light p-6 rounded-xl shadow-glow-md border border-dark-bg-lighter mt-6">
            <h3 className="text-2xl font-bold text-dark-text-light mb-4">Overall Quiz Performance</h3>

            <div className="mb-8" style={{ width: '100%', height: 300 }}>
                 {chartData.some(data => data['Average Score (%)'] > 0) ? (
                     <ResponsiveContainer width="100%" height="100%">
                         <BarChart
                             data={chartData}
                             margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                         >
                             <CartesianGrid strokeDasharray="3 3" stroke="#4a4a4a" />
                             <XAxis dataKey="name" angle={-15} textAnchor="end" height={60} interval={0} stroke="#9CA3AF" fill="#9CA3AF" />
                             <YAxis domain={[0, 100]} label={{ value: 'Average Score (%)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }} stroke="#9CA3AF" />
                             <Tooltip
                                contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', color: '#E5E7EB' }}
                                itemStyle={{ color: '#E5E7EB' }}
                             />
                             <Legend wrapperStyle={{ color: '#E5E7EB', paddingTop: '10px' }} />
                             <defs>
                                 <linearGradient id="colorAverage" x1="0" y1="0" x2="0" y2="1">
                                     <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.9}/>
                                     <stop offset="95%" stopColor="#A78BFA" stopOpacity={0.8}/>
                                 </linearGradient>
                             </defs>
                             <Bar dataKey="Average Score (%)" fill="url(#colorAverage)" />
                         </BarChart>
                     </ResponsiveContainer>
                 ) : (
                     <div className="text-center text-dark-text-muted text-lg py-10">No sufficient data to display chart with non-zero average scores. Take some quizzes!</div>
                 )}
            </div>

            {/* Inline Search Input for User Submissions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-8 mb-4">
                <h3 className="text-2xl font-bold text-dark-text-light mb-4 sm:mb-0">All User Submissions</h3>
                <input
                    type="text"
                    placeholder="Search by user, email, or quiz title..."
                    className="w-full sm:w-1/2 p-3 rounded-lg bg-dark-bg-lighter text-dark-text-light border border-dark-bg-lighter focus:ring-accent-primary-light focus:border-transparent transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-dark-bg-light border border-dark-bg-lighter rounded-xl">
                    <thead>
                        <tr className="bg-dark-bg-lighter text-dark-text-muted uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">User Name / Email</th>
                            <th className="py-3 px-6 text-left">Quiz</th>
                            <th className="py-3 px-6 text-left">Score</th>
                            <th className="py-3 px-6 text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody className="text-dark-text-light text-sm">
                        {filteredResults.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="py-4 text-center text-dark-text-muted">No matching submissions found.</td>
                            </tr>
                        ) : (
                            filteredResults.map(result => (
                                <tr key={result._id} className="border-b border-dark-bg-lighter hover:bg-dark-bg">
                                    <td className="py-3 px-6 text-left whitespace-nowrap">
                                        {result.userId ? `${result.userId.name} (${result.userId.email})` : 'N/A'}
                                    </td>
                                    <td className="py-3 px-6 text-left">{result.quizTitle || 'N/A'}</td>
                                    <td className="py-3 px-6 text-left">{result.score} / {result.totalQuestions}</td>
                                    <td className="py-3 px-6 text-left">{new Date(result.submittedAt).toLocaleString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminQuizStatisticsComponent;
