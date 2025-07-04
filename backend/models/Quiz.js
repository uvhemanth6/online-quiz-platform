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
    questions: [
        {
            questionText: {
                type: String,
                required: [true, 'Please add question text'],
            },
            options: {
                type: [String],
                required: [true, 'Please add options'],
                validate: {
                    validator: function (v) {
                        return v && v.length >= 2;
                    },
                    message: 'Each question must have at least two options.'
                }
            },
            correctAnswer: {
                type: String,
                required: [true, 'Please specify the correct answer'],
            },
        }
    ],
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
