const express = require('express');
const { getQuestionsByQuiz, createQuestion, updateQuestion, deleteQuestion } = require('../controllers/questionController');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

router.route('/')
    .post(protect, authorize('admin'), createQuestion); // Only admins can add questions

router.route('/quiz/:quizId')
    .get(getQuestionsByQuiz); // Publicly accessible

router.route('/:id')
    .put(protect, authorize('admin'), updateQuestion) // Only admins can update
    .delete(protect, authorize('admin'), deleteQuestion); // Only admins can delete

module.exports = router;