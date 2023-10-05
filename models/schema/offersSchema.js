import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  slug: {
    type: String,
    unique: true,
  },
  category: {
    type: String,
    ref: 'Category',
  },
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
    type: String,
  },
  expiresFrom: {
    type: Date,
  },
  viewedCount: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
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
