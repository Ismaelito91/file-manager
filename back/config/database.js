import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to Mongodb");
  } catch (err) {
    console.log(err);
  }
};
