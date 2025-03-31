import mongoose from "mongoose"

export const connectDB = async () => {
    console.log(process.env.MONGODB_URI);
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/emailVerification", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB connected ....`);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);    
        }};