import mongoose from 'mongoose';

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn("⚠️ MONGODB_URI not set. Operating in high-performance JSON Fallback mode.");
    return false;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`🔌 MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn("⚠️ Falling back to local JSON database mode.");
    return false;
  }
};

export default connectDB;
