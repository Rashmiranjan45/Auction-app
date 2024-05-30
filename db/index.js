import mongoose from "mongoose";

const connectDB = async() => {
    try {
        mongoose.connect(`${process.env.MONGODB_URI}/auction`)
        console.log("MONGODB CONNECTED");
    } catch (error) {
        console.log("MONGODB CONNECTION FAILED :: ERROR :: ",error)
    }
}

export default connectDB