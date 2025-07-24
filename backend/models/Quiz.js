// backend/models/Quiz.js

const mongoose = require('mongoose');

const quizSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
    },
    duration: { // in minutes
        type: Number,
        required: [true, 'Please add a duration'],
        min: [1, 'Duration must be at least 1 minute'],
    },
    // --- MAJOR CHANGE HERE: Questions now store ObjectId references ---
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question' // This explicitly links to the 'Question' model/collection
        }
    ],
    // --- END MAJOR CHANGE ---
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Export model, checking if it already exists to prevent OverwriteModelError
module.exports = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);
