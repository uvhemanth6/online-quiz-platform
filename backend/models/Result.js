const mongoose = require('mongoose');

const resultSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    quizTitle: {
        type: String, // Storing quiz title denormalized for easier display
        required: true,
    },
    score: {
        type: Number,
        required: true,
        min: 0,
    },
    totalQuestions: {
        type: Number,
        required: true,
        min: 1,
    },
    userAnswers: {
        type: Object, // Stores { questionIndex: "selectedOption" }
        default: {},
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
});

// Export model, checking if it already exists to prevent OverwriteModelError
module.exports = mongoose.models.Result || mongoose.model('Result', resultSchema);