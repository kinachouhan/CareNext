import Wishlist from "../models/wishlist.js";

// Get user wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    let wishlist = await Wishlist.findOne({ user: userId }).populate("products");

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add or Toggle Product in Wishlist
export const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [productId] });
    } else {
      const index = wishlist.products.indexOf(productId);
      if (index > -1) {
        // Remove if already exists
        wishlist.products.splice(index, 1);
      } else {
        // Add if not exists
        wishlist.products.push(productId);
      }
      await wishlist.save();
    }

    const updatedWishlist = await Wishlist.findOne({ user: userId }).populate("products");
    res.status(200).json({ success: true, wishlist: updatedWishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    // Set the products array to an empty array
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: userId },
      { $set: { products: [] } },
      { new: true }
    );
    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};