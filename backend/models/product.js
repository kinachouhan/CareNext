import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
    },

    subCategory: {
      type: String
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: 0,
    },

    unit: {
      type: String,
      enum: [
    "Kg", "Gram","Litre", "ml","Piece", "Packet", "Box",],
      default: "piece",
    },

    shortDescription: {
      type: String,
      required: [true, "Short Description is required"],
      trim: true,
    },

    fullDescription: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
      required: [true, "Product image is required"],
    },

    featured: {
      type: Boolean,
      default: false,
    },

    bestSeller: {
      type: Boolean,
      default: false,
    },

    newArrival: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;