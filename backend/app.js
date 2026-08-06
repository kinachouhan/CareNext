import express from "express";
import cors from "cors";
import productRoute from "./routes/productRoute.js";


const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/products", productRoute);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend Running Successfully 🚀",
  });
});



export default app;