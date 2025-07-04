const Question = require('../models/Questions'); // Assuming a standalone Question model

// @desc    Get all questions for a quiz
// @route   GET /api/questions/quiz/:quizId
// @access  Public
const getQuestionsByQuiz = async (req, res, next) => {
    try {
        const questions = await Question.find({ quizId: req.params.quizId });
        res.json(questions);
    } catch (error) {
        next(error);
    }
};

// @desc    Add a question to a quiz
// @route   POST /api/questions
// @access  Private/Admin
const createQuestion = async (req, res, next) => {
    const { quizId, questionText, options, correctAnswer } = req.body;
    if (!quizId || !questionText || !options || options.length < 2 || !correctAnswer) {
        return res.status(400).json({ message: 'Please provide all required question fields.' });
    }

    try {
        const question = new Question({
            quizId,
            questionText,
            options,
            correctAnswer,
        });
        const createdQuestion = await question.save();
        res.status(201).json(createdQuestion);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Private/Admin
const updateQuestion = async (req, res, next) => {
    const { questionText, options, correctAnswer } = req.body;
    try {
        const question = await Question.findById(req.params.id);
        if (question) {
            question.questionText = questionText || question.questionText;
            question.options = options || question.options;
            question.correctAnswer = correctAnswer || question.correctAnswer;
            const updatedQuestion = await question.save();
            res.json(updatedQuestion);
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
const deleteQuestion = async (req, res, next) => {
    try {
        const question = await Question.findById(req.params.id);
        if (question) {
            await question.deleteOne();
            res.json({ message: 'Question removed' });
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getQuestionsByQuiz,
    createQuestion,
    updateQuestion,
    deleteQuestion,
};

