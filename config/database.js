import mongoose from "mongoose";

// function for connect mongodb using Mongoose
export const connectDb = () => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("database connected"))
    .catch((err) => console.log("database error", err));
};
