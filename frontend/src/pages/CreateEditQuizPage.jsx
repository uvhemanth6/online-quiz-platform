import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { quizSchema } from '../utils/validationSchemas'; // Import quiz schema
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook
import LoadingSpinner from '../components/LoadingSpinner'; // Import LoadingSpinner
import api from '../api/axiosInstance'; // Import configured axios instance

const CreateEditQuizPage = ({ navigate, quizIdToEdit }) => {
    const { currentUser, loadingAuth, showMessage } = useAuth();
    const [loading, setLoading] = useState(true);

    // Default values for the form, used when creating a new quiz
    const defaultQuizData = {
        title: '',
        description: '',
        category: '',
        duration: 30, // Default duration in minutes
        questions: [{ questionText: '', options: ['', '', '', ''], correctAnswer: '' }] // Initial empty question
    };

    // Initialize react-hook-form with yup resolver and default values
    const { register, handleSubmit, control, formState: { errors }, reset, watch } = useForm({
        resolver: yupResolver(quizSchema),
        defaultValues: defaultQuizData // Start with default structure
    });

    const questions = watch('questions'); // Watch the questions array for dynamic updates in the UI

    // Effect to fetch quiz data when editing an existing quiz
    useEffect(() => {
        if (quizIdToEdit) {
            const fetchQuiz = async () => {
                try {
                    const res = await api.get(`/quizzes/${quizIdToEdit}`); // Fetch quiz by ID
                    const fetchedQuiz = res.data;
                    reset(fetchedQuiz); // Reset form with fetched data
                } catch (error) {
                    console.error("Error fetching quiz for edit:", error.response?.data || error.message);
                    showMessage("Failed to load quiz for editing.", 'error');
                    navigate('dashboard'); // Redirect if quiz not found or error
                } finally {
                    setLoading(false); // Stop loading regardless of success/failure
                }
            };
            fetchQuiz();
        } else {
            setLoading(false); // No quiz to load for creation, so stop loading
            reset(defaultQuizData); // Ensure default values are applied for new quiz
        }
    }, [quizIdToEdit, navigate, showMessage, reset]); // Dependencies for useEffect

    // Show loading spinner while authenticating or loading quiz data
    if (loadingAuth || loading) {
        return <LoadingSpinner />;
    }

    // Access control: only admins can create/edit quizzes
    if (!currentUser || currentUser.role !== 'admin') {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
                <div className="text-center text-red-600 text-xl">Access Denied: Admins only.</div>
            </div>
        );
    }

    // Function to add a new empty question to the form
    const addQuestion = () => {
        const newQuestions = [...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '' }];
        reset({ ...watch(), questions: newQuestions }); // Update form state with new question
    };

    // Function to remove a question from the form by index
    const removeQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        reset({ ...watch(), questions: newQuestions }); // Update form state
    };

    // Handle form submission (create or update quiz)
    const onSubmit = async (data) => {
        try {
            if (quizIdToEdit) {
                // If quizIdToEdit exists, it's an update operation
                await api.put(`/quizzes/${quizIdToEdit}`, data);
                showMessage('Quiz updated successfully!', 'success');
            } else {
                // Otherwise, it's a creation operation
                await api.post('/quizzes', data);
                showMessage('Quiz created successfully!', 'success');
            }
            navigate('dashboard'); // Redirect to dashboard after successful operation
        } catch (error) {
            console.error("Error saving quiz:", error.response?.data || error.message);
            showMessage(`Failed to save quiz: ${error.response?.data?.message || error.message}`, 'error');
        }
    };

    return (
        <div className="container py-8 bg-gray-50 min-h-[calc(100vh-80px)]">
            <h1 className="text-4xl font-bold text-purple-700 mb-8 text-center">
                {quizIdToEdit ? 'Edit Quiz' : 'Create New Quiz'}
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl mx-auto border border-gray-200 space-y-6">
                {/* Quiz Details Section */}
                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="title">Quiz Title</label>
                    <input
                        type="text"
                        id="title"
                        {...register('title')} // Register input with react-hook-form
                        placeholder="e.g., General Knowledge Quiz"
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        {...register('description')} // Register textarea
                        rows="3"
                        placeholder="A brief description of the quiz..."
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="category">Category</label>
                        <input
                            type="text"
                            id="category"
                            {...register('category')} // Register input
                            placeholder="e.g., Science, History"
                        />
                        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="duration">Duration (minutes)</label>
                        <input
                            type="number"
                            id="duration"
                            {...register('duration', { valueAsNumber: true })} // Register number input, convert to number
                            min="1"
                        />
                        {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration.message}</p>}
                    </div>
                </div>

                {/* Questions Section */}
                <h2 className="text-2xl font-bold text-purple-700 mb-4 pt-4 border-t border-gray-200">Questions</h2>
                {errors.questions && <p className="text-red-500 text-sm mb-4">{errors.questions.message}</p>}

                {questions && questions.map((question, qIndex) => (
                    <div key={qIndex} className="border border-purple-200 p-5 rounded-lg bg-purple-50 space-y-4 shadow-sm relative">
                        <button
                            type="button"
                            onClick={() => removeQuestion(qIndex)}
                            className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-1 w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600"
                            aria-label="Remove question"
                        >
                            X
                        </button>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor={`question-${qIndex}`}>Question {qIndex + 1} Text</label>
                            <input
                                type="text"
                                id={`question-${qIndex}`}
                                {...register(`questions.${qIndex}.questionText`)} // Register nested input
                                placeholder="Enter question text"
                            />
                            {/* Display nested errors */}
                            {errors.questions?.[qIndex]?.questionText && <p className="text-red-500 text-xs mt-1">{errors.questions[qIndex].questionText.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="block text-gray-700 text-sm font-semibold">Options</label>
                            {question.options.map((option, oIndex) => (
                                <div key={oIndex}>
                                    <input
                                        type="text"
                                        {...register(`questions.${qIndex}.options.${oIndex}`)} // Register nested option input
                                        placeholder={`Option ${oIndex + 1}`}
                                    />
                                    {errors.questions?.[qIndex]?.options?.[oIndex] && <p className="text-red-500 text-xs mt-1">{errors.questions[qIndex].options[oIndex].message}</p>}
                                </div>
                            ))}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor={`correct-answer-${qIndex}`}>Correct Answer (must match one of the options exactly)</label>
                            <input
                                type="text"
                                id={`correct-answer-${qIndex}`}
                                {...register(`questions.${qIndex}.correctAnswer`)} // Register nested input
                                placeholder="Enter the correct option text"
                            />
                            {errors.questions?.[qIndex]?.correctAnswer && <p className="text-red-500 text-xs mt-1">{errors.questions[qIndex].correctAnswer.message}</p>}
                        </div>
                    </div>
                ))}

                {/* Button to add a new question */}
                <button
                    type="button"
                    onClick={addQuestion}
                    className="w-full bg-indigo-500 text-white py-3 rounded-md hover:bg-indigo-600 font-bold shadow-md flex items-center justify-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    Add Question
                </button>

                {/* Action buttons (Submit/Update and Cancel) */}
                <div className="flex space-x-4 mt-6">
                    <button
                        type="submit"
                        className="flex-1 bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 font-bold text-lg"
                    >
                        {quizIdToEdit ? 'Update Quiz' : 'Create Quiz'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('dashboard')}
                        className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-md hover:bg-gray-400 font-bold text-lg"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateEditQuizPage;
