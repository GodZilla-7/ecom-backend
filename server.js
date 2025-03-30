import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import wishlistRoutes from "./routes/wishlistRoutes.js";

dotenv.config();

const app = express();
app.get("/", (req, res) => {
  res.send("Hello from server!");
});
// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://ecom-taupe-tau.vercel.app"],
    credentials: true,
  })
);

app.use(bodyParser.json());

// Routes
app.use("/api", wishlistRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
