import { stripe } from "../app.js";
import { Trycatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupons.js";
import ErrorHandler from "../utils/utility-class.js";
export const createPaymentIntent = Trycatch(async (req, res, next) => {
    const { amount } = req.body;
    if (!amount)
        return next(new ErrorHandler("Please enter amount", 400));
    const paymentintent = await stripe.paymentIntents.create({ amount: Number(amount) * 100, currency: "INR" });
    return res.status(201).json({
        success: true,
        clientSecret: paymentintent.client_secret,
    });
});
export const newCoupon = Trycatch(async (req, res, next) => {
    const { coupon, amount } = req.body;
    if (!coupon || !amount)
        return next(new ErrorHandler("Please enter both coupon and amount", 400));
    await Coupon.create({ code: coupon, amount });
    return res.status(201).json({
        success: true,
        message: `Coupon ${coupon} created`,
    });
});
export const applyDiscount = Trycatch(async (req, res, next) => {
    const { coupon } = req.query;
    const discount = await Coupon.findOne({ code: coupon });
    if (!discount)
        return next(new ErrorHandler("Invalid coupon code", 400));
    return res.status(200).json({
        success: true,
        discount: discount.amount,
    });
});
export const allCoupons = Trycatch(async (req, res, next) => {
    const coupons = await Coupon.find({});
    return res.status(200).json({
        success: true,
        coupons,
    });
});
export const deleteCoupon = Trycatch(async (req, res, next) => {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon)
        return next(new ErrorHandler("Invalid coupon Id", 400));
    return res.status(200).json({
        success: true,
        message: `Coupon ${coupon.code} Deleted`,
    });
});
