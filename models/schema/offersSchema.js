import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  longDescription: {
    type: String,
  },
  shortDescription: {
    type: String,
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
  },
  expiresTo: {
    type: Date,
  },
  offerImage: {
    type: String,
  },
});

const Offer = mongoose.model('offer', offerSchema);

export default Offer;
