import express from "express";
import upload from "../middleware/upload.js";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProducts);
router.post("/add", upload.single("image"), addProduct);
router.get("/:id", getSingleProduct);
router.put(
  "/:id",
  upload.single("image"),
  updateProduct
)
router.delete("/:id", deleteProduct);

export default router;