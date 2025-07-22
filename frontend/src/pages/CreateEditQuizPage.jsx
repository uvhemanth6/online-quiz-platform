import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { quizSchema } from '../utils/validationSchemas';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';

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
        <div className="classic-bg min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 drop-shadow-lg">
                    {quizIdToEdit ? 'Edit Quiz' : 'Create New Quiz'}
                </h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Card className="bg-gray-900/80 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl w-full max-w-3xl mx-auto border border-purple-700/40 hover:border-pink-400/50 transition-all duration-300">
                        <CardContent>
                            {/* Quiz Details Section */}
                            <div>
                                <Label htmlFor="title">Quiz Title</Label>
                                <Input
                                    type="text"
                                    id="title"
                                    {...register('title')}
                                    placeholder="e.g., General Knowledge Quiz"
                                    className="mt-2"
                                />
                                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    {...register('description')}
                                    rows="3"
                                    placeholder="A brief description of the quiz..."
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent mt-2"
                                ></textarea>
                                {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="category">Category</Label>
                                    <Input
                                        type="text"
                                        id="category"
                                        {...register('category')}
                                        placeholder="e.g., Science, History"
                                        className="mt-2"
                                    />
                                    {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="duration">Duration (minutes)</Label>
                                    <Input
                                        type="number"
                                        id="duration"
                                        {...register('duration', { valueAsNumber: true })}
                                        min="1"
                                        className="mt-2"
                                    />
                                    {errors.duration && <p className="text-red-400 text-xs mt-1">{errors.duration.message}</p>}
                                </div>
                            </div>
                            {/* AI Question Generation */}
                            <div className="text-center mt-6">
                                <Button
                                    type="button"
                                    onClick={generateQuestionsWithLLM}
                                    disabled={generatingQuestions}
                                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-md hover:from-pink-600 hover:to-purple-600 font-bold shadow-md flex items-center justify-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-1"
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
                                </Button>
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
                                <Card key={qIndex} className="border border-gray-700 p-5 rounded-xl bg-gray-800/50 space-y-4 shadow-sm relative mb-6">
                                    <Button
                                        type="button"
                                        onClick={() => removeQuestion(qIndex)}
                                        variant="destructive"
                                        className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-1 w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                                        aria-label="Remove question"
                                    >
                                        X
                                    </Button>
                                    <div>
                                        <Label htmlFor={`question-${qIndex}`}>Question {qIndex + 1} Text</Label>
                                        <Input
                                            type="text"
                                            id={`question-${qIndex}`}
                                            {...register(`questions.${qIndex}.questionText`)}
                                            placeholder="Enter question text"
                                            className="mt-2"
                                        />
                                        {errors.questions?.[qIndex]?.questionText && <p className="text-red-400 text-xs mt-1">{errors.questions[qIndex].questionText.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Options</Label>
                                        {question.options.map((option, oIndex) => (
                                            <Input
                                                key={oIndex}
                                                type="text"
                                                {...register(`questions.${qIndex}.options.${oIndex}`)}
                                                placeholder={`Option ${oIndex + 1}`}
                                                className="mt-2"
                                            />
                                        ))}
                                        {errors.questions?.[qIndex]?.options && errors.questions[qIndex].options.map((err, oIndex) => err && <p key={oIndex} className="text-red-400 text-xs mt-1">{err.message}</p>)}
                                    </div>
                                    <div>
                                        <Label htmlFor={`correct-answer-${qIndex}`}>Correct Answer</Label>
                                        <Input
                                            type="text"
                                            id={`correct-answer-${qIndex}`}
                                            {...register(`questions.${qIndex}.correctAnswer`)}
                                            placeholder="Enter the correct option text"
                                            className="mt-2"
                                        />
                                        {errors.questions?.[qIndex]?.correctAnswer && <p className="text-red-400 text-xs mt-1">{errors.questions[qIndex].correctAnswer.message}</p>}
                                    </div>
                                </Card>
                            ))}
                            {/* Add Question Button */}
                            <Button
                                type="button"
                                onClick={addQuestion}
                                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-md hover:from-pink-600 hover:to-purple-600 font-bold shadow-md flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                                Add Question
                            </Button>
                            {/* Action Buttons */}
                            <div className="flex space-x-4 mt-6">
                                <Button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-md hover:from-pink-600 hover:to-purple-600 font-bold text-lg transition-all duration-300 hover:-translate-y-1"
                                >
                                    {quizIdToEdit ? 'Update Quiz' : 'Create Quiz'}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className="flex-1 bg-red-600 text-white py-3 rounded-md hover:bg-red-700 font-bold text-lg transition-colors duration-300 shadow-md border border-red-700"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    );
};

export default CreateEditQuizPage;