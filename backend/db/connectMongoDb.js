import mongoose from "mongoose";

export const connectMongoDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default connectMongoDb;