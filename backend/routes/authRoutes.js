// backend/routes/authRoutes.js
// API routes for authentication

const express = require('express');
const { registerUser, loginUser, getUserProfile, logoutUser } = require('../controllers/authController'); // Import logoutUser
const { protect } = require('../middleware/auth');
const { check } = require('express-validator'); // For input validation

const router = express.Router();

router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    ],
    registerUser
);
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    loginUser
);
router.get('/profile', protect, getUserProfile); // Protected route
router.post('/logout', logoutUser); // New logout route

module.exports = router;
