import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import wishlistRoutes from "./routes/wishlistRoutes.js";

dotenv.config();

const app = express();

// ✅ Improved CORS for Performance
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Faster JSON Parsing (Express Built-in)
app.use(express.json({ limit: "10kb" })); // Smaller limit for efficiency

// ✅ Optimized MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10, // 🔥 Use Connection Pooling
      serverSelectionTimeoutMS: 5000, // ⏳ Reduce MongoDB timeout
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Exit on DB failure
  }
};

// ✅ API Routes
app.use("/api", wishlistRoutes);

// ✅ Health Check Route (Useful for Vercel)
app.get("/", (req, res) => res.send("🔥 Server is Running!"));

// ✅ Start Server After DB Connection
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
