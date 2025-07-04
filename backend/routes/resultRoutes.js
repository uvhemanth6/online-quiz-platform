const express = require('express');
const { submitResult, getMyResults, getAllResults, getResultById } = require('../controllers/resultController');
const { protect } = require('..//middleware/auth');
const authorize = require('..//middleware/authorize');

const router = express.Router();

router.post('/', protect, submitResult); // Any authenticated user can submit a result
router.get('/my-results', protect, getMyResults); // Authenticated user can get their own results
router.get('/all', protect, authorize('admin'), getAllResults); // Only admins can see all results
router.get('/:id', protect, getResultById); // Authenticated user (owner or admin) can get a specific result

module.exports = router;