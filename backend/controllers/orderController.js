import Order from "../models/order.js";
import Cart from "../models/cart.js"; 

// Create / Place Order
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderItems, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order" });
    }

    const order = await Order.create({
      user: userId,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });

    // Clear user cart upon successful order placement
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