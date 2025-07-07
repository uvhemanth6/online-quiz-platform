// frontend/src/pages/AdminQuizStatisticsComponent.jsx // Component to display overall quiz stats for admin

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// This component now receives quizzes and allResults as props from its parent (DashboardPage)
const AdminQuizStatisticsComponent = ({ quizzes, allResults }) => {
    // Log the incoming props for debugging
    console.log("AdminStats: Quizzes Prop:", quizzes);
    console.log("AdminStats: All Results Prop:", allResults);

    // If there are no quiz results, display a message.
    if (allResults.length === 0) {
        return <div className="text-center text-gray-600 text-md py-4">No user results available yet.</div>;
    }

    // Calculate average scores per quiz for overall statistics
    // Initialize quiz statistics based on the 'quizzes' prop
    const quizStats = quizzes.reduce((acc, quiz) => {
        // Ensure quiz.questions is an array before accessing .length
        const totalQuestionsInQuiz = Array.isArray(quiz.questions) ? quiz.questions.length : 0;

        acc[quiz._id] = {
            title: quiz.title,
            totalSubmissions: 0,
            totalCorrectAnswers: 0, // Track total correct answers
            totalPossibleAnswers: 0, // Track total possible answers across all submissions
            averageScorePercentage: 0, // Will store percentage
            totalQuestionsInQuiz: totalQuestionsInQuiz // Store original quiz's total questions
        };
        return acc;
    }, {});

    console.log("AdminStats: Initialized quizStats:", quizStats);

    // Aggregate results from 'allResults' into the 'quizStats'
    allResults.forEach(result => {
        // --- FIX APPLIED HERE ---
        // Access result.quizId._id if quizId is an object (populated), otherwise use result.quizId directly
        const currentQuizId = result.quizId && typeof result.quizId === 'object' ? result.quizId._id : result.quizId;

        // Ensure the quiz ID from the result exists in our quiz list
        if (quizStats[currentQuizId]) {
            quizStats[currentQuizId].totalSubmissions++;
            quizStats[currentQuizId].totalCorrectAnswers += result.score;
            // totalPossibleAnswers for a quiz is total questions * number of submissions for that quiz
            // This is more accurate for an overall average percentage.
            // Use the stored totalQuestionsInQuiz from the quizStats object itself
            quizStats[currentQuizId].totalPossibleAnswers += quizStats[currentQuizId].totalQuestionsInQuiz;
        } else {
            console.warn(`AdminStats: Result with quizId ${currentQuizId} does not match any known quiz.`);
        }
    });

    console.log("AdminStats: After Aggregation - quizStats:", quizStats);

    // Calculate the average score percentage for each quiz
    const chartData = [];
    Object.keys(quizStats).forEach(quizId => {
        const stats = quizStats[quizId];
        let calculatedAverage = 0;

        // Log values before calculation
        console.log(`AdminStats: Calculating for Quiz "${stats.title}" (ID: ${quizId})`);
        console.log(`  totalCorrectAnswers: ${stats.totalCorrectAnswers}`);
        console.log(`  totalSubmissions: ${stats.totalSubmissions}`);
        console.log(`  totalQuestionsInQuiz: ${stats.totalQuestionsInQuiz}`);
        console.log(`  totalPossibleAnswers (aggregated): ${stats.totalPossibleAnswers}`);


        if (stats.totalSubmissions > 0 && stats.totalQuestionsInQuiz > 0 && stats.totalPossibleAnswers > 0) {
            // Calculate average score percentage based on total correct answers across all submissions
            // divided by total possible answers across all submissions for that quiz.
            calculatedAverage = ((stats.totalCorrectAnswers / stats.totalPossibleAnswers) * 100).toFixed(2);
        } else {
            console.warn(`AdminStats: Skipping average calculation for "${stats.title}" due to zero submissions, questions, or possible answers.`);
        }

        stats.averageScorePercentage = parseFloat(calculatedAverage); // Store as number for chart

        chartData.push({
            name: stats.title,
            'Average Score (%)': stats.averageScorePercentage
        });
    });

    console.log("AdminStats: Final Chart Data:", chartData);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mt-6">
            <h3 className="text-2xl font-bold text-purple-700 mb-4">Overall Quiz Performance</h3>

            {/* Bar Chart for Average Scores */}
            <div className="mb-8" style={{ width: '100%', height: 300 }}>
                {chartData.some(data => data['Average Score (%)'] > 0) ? (
                    <ResponsiveContainer>
                        <BarChart
                            data={chartData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-15} textAnchor="end" height={60} interval={0} />
                            <YAxis domain={[0, 100]} label={{ value: 'Average Score (%)', angle: -90, position: 'insideLeft' }} />
                            <Tooltip formatter={(value) => `${value}%`} />
                            <Legend />
                            <Bar dataKey="Average Score (%)" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="text-center text-gray-600 text-lg py-10">No sufficient data to display chart. Take some quizzes!</div>
                )}
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
