import express from "express";
import mongoose from "mongoose";
import Wishlist from "../models/Wishlist.js";

const router = express.Router();





router.get("/wishlist/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      console.log("Fetching wishlist for user:", userId);
      
      const wishlistDoc = await Wishlist.findOne({ userId }).lean();
      if (!wishlistDoc) {
        return res.json({ userId, items: [] });
      }
  
      // Convert productId to string for each item (keep the same key)
      const itemsWithConvertedIds = wishlistDoc.items.map((item) => ({
        ...item,
        productId: item.productId.toString(),
      }));
  
      res.json({
        ...wishlistDoc,
        items: itemsWithConvertedIds,
      });
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      res.status(500).json({ error: error.message });
    }
  });

  router.post("/wishlist", async (req, res) => {
    const { userId, productId } = req.body;
    try {
      let wishlist = await Wishlist.findOne({ userId });
      if (!wishlist) {
        wishlist = new Wishlist({ userId, items: [{ productId }] });
      } else {
        const isAlreadyInWishlist = wishlist.items.some(
          (item) => item.productId === productId
        );
        if (!isAlreadyInWishlist) {
          wishlist.items.push({ productId });
        }
      }
      await wishlist.save();
      res.status(200).json({ message: "Item added to wishlist", wishlist });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      res.status(500).json({ error: error.message });
    }
  });


  router.delete("/wishlist", async (req, res) => {
    const { userId, productId } = req.body;
  
    try {
      let wishlist = await Wishlist.findOne({ userId });
      if (!wishlist) {
        return res.status(404).json({ error: "Wishlist not found" });
      }
  
      // Remove item and save changes
      const initialLength = wishlist.items.length;
      wishlist.items = wishlist.items.filter(
        (item) => String(item.productId).trim() !== String(productId).trim()
      );
  
      if (wishlist.items.length === initialLength) {
        return res.status(404).json({ error: "Item not found in wishlist" });
      }
  
      await wishlist.save();
      res.status(200).json({ message: "Item removed from wishlist", wishlist });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      res.status(500).json({ error: error.message });
    }
  });
  
  
  
export default router;
