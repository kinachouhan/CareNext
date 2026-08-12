import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      addressType: { type: String, default: "Home" },
    },
    paymentMethod: { type: String, required: true }, 
    paymentProof: { type: String, default: "" }, 
    paymentStatus: { type: String, default: "Pending" }, 
    totalAmount: { type: Number, required: true },
    orderStatus: { type: String, default: "Pending" }, 
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);