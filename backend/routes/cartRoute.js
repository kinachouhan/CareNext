import express from "express";

import {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getCart);

router.post("/", addToCart);

router.put("/:productId", updateCart);

router.delete("/:productId", removeFromCart);

router.delete("/", clearCart);

export default router;

