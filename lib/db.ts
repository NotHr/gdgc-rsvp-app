import mongoose from "mongoose";

// Connect to DB
const connectDB = async () => {
  // Check for an existing connection
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const mongoURL = process.env.DB_URL as string;

  if (!mongoURL) {
    throw new Error("[ENV_ERROR]: MONGO_URL NOT MENTIONED");
  }

  try {
    await mongoose.connect(mongoURL);
  } catch (error) {
    console.error("[DB_ERROR]: ", error);
  }
};

export default connectDB;
