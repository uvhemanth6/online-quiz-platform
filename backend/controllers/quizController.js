// backend/controllers/quizController.js

const Quiz = require('../models/Quiz');
const Result = require('../models/Result'); // <<-- NEW: Import the Result model
const User = require('../models/User'); // Assuming User model is also used/needed, keep existing imports

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Public
const getQuizzes = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find({}).sort({ createdAt: -1 }); // Latest quizzes first
        res.json(quizzes);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single quiz by ID
// @route   GET /api/quizzes/:id
// @access  Public
const getQuizById = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (quiz) {
            res.json(quiz);
        } else {
            res.status(404).json({ message: 'Quiz not found' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private/Admin
const createQuiz = async (req, res, next) => {
    const { title, description, category, duration, questions } = req.body;

    if (!title || !description || !category || !duration || !questions || questions.length === 0) {
        return res.status(400).json({ message: 'Please enter all required fields and at least one question' });
    }

    try {
        const quiz = new Quiz({
            title,
            description,
            category,
            duration,
            questions,
            createdBy: req.user._id, // User from protect middleware
        });

        const createdQuiz = await quiz.save();
        res.status(201).json(createdQuiz);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a quiz
// @route   PUT /api/quizzes/:id
// @access  Private/Admin
const updateQuiz = async (req, res, next) => {
    const { title, description, category, duration, questions } = req.body;

    try {
        const quiz = await Quiz.findById(req.params.id);

        if (quiz) {
            // Check if user is the creator or an admin
            if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Not authorized to update this quiz' });
            }

            quiz.title = title || quiz.title;
            quiz.description = description || quiz.description;
            quiz.category = category || quiz.category;
            quiz.duration = duration || quiz.duration;
            quiz.questions = questions || quiz.questions; // Allow empty questions array for update if desired by admin

            const updatedQuiz = await quiz.save();
            res.json(updatedQuiz);
        } else {
            res.status(404).json({ message: 'Quiz not found' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a quiz
// @route   DELETE /api/quizzes/:id
// @access  Private/Admin
const deleteQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Check if user is the creator or an admin
        if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this quiz' });
        }

        // --- NEW LOGIC: Delete all associated results for this quiz ---
        const deleteResults = await Result.deleteMany({ quizId: req.params.id });
        console.log(`Deleted ${deleteResults.deletedCount} results for quiz ID: ${req.params.id}`);
        // --- END NEW LOGIC ---

        // Now, delete the quiz itself
        await quiz.deleteOne(); // Use deleteOne() for Mongoose 5.x/6.x.

        res.status(200).json({ message: 'Quiz and associated results removed successfully' });
    } catch (error) {
        console.error("Error deleting quiz or results:", error);
        next(error); // Pass the error to the error handling middleware
    }
};

module.exports = {
    getQuizzes,
    getQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
};
