import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  longDescription: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  realPrice: {
    type: Number,
  },
  offerPrice: {
    type: Number,
  },
  offerPercent: {
    type: Number,
  },
  expiresFrom: {
    type: Date,
    required: true,
  },
  expiresTo: {
    type: Date,
    required: true,
  },
  offerImage: {
    type: String,
    required: true,
  },
});

const Offer = mongoose.model('Offer', offerSchema);

export default Offer;
