// frontend/src/pages/CreateEditQuizPage.jsx// Form for creating or editing quizzes (Admin only)

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
    const [generatingQuestions, setGeneratingQuestions] = useState(false); // New state for LLM loading
    const [questionsGeneratedSuccessfully, setQuestionsGeneratedSuccessfully] = useState(false); // New state for UI feedback

    // Default values for the form, used when creating a new quiz
    const defaultQuizData = {
        title: '',
        description: '',
        category: '',
        duration: 30, // Default duration in minutes
        questions: [{ questionText: '', options: ['', '', '', ''], correctAnswer: '' }] // Initial empty question
    };

    // Initialize react-hook-form with yup resolver and default values
    const { register, handleSubmit, control, formState: { errors }, reset, watch, setValue } = useForm({
        resolver: yupResolver(quizSchema),
        defaultValues: defaultQuizData // Start with default structure
    });

    const questions = watch('questions'); // Watch the questions array for dynamic updates in the UI
    const quizTitle = watch('title'); // Watch quiz title for question generation
    const quizCategory = watch('category'); // Watch quiz category for question generation

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
            // For new quizzes, defaultValues in useForm already handle initial state.
            // No need to call reset here, as it would clear user input on re-renders.
            setLoading(false);
        }
    }, [quizIdToEdit, navigate, showMessage, reset]); // Dependencies for useEffect


    // Function to add a new empty question to the form
    const addQuestion = () => {
        const newQuestions = [...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '' }];
        setValue('questions', newQuestions); // Use setValue to update array directly
        setQuestionsGeneratedSuccessfully(false); // Reset feedback on manual add
    };

    // Function to remove a question from the form by index
    const removeQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setValue('questions', newQuestions); // Use setValue to update array directly
        setQuestionsGeneratedSuccessfully(false); // Reset feedback on manual remove
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

    // --- Gemini API Integration: Generate Questions ---
    const generateQuestionsWithLLM = async () => {
        // First, validate the basic quiz details (title, category) before calling LLM
        // This prevents unnecessary API calls if essential info is missing.
        if (!quizTitle || !quizCategory) {
            showMessage('Please enter a Quiz Title and Category to generate questions.', 'info');
            return;
        }

        setGeneratingQuestions(true);
        setQuestionsGeneratedSuccessfully(false); // Reset success feedback
        showMessage('Generating questions with AI...', 'info');

        try {
            // Modified prompt to generate 10 questions
            const prompt = `Generate 10 multiple-choice quiz questions about "${quizTitle}" in the category of "${quizCategory}".
            Each question should have 4 options, and one correct answer.
            Provide the output as a JSON array of objects, where each object has:
            - "questionText": string
            - "options": string[] (array of 4 strings)
            - "correctAnswer": string (must exactly match one of the options)
            Ensure the JSON is valid and only contains the array of questions.`;

            console.log("Gemini API Request Prompt:", prompt); // Log the prompt
            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });

            const payload = {
                contents: chatHistory,
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
            console.log("Gemini API Request Payload:", JSON.stringify(payload, null, 2)); // Log the payload

            // IMPORTANT: Replace "YOUR_GEMINI_API_KEY_HERE" with your actual Gemini API key
            // You can get one from Google AI Studio: https://aistudio.google.com/app/apikey
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            console.log("Gemini API Raw Response:", response); // Log raw response object
            const result = await response.json();
            console.log("Gemini API Parsed Result:", result); // Log parsed JSON result

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const jsonString = result.candidates[0].content.parts[0].text;
                console.log("Gemini API Generated JSON String:", jsonString);
                const generatedQuestions = JSON.parse(jsonString);

                // Update the form's questions array with the generated questions
                setValue('questions', generatedQuestions);
                setQuestionsGeneratedSuccessfully(true); // Set success feedback

                // *** NEW: Programmatically submit the form after questions are generated ***
                // This will trigger validation and then call onSubmit if valid.
                handleSubmit(onSubmit)();

            } else {
                showMessage('Failed to generate questions. Please try again. Check console for details.', 'error');
                console.error("Gemini API response structure unexpected:", result);
            }
        } catch (error) {
            showMessage(`Error generating questions: ${error.message}`, 'error');
            console.error("Error calling Gemini API:", error);
        } finally {
            setGeneratingQuestions(false);
        }
    };
    // --- End Gemini API Integration ---


    if (loadingAuth || loading) {
        return <LoadingSpinner />;
    }

    if (!currentUser || currentUser.role !== 'admin') {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
                <div className="text-center text-red-600 text-xl">Access Denied: Admins only.</div>
            </div>
        );
    }

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

                {/* Gemini API button for question generation */}
                <div className="text-center">
                    <button
                        type="button"
                        onClick={generateQuestionsWithLLM}
                        disabled={generatingQuestions}
                        className="bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 font-bold shadow-md flex items-center justify-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
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
                            <>
                                ✨ Generate up to 10 Questions with AI
                            </>
                        )}
                    </button>
                </div>


                {/* Questions Section */}
                <h2 className="text-2xl font-bold text-purple-700 mb-4 pt-4 border-t border-gray-200">Questions</h2>
                {/* Visual feedback for generated questions */}
                {questionsGeneratedSuccessfully && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Success!</strong>
                        <span className="block sm:inline ml-2">Questions have been generated and populated. If all other quiz details are filled, the quiz has been automatically saved. Otherwise, please fill missing details and click "Create Quiz" or "Update Quiz" to save.</span>
                    </div>
                )}
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
