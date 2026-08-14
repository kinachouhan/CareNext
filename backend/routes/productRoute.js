import express from "express";
import upload from "../middleware/upload.js";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/productController.js";
import { 
  createProductReview, 
  updateProductReview, 
  deleteProductReview 
} from "../controllers/reviewController.js";
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", getAllProducts);
router.post("/add", upload.single("image"), addProduct);
router.get("/:id", getSingleProduct);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

// Review Routes
router.post("/:id/reviews", protect, createProductReview);
router.put("/:id/reviews/:reviewId", protect, updateProductReview);
router.delete("/:id/reviews/:reviewId", protect, deleteProductReview);

export default router;