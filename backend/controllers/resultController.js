const Result = require('../models/Result');
const Quiz = require('../models/Quiz'); // To get quiz title for result

// @desc    Submit quiz results
// @route   POST /api/results
// @access  Private
const submitResult = async (req, res, next) => {
    const { quizId, score, totalQuestions, userAnswers } = req.body;

    if (!quizId || score === undefined || totalQuestions === undefined) {
        return res.status(400).json({ message: 'Missing required result fields.' });
    }

    try {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found.' });
        }

        const result = new Result({
            userId: req.user._id, // User from protect middleware
            quizId,
            quizTitle: quiz.title, // Denormalize quiz title
            score,
            totalQuestions,
            userAnswers,
        });

        const createdResult = await result.save();
        res.status(201).json(createdResult);
    } catch (error) {
        next(error);
    }
};

// @desc    Get results for a specific user
// @route   GET /api/results/my-results
// @access  Private
const getMyResults = async (req, res, next) => {
    try {
        const results = await Result.find({ userId: req.user._id }).sort({ submittedAt: -1 });
        res.json(results);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all results (Admin only)
// @route   GET /api/results/all
// @access  Private/Admin
const getAllResults = async (req, res, next) => {
    try {
        const results = await Result.find({})
            .populate('userId', 'name email') // Populate user details
            .populate('quizId', 'title') // Populate quiz title
            .sort({ submittedAt: -1 });
        res.json(results);
    } catch (error) {
        next(error);
    }
};

// @desc    Get a single result by ID
// @route   GET /api/results/:id
// @access  Private (User can get their own, Admin can get any)
const getResultById = async (req, res, next) => {
    try {
        const result = await Result.findById(req.params.id);

        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }

        // Check if the user is the owner of the result OR an admin
        if (result.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view this result' });
        }

        res.json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    submitResult,
    getMyResults,
    getAllResults,
    getResultById,
};
