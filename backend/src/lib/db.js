import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
export const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected");
    }
    catch(error){
        console.log("MongoDB connection failed");
        console.log(error);
        process.exit(1); // Exit process with failure
    }
}