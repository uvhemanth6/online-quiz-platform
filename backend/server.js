// backend/server.js
// Main entry point for the Express server

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // Database connection utility

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for development. In production, specify your frontend origin.
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json()); // For parsing application/json

// Import Routes
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const questionRoutes = require('./routes/questionRoutes'); // This will likely be unused if questions are embedded directly in Quiz schema
const resultRoutes = require('./routes/resultRoutes');
const errorHandler = require('./middleware/errorHandler'); // Custom error handling middleware

// Route Middlewares
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/questions', questionRoutes); // For standalone question management if desired, otherwise nested under quizzes.
app.use('/api/results', resultRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Online Quiz Platform API is running...');
});

// Catch-all for 404 Not Found
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));