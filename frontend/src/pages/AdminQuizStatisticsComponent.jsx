import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const AdminQuizStatisticsComponent = ({ quizzes, allResults }) => {
    const [searchTerm, setSearchTerm] = useState('');

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

    allResults.forEach(result => {
        const currentQuizId = result.quizId && typeof result.quizId === 'object' ? result.quizId._id : result.quizId;
        if (quizStats[currentQuizId]) {
            quizStats[currentQuizId].totalSubmissions++;
            quizStats[currentQuizId].totalCorrectAnswers += result.score;
            quizStats[currentQuizId].totalPossibleAnswers += result.totalQuestions;
        }
    });

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
        return <div className="text-center text-gray-400 text-md py-4">No user results available yet.</div>;
    }

    return (
        <div className="classic-bg min-h-screen flex items-center justify-center py-12 px-4">
            <Card className="bg-gray-900/80 p-8 rounded-3xl shadow-2xl w-full max-w-6xl border border-pink-700/40 hover:border-purple-400/50 transition-all duration-300">
                <CardHeader>
                    <CardTitle className="text-3xl font-extrabold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 drop-shadow-lg">
                        Overall Quiz Performance
                    </CardTitle>
                </CardHeader>
                <CardContent>
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
                             <div className="text-center text-gray-400 text-lg py-10">No sufficient data to display chart with non-zero average scores. Take some quizzes!</div>
                         )}
                    </div>

                    {/* User Submissions Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-8 mb-4">
                        <h3 className="text-2xl font-bold text-white mb-4 sm:mb-0">All User Submissions</h3>
                        <input
                            type="text"
                            placeholder="Search by user, email, or quiz title..."
                            className="w-full sm:w-1/2 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-gray-800/50 border border-gray-700 rounded-xl">
                            <thead>
                                <tr className="bg-gray-700 text-gray-300 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">User Name / Email</th>
                                    <th className="py-3 px-6 text-left">Quiz</th>
                                    <th className="py-3 px-6 text-left">Score</th>
                                    <th className="py-3 px-6 text-left">Date</th>
                                </tr>
                            </thead>
                            <tbody className="text-white text-sm">
                                {filteredResults.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="py-4 text-center text-gray-400">No matching submissions found.</td>
                                    </tr>
                                ) : (
                                    filteredResults.map(result => (
                                        <tr key={result._id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                            <td className="py-3 px-6 text-left whitespace-nowrap">
                                                {result.userId ? (
                                                    <>
                                                        <span className="text-cyan-400">{result.userId.name}</span>
                                                        <span className="text-gray-400"> (</span>
                                                        <span className="text-blue-400">{result.userId.email}</span>
                                                        <span className="text-gray-400">)</span>
                                                    </>
                                                ) : 'N/A'}
                                            </td>
                                            <td className="py-3 px-6 text-left">{result.quizTitle || 'N/A'}</td>
                                            <td className="py-3 px-6 text-left">
                                                <span className={
                                                    result.score / result.totalQuestions >= 0.7 ? 'text-green-400' :
                                                    result.score / result.totalQuestions >= 0.4 ? 'text-yellow-400' :
                                                    'text-red-400'
                                                }>
                                                    {result.score} / {result.totalQuestions}
                                                </span>
                                            </td>
                                            <td className="py-3 px-6 text-left text-gray-300">
                                                {new Date(result.submittedAt).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminQuizStatisticsComponent;