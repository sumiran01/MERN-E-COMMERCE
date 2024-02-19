import express from "express";
import { connectDB } from "./utils/features.js";
import Stripe from "stripe";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import { config } from "dotenv";
import morgan from "morgan";
import NodeCache from "node-cache";
// Importing Routes
import userRoutes from './Routes/user.js';
import productRoutes from './Routes/products.js';
import orderRoutes from './Routes/orders.js';
import paymentRoutes from './Routes/payment.js';
import dashboardRoutes from './Routes/stats.js';
config({
    path: "./.env"
});
const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || "";
const stripeKey = process.env.STRIPE_KEY || "";
connectDB(mongoURI);
export const stripe = new Stripe(stripeKey);
export const mycache = new NodeCache();
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({}));
app.get("/", (req, res) => {
    res.send("API working with /api/v1");
});
// Using Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);
app.listen(port, () => {
    console.log(`Express is working on http://localhost:${port}`);
});
