import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { quizSchema } from '../utils/validationSchemas';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';

const CreateEditQuizPage = () => {
    const { currentUser, loadingAuth, showMessage } = useAuth();
    const navigate = useNavigate();
    const { quizId: quizIdToEdit } = useParams();
    const [loading, setLoading] = useState(true);
    const [generatingQuestions, setGeneratingQuestions] = useState(false);
    const [questionsGeneratedSuccessfully, setQuestionsGeneratedSuccessfully] = useState(false);

    const defaultQuizData = {
        title: '',
        description: '',
        category: '',
        duration: 30,
        questions: [{ questionText: '', options: ['', '', '', ''], correctAnswer: '' }]
    };

    const { register, handleSubmit, control, formState: { errors }, reset, watch, setValue } = useForm({
        resolver: yupResolver(quizSchema),
        defaultValues: defaultQuizData
    });

    const questions = watch('questions');
    const quizTitle = watch('title');
    const quizCategory = watch('category');

    useEffect(() => {
        if (quizIdToEdit) {
            const fetchQuiz = async () => {
                try {
                    const res = await api.get(`/quizzes/${quizIdToEdit}`);
                    const fetchedQuiz = res.data;
                    reset(fetchedQuiz);
                } catch (error) {
                    console.error("Error fetching quiz for edit:", error);
                    showMessage("Failed to load quiz for editing.", 'error');
                    navigate('/dashboard');
                } finally {
                    setLoading(false);
                }
            };
            fetchQuiz();
        } else {
            setLoading(false);
        }
    }, [quizIdToEdit, navigate, showMessage, reset]);

    const addQuestion = () => {
        const newQuestions = [...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '' }];
        setValue('questions', newQuestions);
        setQuestionsGeneratedSuccessfully(false);
    };

    const removeQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setValue('questions', newQuestions);
        setQuestionsGeneratedSuccessfully(false);
    };

    const onSubmit = async (data) => {
        try {
            if (quizIdToEdit) {
                await api.put(`/quizzes/${quizIdToEdit}`, data);
                showMessage('Quiz updated successfully!', 'success');
            } else {
                await api.post('/quizzes', data);
                showMessage('Quiz created successfully!', 'success');
            }
            navigate('/dashboard');
        } catch (error) {
            console.error("Error saving quiz:", error);
            showMessage(`Failed to save quiz: ${error.response?.data?.message || error.message}`, 'error');
        }
    };

    const generateQuestionsWithLLM = async () => {
        if (!quizTitle || !quizCategory) {
            showMessage('Please enter a Quiz Title and Category to generate questions.', 'info');
            return;
        }

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            showMessage('Gemini API Key is not configured.', 'error');
            return;
        }

        setGeneratingQuestions(true);
        setQuestionsGeneratedSuccessfully(false);

        try {
            const prompt = `Generate 10 multiple-choice quiz questions about "${quizTitle}" in the category of "${quizCategory}".
            Each question should have 4 options, and one correct answer.
            Provide the output as a JSON array of objects, where each object has:
            - "questionText": string
            - "options": string[] (array of 4 strings)
            - "correctAnswer": string (must exactly match one of the options)
            Ensure the JSON is valid and only contains the array of questions.`;

            const payload = {
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                "questionText": { "type": "STRING" },
                                "options": { "type": "ARRAY", "items": { "type": "STRING" } },
                                "correctAnswer": { "type": "STRING" }
                            },
                            "required": ["questionText", "options", "correctAnswer"]
                        }
                    }
                }
            };

            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                const generatedQuestions = JSON.parse(result.candidates[0].content.parts[0].text);
                setValue('questions', generatedQuestions);
                setQuestionsGeneratedSuccessfully(true);
                handleSubmit(onSubmit)();
            } else {
                showMessage('Failed to generate questions. Please try again.', 'error');
            }
        } catch (error) {
            showMessage(`Error generating questions: ${error.message}`, 'error');
        } finally {
            setGeneratingQuestions(false);
        }
    };

    if (loadingAuth || loading) {
        return <LoadingSpinner />;
    }

    if (!currentUser || currentUser.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
                <div className="text-center text-2xl text-red-400">Access Denied: Admins only.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    {quizIdToEdit ? 'Edit Quiz' : 'Create New Quiz'}
                </h1>
                
                <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-800/70 backdrop-blur-sm p-8 rounded-xl shadow-xl w-full max-w-3xl mx-auto border border-gray-700 space-y-6">
                    {/* Quiz Details Section */}
                    <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="title">Quiz Title</label>
                        <input
                            type="text"
                            id="title"
                            {...register('title')}
                            placeholder="e.g., General Knowledge Quiz"
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                        {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                    </div>
                    
                    <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            {...register('description')}
                            rows="3"
                            placeholder="A brief description of the quiz..."
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        ></textarea>
                        {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="category">Category</label>
                            <input
                                type="text"
                                id="category"
                                {...register('category')}
                                placeholder="e.g., Science, History"
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            />
                            {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="duration">Duration (minutes)</label>
                            <input
                                type="number"
                                id="duration"
                                {...register('duration', { valueAsNumber: true })}
                                min="1"
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            />
                            {errors.duration && <p className="text-red-400 text-xs mt-1">{errors.duration.message}</p>}
                        </div>
                    </div>

                    {/* AI Question Generation */}
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={generateQuestionsWithLLM}
                            disabled={generatingQuestions}
                            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-md hover:from-purple-600 hover:to-blue-600 font-bold shadow-md flex items-center justify-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-1"
                        >
                            {generatingQuestions ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating...
                                </>
                            ) : (
                                '✨ Generate up to 10 Questions with AI'
                            )}
                        </button>
                    </div>

                    {/* Questions Section */}
                    <h2 className="text-2xl font-bold text-white mb-4 pt-4 border-t border-gray-700">Questions</h2>
                    
                    {questionsGeneratedSuccessfully && (
                        <div className="bg-green-900/50 border border-green-600 text-green-400 px-4 py-3 rounded relative mb-4">
                            <strong className="font-bold">Success!</strong>
                            <span className="block sm:inline ml-2">Questions generated. Fill any missing details and save.</span>
                        </div>
                    )}
                    
                    {errors.questions && <p className="text-red-400 text-sm mb-4">{errors.questions.message}</p>}

                    {questions.map((question, qIndex) => (
                        <div key={qIndex} className="border border-gray-700 p-5 rounded-xl bg-gray-800/50 space-y-4 shadow-sm relative">
                            <button
                                type="button"
                                onClick={() => removeQuestion(qIndex)}
                                className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-1 w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                                aria-label="Remove question"
                            >
                                X
                            </button>
                            
                            <div>
                                <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor={`question-${qIndex}`}>Question {qIndex + 1} Text</label>
                                <input
                                    type="text"
                                    id={`question-${qIndex}`}
                                    {...register(`questions.${qIndex}.questionText`)}
                                    placeholder="Enter question text"
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                />
                                {errors.questions?.[qIndex]?.questionText && <p className="text-red-400 text-xs mt-1">{errors.questions[qIndex].questionText.message}</p>}
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-gray-300 text-sm font-semibold">Options</label>
                                {question.options.map((option, oIndex) => (
                                    <div key={oIndex}>
                                        <input
                                            type="text"
                                            {...register(`questions.${qIndex}.options.${oIndex}`)}
                                            placeholder={`Option ${oIndex + 1}`}
                                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                        />
                                        {errors.questions?.[qIndex]?.options?.[oIndex] && <p className="text-red-400 text-xs mt-1">{errors.questions[qIndex].options[oIndex].message}</p>}
                                    </div>
                                ))}
                            </div>
                            
                            <div>
                                <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor={`correct-answer-${qIndex}`}>Correct Answer</label>
                                <input
                                    type="text"
                                    id={`correct-answer-${qIndex}`}
                                    {...register(`questions.${qIndex}.correctAnswer`)}
                                    placeholder="Enter the correct option text"
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                />
                                {errors.questions?.[qIndex]?.correctAnswer && <p className="text-red-400 text-xs mt-1">{errors.questions[qIndex].correctAnswer.message}</p>}
                            </div>
                        </div>
                    ))}

                    {/* Add Question Button */}
                    <button
                        type="button"
                        onClick={addQuestion}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-md hover:from-blue-600 hover:to-cyan-600 font-bold shadow-md flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Add Question
                    </button>

                    {/* Action Buttons */}
                    <div className="flex space-x-4 mt-6">
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-md hover:from-blue-600 hover:to-cyan-600 font-bold text-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            {quizIdToEdit ? 'Update Quiz' : 'Create Quiz'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 bg-gray-600 text-white py-3 rounded-md hover:bg-gray-500 font-bold text-lg transition-colors duration-300"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEditQuizPage;