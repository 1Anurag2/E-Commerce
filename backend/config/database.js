import mongoose from "mongoose";
import dotenv from "dotenv";

// ✅ Load environment variables
dotenv.config({ path: "./config/.env" });

const connectDB = async () => {
  try {
    // ✅ Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Stop app if DB fails
  }
};

export default connectDB;
