// backend/controllers/quizController.js

const Quiz = require('../models/Quiz');
const Result = require('../models/Result');
const Question = require('../models/Questions'); // Import Question model
const mongoose = require('mongoose'); // Import mongoose for types like ObjectId

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Public
const getQuizzes = async (req, res, next) => {
    try {
        // When fetching quizzes, populate the questions to get their full details
        const quizzes = await Quiz.find({})
                                  .populate('questions') // Populate the 'questions' array
                                  .sort({ createdAt: -1 });
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
        // When fetching a single quiz, populate the questions
        const quiz = await Quiz.findById(req.params.id).populate('questions');
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
    const { title, description, category, duration, questions: incomingQuestions } = req.body;

    if (!title || !description || !category || !duration || !incomingQuestions || incomingQuestions.length === 0) {
        return res.status(400).json({ message: 'Please enter all required fields and at least one question' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const createdBy = req.user._id;

        // 1. Create the quiz document first to get its _id
        const quiz = new Quiz({
            title,
            description,
            category,
            duration,
            questions: [], // Initialize with empty array, will add IDs later
            createdBy,
        });
        const createdQuiz = await quiz.save({ session });

        // 2. Now create and save each question document with the createdQuiz._id
        const questionIds = [];
        for (const qData of incomingQuestions) {
            const newQuestion = new Question({
                quizId: createdQuiz._id, // Assign the quizId here
                questionText: qData.questionText,
                options: qData.options,
                correctAnswer: qData.correctAnswer,
            });
            const savedQuestion = await newQuestion.save({ session });
            questionIds.push(savedQuestion._id);
        }

        // 3. Update the quiz document with the references to the new questions
        createdQuiz.questions = questionIds;
        await createdQuiz.save({ session }); // Save the quiz again with question references

        await session.commitTransaction(); // Commit the transaction
        session.endSession();

        // Populate questions for the response
        const populatedQuiz = await Quiz.findById(createdQuiz._id).populate('questions');
        res.status(201).json(populatedQuiz);

    } catch (error) {
        await session.abortTransaction(); // Abort transaction on error
        session.endSession();
        console.error("Error creating quiz with questions:", error);
        next(error);
    }
};

// @desc    Update a quiz
// @route   PUT /api/quizzes/:id
// @access  Private/Admin
const updateQuiz = async (req, res, next) => {
    const { title, description, category, duration, questions: incomingQuestions } = req.body; // Incoming questions are full objects

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const quiz = await Quiz.findById(req.params.id).session(session);

        if (!quiz) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Check authorization
        if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ message: 'Not authorized to update this quiz' });
        }

        // Get existing question IDs for this quiz
        const existingQuestionIds = quiz.questions.map(qId => qId.toString());
        const incomingQuestionIds = []; // To store IDs of questions that will be linked to the quiz

        // Process incoming questions: add new, update existing, identify removed
        const questionsToUpdate = [];
        const questionsToCreate = [];

        incomingQuestions.forEach(qData => {
            if (qData._id && existingQuestionIds.includes(qData._id)) {
                // Existing question, mark for update
                questionsToUpdate.push(qData);
                incomingQuestionIds.push(qData._id);
            } else {
                // New question, mark for creation
                questionsToCreate.push(qData);
            }
        });

        // 1. Delete questions that are no longer in incomingQuestions
        const questionsToDeleteIds = existingQuestionIds.filter(qId => !incomingQuestionIds.includes(qId));
        if (questionsToDeleteIds.length > 0) {
            await Question.deleteMany({ _id: { $in: questionsToDeleteIds }, quizId: quiz._id }, { session });
        }

        // 2. Create new questions
        const newQuestionRefs = [];
        for (const qData of questionsToCreate) {
            const newQuestion = new Question({
                quizId: quiz._id, // Assign quizId for new questions
                questionText: qData.questionText,
                options: qData.options,
                correctAnswer: qData.correctAnswer,
            });
            const savedQuestion = await newQuestion.save({ session });
            newQuestionRefs.push(savedQuestion._id);
        }

        // 3. Update existing questions
        for (const qData of questionsToUpdate) {
            await Question.findByIdAndUpdate(qData._id, {
                questionText: qData.questionText,
                options: qData.options,
                correctAnswer: qData.correctAnswer,
            }, { session });
        }

        // 4. Update the quiz document itself with the new set of question references
        quiz.title = title || quiz.title;
        quiz.description = description || quiz.description;
        quiz.category = category || quiz.category;
        quiz.duration = duration || quiz.duration;
        quiz.questions = [...incomingQuestionIds, ...newQuestionRefs]; // Combine existing and new refs

        const updatedQuiz = await quiz.save({ session });

        await session.commitTransaction();
        session.endSession();

        // Populate questions for the response
        const populatedQuiz = await Quiz.findById(updatedQuiz._id).populate('questions');
        res.json(populatedQuiz);

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error updating quiz with questions:", error);
        next(error);
    }
};

// @desc    Delete a quiz
// @route   DELETE /api/quizzes/:id
// @access  Private/Admin
const deleteQuiz = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const quiz = await Quiz.findById(req.params.id).session(session);

        if (!quiz) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Check if user is the creator or an admin
        if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ message: 'Not authorized to delete this quiz' });
        }

        // --- NEW LOGIC: Delete all associated questions first ---
        const deleteQuestions = await Question.deleteMany({ quizId: req.params.id }, { session });
        console.log(`Deleted ${deleteQuestions.deletedCount} questions for quiz ID: ${req.params.id}`);
        // --- END NEW LOGIC ---

        // Delete all associated results for this quiz
        const deleteResults = await Result.deleteMany({ quizId: req.params.id }, { session });
        console.log(`Deleted ${deleteResults.deletedCount} results for quiz ID: ${req.params.id}`);

        // Now, delete the quiz itself
        await quiz.deleteOne({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Quiz, associated questions, and results removed successfully' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error deleting quiz, questions, or results:", error);
        next(error);
    }
};

module.exports = {
    getQuizzes,
    getQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
};
