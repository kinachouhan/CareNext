import Product from "../models/Product.js";

// @desc    Create new review
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (!product.reviews) product.reviews = [];

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: "Product already reviewed" });
    }

    const review = {
      user: req.user._id,
      name: req.user.fullName || "User",
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      reviews: product.reviews,
      ratings: product.ratings,
      numReviews: product.numReviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update existing review
export const updateProductReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const { rating, comment } = req.body;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const review = product.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to update this review" });
    }

    if (rating) review.rating = Number(rating);
    if (comment) review.comment = comment;

    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      reviews: product.reviews,
      ratings: product.ratings,
      numReviews: product.numReviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete review
export const deleteProductReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Filter out the review
    product.reviews = product.reviews.filter((r) => r._id.toString() !== reviewId);
    product.numReviews = product.reviews.length;

    if (product.numReviews > 0) {
      product.ratings =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
    } else {
      product.ratings = 0;
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      reviews: product.reviews,
      ratings: product.ratings,
      numReviews: product.numReviews,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};