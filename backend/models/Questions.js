// backend/models/Question.js

const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    quizId: { // This links the question back to its parent quiz
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    questionText: {
        type: String,
        required: true,
    },
    options: {
        type: [String],
        required: true,
        validate: {
            validator: function (v) {
                return v && v.length >= 2; // At least two options
            },
            message: 'A question must have at least two options.'
        }
    },
    correctAnswer: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Export model, checking if it already exists to prevent OverwriteModelError
module.exports = mongoose.models.Question || mongoose.model('Question', questionSchema);
