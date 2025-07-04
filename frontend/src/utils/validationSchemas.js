// frontend/src/utils/validationSchemas.js // Yup schemas for form validation

import * as yup from 'yup';

// Schema for user registration form
export const registerSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    role: yup.string().oneOf(['user', 'admin']).required('Role is required'), // Role selection
});

// Schema for user login form
export const loginSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required'),
});

// Schema for quiz creation/editing form
export const quizSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    category: yup.string().required('Category is required'),
    duration: yup.number().min(1, 'Duration must be at least 1 minute').required('Duration is required').typeError('Duration must be a number'),
    questions: yup.array().of( // Array of question objects
        yup.object().shape({
            questionText: yup.string().required('Question text is required'),
            options: yup.array().of(yup.string().required('Option cannot be empty')).min(2, 'At least two options are required'),
            correctAnswer: yup.string().required('Correct answer is required').test(
                'is-in-options', // Custom test name
                'Correct answer must be one of the provided options', // Error message
                function (value) {
                    // 'this.parent.options' refers to the 'options' array within the same question object
                    return this.parent.options.includes(value);
                }
            ),
        })
    ).min(1, 'At least one question is required for the quiz.'), // At least one question for the quiz
});