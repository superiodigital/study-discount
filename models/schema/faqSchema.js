import mongoose from 'mongoose';

// Define the FAQ Schema
const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true,
    },
    answer: {
        type: String,
        required: true,
    },
    category: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Create and export the FAQ model
const FAQ = mongoose.model('FAQ', faqSchema);

export default FAQ;
