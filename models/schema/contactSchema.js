import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    place: String,
    message: {
        type: String,
    }
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
