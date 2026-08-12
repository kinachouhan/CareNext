import express from "express";
import { getAddresses, addAddress, deleteAddress, updateAddress } from "../controllers/addressController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAddresses);
router.post("/", protect, addAddress);
router.delete("/:id", protect, deleteAddress)
router.put("/:id", protect, updateAddress)

export default router;