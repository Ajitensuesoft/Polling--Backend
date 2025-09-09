
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const url=process.env.MONGODB_URL as string;

export const connectDb=()=>{
    try{
           mongoose.connect(url);
           console.log("connection successfully");
    }
    catch(err:any){
             console.log("error while connection mongodb",err);
    }
}