import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  phone: {
    type: String,
  },
  scratchCardArray: [{
    giftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ScratchCard' // Replace 'Gift' with the actual name of your Gift model
    },
    offerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'offer' // Replace 'Offer' with the actual name of your Offer model
    },
  }]
});

const User = mongoose.model("User", userSchema);

export default User;
