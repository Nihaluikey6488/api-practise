import mongoose from "mongoose";
import { env } from "./env.js";



export const connectDb = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("MongoDb connected successfully");
  } catch (error) {
    console.log("Error in connecting mongo", error);
  }
};
