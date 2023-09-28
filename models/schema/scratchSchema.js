import mongoose from 'mongoose';

const scratchCardSchema = new mongoose.Schema({
    image: {
        type: String, // Assuming you will store the image URL or file path as a string
        required: true,
    },
    winMessage: {
        type: String,
        required: true,
    },
});

const ScratchCard = mongoose.model('ScratchCard', scratchCardSchema);

export default ScratchCard;
