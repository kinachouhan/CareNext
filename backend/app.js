import express from "express";
import cors from "cors";
import productRoute from "./routes/productRoute.js";
import authRoute from "./routes/authRoute.js"
import cartRoutes from "./routes/cartRoute.js"
import cookieParser from "cookie-parser";
import wishlistRoutes from "./routes/wishlistRoute.js";
import addressRoute from "./routes/addressRoute.js"
import orderRoute from "./routes/orderRoute.js"

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/addresses", addressRoute)
app.use("/api/orders", orderRoute)

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend Running Successfully 🚀",
  });
});



export default app;