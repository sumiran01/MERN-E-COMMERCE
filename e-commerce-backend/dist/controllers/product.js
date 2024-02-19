import { Trycatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { mycache } from "../app.js";
import { invalidatescache } from "../utils/features.js";
export const newProduct = Trycatch(async (req, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    if (!photo)
        return next(new ErrorHandler("Please add photo", 400));
    if (!name || !price || !stock || !category) {
        rm(photo.path, () => {
            console.log("Deleted");
        });
        return next(new ErrorHandler("Please enter all fields", 400));
    }
    await Product.create({
        name,
        price,
        stock,
        category: category.toLowerCase(),
        photo: photo.path,
    });
    invalidatescache({ product: true, admin: true });
    return res.status(201).json({
        success: true,
        message: "Product created",
    });
});
export const getLatestProducts = Trycatch(async (req, res, next) => {
    let products = [];
    if (mycache.has("latest-product"))
        products = JSON.parse(mycache.get("latest-product"));
    else {
        products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
        mycache.set("latest-product", JSON.stringify(products));
    }
    return res.status(200).json({
        success: true,
        products,
    });
});
export const getAllCategories = Trycatch(async (req, res, next) => {
    let categories;
    if (mycache.has("categories"))
        categories = JSON.parse(mycache.get("categories"));
    else {
        categories = await Product.distinct("category");
        mycache.set("categories", JSON.stringify(categories));
    }
    return res.status(200).json({
        success: true,
        categories,
    });
});
export const getAdminProducts = Trycatch(async (req, res, next) => {
    let products;
    if (mycache.has("all-products"))
        products = JSON.parse(mycache.get("all-products"));
    else {
        products = await Product.find({});
        mycache.set("all-products", JSON.stringify(products));
    }
    return res.status(200).json({
        success: true,
        products,
    });
});
export const getSingleProducts = Trycatch(async (req, res, next) => {
    let product;
    const id = req.params.id;
    if (mycache.has(`product-${id}`))
        product = JSON.parse(mycache.get(`product-${id}`));
    else {
        product = await Product.findById(id);
        if (!product)
            return next(new ErrorHandler("product not found", 404));
        mycache.set(`product-${id}`, JSON.stringify(product));
    }
    return res.status(200).json({
        success: true,
        product,
    });
});
export const updateProduct = Trycatch(async (req, res, next) => {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);
    if (!product)
        return next(new ErrorHandler("product not found", 404));
    if (photo) {
        rm(product.photo, () => {
            console.log(" Old photo Deleted");
        });
        product.photo = photo.path;
    }
    if (name)
        product.name = name;
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    if (category)
        product.category = category;
    await product.save();
    invalidatescache({ product: true, productId: String(product._id), admin: true });
    return res.status(201).json({
        success: true,
        message: "Product updated",
    });
});
export const deleteProduct = Trycatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product)
        return next(new ErrorHandler("product not found", 404));
    rm(product.photo, () => {
        console.log(" product photo Deleted");
    });
    await product.deleteOne();
    invalidatescache({ product: true, productId: String(product._id), admin: true });
    return res.status(200).json({
        success: true,
        message: "Product deleted",
    });
});
export const getAllProducts = Trycatch(async (req, res, next) => {
    const { search, price, category, sort } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = limit * (page - 1);
    const baseQuery = {};
    if (search)
        baseQuery.name = {
            $regex: search,
            $options: "i",
        };
    if (price)
        baseQuery.price = { $lte: Number(price) };
    if (category)
        baseQuery.category = category;
    const [products, allProducts] = await Promise.all([Product.find(baseQuery)
            .sort(sort && { price: sort === "asc" ? 1 : -1 })
            .limit(limit)
            .skip(skip), Product.find(baseQuery)
    ]);
    const TotalPage = Math.ceil(allProducts.length / limit);
    return res.status(200).json({
        success: true,
        products,
        TotalPage,
    });
});
