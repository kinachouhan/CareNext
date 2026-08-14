import Order from "../models/order.js";
import Cart from "../models/cart.js"; 
import Product from "../models/Product.js"; 

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderItems, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order" });
    }

    for (const item of orderItems) {
      const productId = item.product || item.productId;
      const quantity = item.quantity;

      const updatedProduct = await Product.findOneAndUpdate(
        { 
          _id: productId, 
          status: "active",
          stock: { $gte: quantity } 
        },
        { 
          $inc: { stock: -quantity } 
        },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(400).json({ 
          success: false, 
          message: `Product is out of stock, inactive, or has insufficient quantity.` 
        });
      }
    }

    const order = await Order.create({
      user: userId,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });

    await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User Orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get ALL orders (Admin)
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const totalOrders = await Order.countDocuments();
    const orders = await Order.find({})
      .populate("user", "fullName email") 
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      orders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Order Status (Admin)
export const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (orderStatus) {
      order.orderStatus = orderStatus;
      if (orderStatus === "Delivered" && order.paymentMethod === "COD" && order.paymentStatus === "Pending") {
        order.paymentStatus = "Completed";
      }
    }

    const updatedOrder = await order.save();
    res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Payment Status (Admin)
export const updatePaymentStatusAdmin = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, method: "patch" });

    if (paymentStatus) order.paymentStatus = paymentStatus;
    const updatedOrder = await order.save();
    res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel Order (User or Admin) - Restores stock if cancelled
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role; 

    const query = userRole === "admin" ? { _id: id } : { _id: id, user: userId };
    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.orderStatus !== "Pending") {
      return res.status(400).json({ 
        success: false, 
        message: "Order cannot be cancelled because it is already processed, shipped, or delivered." 
      });
    }

    order.orderStatus = "Cancelled";

    if (order.paymentStatus === "Completed") {
      order.paymentStatus = "Refund Initiated";
    } else {
      order.paymentStatus = "Cancelled";
    }

    // Restore product stock back when an order is successfully cancelled
    for (const item of order.orderItems) {
      const productId = item.product || item.productId;
      const quantity = item.quantity;
      await Product.findByIdAndUpdate(productId, { $inc: { stock: quantity } });
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully and stock restored",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};