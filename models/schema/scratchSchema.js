import mongoose from 'mongoose';

const scratchCardSchema = new mongoose.Schema({
    image: {
        type: String, // Assuming you will store the image URL or file path as a string
        required: true,
    },
    // name: {
    //     type: String, // Assuming you will store the name
    // },
    winMessage: {
        type: String,
        required: true,
    },
    offerIdArray: {
        type: Array,
        default: []
    }
});

const ScratchCard = mongoose.model('ScratchCard', scratchCardSchema);

export default ScratchCard;
