const express = require('express');
const { getQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/authorize'); // Role-based access control

const router = express.Router();

router.route('/')
    .get(getQuizzes) // Publicly accessible to view quizzes
    .post(protect, authorize('admin'), createQuiz); // Only admins can create

router.route('/:id')
    .get(getQuizById) // Publicly accessible to view a single quiz
    .put(protect, authorize('admin'), updateQuiz) // Only admins (or quiz creator) can update
    .delete(protect, authorize('admin'), deleteQuiz); // Only admins (or quiz creator) can delete

module.exports = router;