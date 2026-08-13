import express from "express";
import { placeOrder, getUserOrders, getOrderById, getAllOrdersAdmin, updateOrderStatusAdmin, updatePaymentStatusAdmin, cancelOrder } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/", protect, getUserOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/cancel", protect, cancelOrder);


router.get("/admin/all",  getAllOrdersAdmin);
router.put("/admin/:id/status",  updateOrderStatusAdmin);
router.put("/admin/:id/payment", updatePaymentStatusAdmin);

export default router;