import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { deleteProduct, getAdminProducts, getAllCategories, getAllProducts, getLatestProducts, getSingleProducts, newProduct, updateProduct } from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";
const app = express.Router();
//  create new product- api/v1/product/new
app.post("/new", adminOnly, singleUpload, newProduct);
app.get("/all", getAllProducts);
app.get("/latest", getLatestProducts);
app.get("/categories", getAllCategories);
app.get("/admin-products", adminOnly, getAdminProducts);
app.route("/:id").get(getSingleProducts).put(adminOnly, singleUpload, updateProduct).delete(adminOnly, deleteProduct);
export default app;
