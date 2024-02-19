import mongoose from "mongoose";
import { mycache } from "../app.js";
import { Product } from "../models/product.js";
export const connectDB = (uri) => {
    mongoose.connect(uri, {
        dbName: "sumi_e-commerce",
    }).then(c => console.log(`DB connected to ${c.connection.host}`)).
        catch((e) => console.log(e));
};
export const invalidatescache = ({ product, order, admin, userId, orderId, productId }) => {
    if (product) {
        const productKeys = ["all-products", "categories", "latest-product"];
        if (typeof productId === "string")
            productKeys.push(`product-${productId}`);
        if (typeof productId === "object")
            productId.forEach((i) => productKeys.push(`product-${i}`));
        mycache.del(productKeys);
    }
    if (order) {
        const orderkeys = ["all-orders", `my-orders-${userId}`, `order-${orderId}`];
        mycache.del(orderkeys);
    }
    if (admin) {
        mycache.del(["admin-stats", "admin-pie-charts", "admin-bar-charts", "admin-line-charts"]);
    }
};
export const reduceStock = async (orderitems) => {
    for (let i = 0; i < orderitems.length; i++) {
        const order = orderitems[i];
        const product = await Product.findById(order.productId);
        if (!product)
            throw new Error("pro nt  fnd");
        product.stock -= order.quantity;
        await product.save();
    }
};
export const calculatePercentage = (ThisMonth, LastMonth) => {
    if (LastMonth === 0)
        return ThisMonth * 100;
    const percent = (ThisMonth / LastMonth) * 100;
    return Number(percent.toFixed(0));
};
export const getInventories = async ({ categories, productCount }) => {
    const categoriesCountPromise = categories.map(category => Product.countDocuments({ category }));
    const categoriesCount = await Promise.all(categoriesCountPromise);
    const categoryCount = [];
    categories.forEach((category, i) => {
        categoryCount.push({
            [category]: Math.round((categoriesCount[i] / productCount) * 100),
        });
    });
    return categoryCount;
};
export const getChartdata = ({ length, docArr, property }) => {
    const today = new Date();
    const data = new Array(length).fill(0);
    docArr.forEach((i) => {
        const creationDate = i.createdAt;
        const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDiff < length) {
            data[length - monthDiff - 1] += property ? i[property] : 1;
        }
    });
    return data;
};
