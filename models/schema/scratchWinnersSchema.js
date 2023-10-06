import mongoose from 'mongoose';

const scratchWinnerSchema = new mongoose.Schema({
    winMessage: {
        type: String,
        required: true,
    },
    giftId: {
        type: String,
        ref: 'ScratchCard'
    },
    userId: {
        type: String,
        ref: 'User'
    },
    offerId: {
        type: String,
        ref: 'offer'
    },
    giftName: String,
    priority: Number,
});

const ScratchWinner = mongoose.model('ScratchWinner', scratchWinnerSchema);

export default ScratchWinner;
