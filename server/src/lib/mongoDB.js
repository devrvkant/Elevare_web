import mongoose from "mongoose";

import {config} from "../config/env.js";

const connectToMongoDB = async () => {
  try {
    const DB_URI = config.mongoDbUri;
    if (!DB_URI)
      throw new Error("MONGODB_URI is not defined in environment variables");

    await mongoose.connect(DB_URI);

    console.log("MongoDB connected!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
};

export default connectToMongoDB;
