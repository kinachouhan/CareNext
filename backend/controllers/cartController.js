import Cart from "../models/Cart.js";

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      user: req.user._id, // Fixed from req.user.id
    }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id, // Fixed from req.user.id
        items: [],
      });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({
      user: req.user._id, // Fixed from req.user.id
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id, // Fixed from req.user.id
        items: [],
      });
    }

    const existing = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    await cart.save();
    await cart.populate("items.product");

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { quantity } = req.body;

    const cart = await Cart.findOne({
      user: req.user._id, // Fixed from req.user.id
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) =>
        item.product.toString() === req.params.productId
    );

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    item.quantity = quantity;

    await cart.save();
    await cart.populate("items.product");

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id, // Fixed from req.user.id
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) =>
        item.product.toString() !== req.params.productId
    );

    await cart.save();
    await cart.populate("items.product");

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id, // Fixed from req.user.id
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};