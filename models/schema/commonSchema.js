// models/banner.js
import mongoose from 'mongoose';

const commonSchema = new mongoose.Schema({
    scratchCard: {
        type: Boolean
    },
});

const CommonSettings = mongoose.model('CommonSettings', commonSchema);

export default CommonSettings;
