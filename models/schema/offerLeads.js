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
    isPolicyAccept:{
        type : Boolean,
    },
    offerId: {
        type: String,
        required: true,
        ref: "offer"
    },
});

const OfferLead = mongoose.model('OfferLead', offerLeadsSchema);

export default OfferLead;
