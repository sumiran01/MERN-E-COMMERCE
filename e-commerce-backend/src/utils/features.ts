import mongoose, { Document } from "mongoose";
import { InvalidateCachepProps, OrderItemType } from "../types/types.js";
import { mycache } from "../app.js";
import { Product } from "../models/product.js";
import { Order } from "../models/order.js";

export const  connectDB=(uri:string)=>{
    mongoose.connect(uri,{
        dbName: "sumi_e-commerce",
    }).then(c=>console.log(`DB connected to ${c.connection.host}`)).
    catch((e)=>console.log(e));
};
export const invalidatescache=({product,order,admin,userId,orderId,productId}:InvalidateCachepProps)=>{
    if(product){
   const productKeys:string[]=["all-products","categories","latest-product"];
   if( typeof productId==="string")productKeys.push(`product-${productId}`);
   if(typeof productId==="object")productId.forEach((i)=>productKeys.push(`product-${i}`))
   mycache.del(productKeys);    
    }
    if(order){
    const orderkeys:string[]=["all-orders",`my-orders-${userId}`,`order-${orderId}`];
    mycache.del(orderkeys);
    }
    if(admin){
   mycache.del(["admin-stats","admin-pie-charts","admin-bar-charts","admin-line-charts"])
    }
};
export const reduceStock= async(orderitems: OrderItemType[])=>{
    for (let i =0 ; i < orderitems.length; i++) {
        const order = orderitems[i];
        const product= await Product.findById(order.productId);
        if(!product) throw new Error("pro nt  fnd");
        product.stock -=order.quantity;
        await product.save();
    }
};

export const calculatePercentage= (ThisMonth:number,LastMonth:number)=>{
    if(LastMonth===0) return ThisMonth*100;
    const percent= (ThisMonth/LastMonth)*100;
    return Number(percent.toFixed(0)); 
};

export const getInventories=async({categories,productCount}:{categories: string[]; productCount:number;})=>{
    const categoriesCountPromise= categories.map(category=>Product.countDocuments({category}));
const categoriesCount= await Promise.all(categoriesCountPromise);
const categoryCount: Record<string,number>[]=[];
categories.forEach((category,i)=>{
  categoryCount.push({
    [category]: Math.round((categoriesCount[i]/productCount)*100),
  });
});
return categoryCount;
};
interface MyDovuments extends Document{
createdAt: Date;
discount?:number;
total?: number;
}
type FuncProps={
    length:number,
 docArr:MyDovuments[],
 property?: "discount"|"total",
}
export const getChartdata=({length,docArr,property}: FuncProps)=>{
    const today= new Date();
    const data: number[]= new Array(length).fill(0);
 docArr.forEach((i)=>{
  const creationDate= i.createdAt;
  const monthDiff=( today.getMonth() - creationDate.getMonth()+12)%12;
  if(monthDiff<length){
 data[length - monthDiff -1] +=property?i[property]!:1;
  }
 });
return data;
}
