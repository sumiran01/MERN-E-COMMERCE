import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { MyOrder, allOrder, deleteOrder, getOrderDetails, newOrder, processOrder } from "../controllers/order.js";

const app =  express.Router();
// route-/api/v1/user/new
app.post("/new", newOrder);
app.get("/my", MyOrder);
app.get("/all",adminOnly, allOrder);
app.route("/:id").get(getOrderDetails).put(adminOnly,processOrder).delete( adminOnly,deleteOrder);
export default app;