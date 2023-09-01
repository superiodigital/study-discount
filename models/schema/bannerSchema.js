// models/banner.js
import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  }
});

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;
