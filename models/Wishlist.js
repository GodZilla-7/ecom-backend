// models/Wishlist.js
import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  items: [
    {
      productId: { type: String, required: true }, // Change from ObjectId to String
      addedAt: { type: Date, default: Date.now },
    },
  ],
});

const Wishlist = mongoose.model("Wishlist", WishlistSchema);
export default Wishlist;
