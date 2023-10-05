import mongoose from 'mongoose';

const offerLeadsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    isPolicyAccept: {
        type: Boolean,
    },
    isBlocked: {
        type: Boolean,
        default: true,
    },
    offerId: {
        type: String,
        required: true,
        ref: "offer"
    },
    gifts: {
        type: Array,
        ref: 'ScratchCard',
        default: []
    }
});

const OfferLead = mongoose.model('OfferLead', offerLeadsSchema);

export default OfferLead;
