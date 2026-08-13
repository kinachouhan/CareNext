import express from "express";

import {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  updateProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", protect , getMe)

router.post("/logout", logoutUser)

router.put("/update-profile", protect, updateProfile);

export default router;