import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { getBarcharts, getDashboardstats, getLinecharts, getPiecharts } from "../controllers/stats.js";
const app = express.Router();
// route-/api/v1/dashboard/stats
app.get("/stats", adminOnly, getDashboardstats);
// route-/api/v1/dashboard/pie
app.get("/pie", adminOnly, getPiecharts);
// route-/api/v1/dashboard/bar
app.get("/bar", adminOnly, getBarcharts);
// route-/api/v1/dashboard/line
app.get("/line", adminOnly, getLinecharts);
export default app;
