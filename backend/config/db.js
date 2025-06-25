import mongoose from "mongoose";

const connectDb = async()=>{
    try {
        mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connected");
    } catch (error) {
        console.log("Database not connected");
        console.log(error);        
    }
}

export default connectDb;