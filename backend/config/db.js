import mongoose from 'mongoose';

const connectDB = async () => {
  if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('your_username')) {
    console.warn("⚠️ MONGODB_URI not set or is mock. Operating in high-performance JSON Fallback mode.");
    delete process.env.MONGODB_URI;
    return false;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000 // Timeout fast if DB offline
    });
    console.log(`🔌 MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn("⚠️ Falling back to local JSON database mode.");
    delete process.env.MONGODB_URI; // Clear key so controllers fall back instantly
    return false;
  }
};

export default connectDB;
