import { Request } from "express";
import { Trycatch } from "../middlewares/error.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.js";
import { invalidatescache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
import { mycache } from "../app.js";

export const newOrder= Trycatch(async(req:Request<{},{},NewOrderRequestBody>,res,next)=>{
    const{shippingInfo,
        orderItems,
        tax,
        total,
        shippingCharges,
        subtotal,
        user,
        discount}= req.body;
      if(!shippingInfo|| !orderItems|| ! tax ||! total ||! subtotal || !user)
return next( new ErrorHandler("Please enter all fields",400));
   const order= await Order.create({
        shippingInfo,
        orderItems,
        tax,
        total,
        shippingCharges,
        subtotal,
        user,
        discount
    });
   await reduceStock(orderItems);
  invalidatescache({product:true,order:true,admin:true, userId:user,productId:order.orderItems.map(i=>String(i.productId))});
  return res.status(201).json({
    success: true,
    message:"Order Placed",
  })
});
export const MyOrder= Trycatch(async(req:Request<{},{},NewOrderRequestBody>,res,next)=>{
    const{id:user}=req.query;
    let order=[];
    if(mycache.has(`my-orders-${user}`)) order= JSON.parse(mycache.get(`my-orders-${user}`) as string);
    else{
      order= await Order.find({user})
      mycache.set(`my-orders-${user}`, JSON.stringify(order))
    }
  return res.status(201).json({
    success: true,
    order,
  })
});
export const allOrder= Trycatch(async(req:Request<{},{},NewOrderRequestBody>,res,next)=>{
    let order=[];
    if(mycache.has(`all-orders`)) order= JSON.parse(mycache.get(`all-orders`) as string);
    else{
      order= await Order.find().populate("user","name");
      mycache.set(`all-orders`, JSON.stringify(order))
    }
  return res.status(200).json({
    success: true,
    order,
  })
});
export const getOrderDetails= Trycatch(async(req,res,next)=>{
  const{id}=req.params;
  const key= `order-${id}`;
    let order;
    if(mycache.has(key)) order= JSON.parse(mycache.get(key) as string);
    else{
      order= await Order.findById(id).populate("user","name");
      if(!order) return next(new ErrorHandler("Order not found",404))
      mycache.set(key, JSON.stringify(order))
    }
  return res.status(200).json({
    success: true,
    order,
  })
});

export const processOrder= Trycatch(async(req,res,next)=>{
  const{id}= req.params;
  const order= await Order.findById(id);
  if(!order) return next(new ErrorHandler("Order not found",404));
  switch (order.status) {
    case "Processing": order.status= "Shipped";
      break;
    case "Shipped": order.status= "Delivered";
      break;
    default: order.status= "Delivered";
      break;
  }
  await order.save();
  invalidatescache({product:false,order:true,admin:true,userId:order.user,orderId:String(order._id)});
  return res.status(200).json({
  success: true,
  message:"Order Processed",
})
});
export const deleteOrder= Trycatch(async(req,res,next)=>{
  const{id}= req.params;
  const order= await Order.findById(id);
  if(!order) return next(new ErrorHandler("Order not found",404));
  
  await order.deleteOne();
invalidatescache({product:false,order:true,admin:true,userId:order.user,orderId:String(order._id)});
return res.status(200).json({
  success: true,
  message:"Order deleted",
})
});
