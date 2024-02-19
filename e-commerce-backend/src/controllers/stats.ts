import { json } from "express";
import { mycache } from "../app.js";
import { Trycatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage, getChartdata, getInventories } from "../utils/features.js";


export const getDashboardstats= Trycatch(async(req,res,next)=>{

    let stats={};
    if(mycache.has("admin-stats")) stats= JSON.parse(mycache.get("admin-stats")as string);
    else{
          const today= new Date();
          const sixMonthago= new Date();
          sixMonthago.setMonth(sixMonthago.getMonth()- 6);
          const ThisMonth= {
            start:new Date(today.getFullYear(),today.getMonth(),1),
            end: today,
          }
          const LastMonth= {
            start:new Date(today.getFullYear(),today.getMonth(),-1,1),
            end:new Date(today.getFullYear(),today.getMonth(),0)
          }
          const thisMonthProductsPromise=  Product.find({
            createdAt:{
                $gte:ThisMonth.start,
                $lte:ThisMonth.end,
            },
          });
          const LastMonthProductsPromise=  Product.find({
            createdAt:{
                $gte:LastMonth.start,
                $lte:LastMonth.end,
            },
          });


          const thisMonthUserPromise=  User.find({
            createdAt:{
                $gte:ThisMonth.start,
                $lte:ThisMonth.end,
            },
          });
          const LastMonthUserPromise=  User.find({
            createdAt:{
                $gte:LastMonth.start,
                $lte:LastMonth.end,
            },
          });

          const thisMonthOrdersPromise=  Order.find({
            createdAt:{
                $gte:ThisMonth.start,
                $lte:ThisMonth.end,
            },
          });
          const LastMonthOrdersPromise=  Order.find({
            createdAt:{
                $gte:LastMonth.start,
                $lte:LastMonth.end,
            },
          });
          const LastSixMonthOrdersPromise=  Order.find({
            createdAt:{
                $gte:sixMonthago,
                $lte:today,
            },
          });
          const latestTransactionsPromise= Order.find({}).select(["orderItems","discount","total","status"]).limit(4);

          const[thisMonthProducts,
            thisMonthUser,
            thisMonthOrders,
            LastMonthProducts,
            LastMonthUser,
        LastMonthOrders,
        productCount, 
        usersCount,
        allorders,
        LastSixMonthOrders,
        categories,
        femaleUsercount,
        latestTransactions,]= await Promise.all([thisMonthProductsPromise,
            thisMonthUserPromise,
            thisMonthOrdersPromise,
         LastMonthProductsPromise,
        LastMonthUserPromise,
    LastMonthOrdersPromise,
  Product.countDocuments(),
  User.countDocuments(),
  Order.find({}).select("total"),
  LastSixMonthOrdersPromise,
  Product.distinct("category"),
  User.countDocuments({gender:"female"}),
  latestTransactionsPromise
]);

    const thismonthRevenue= thisMonthOrders.reduce((total,order)=>total+(order.total ||0),0);
    const lastmonthRevenue= LastMonthOrders.reduce((total,order)=>total+(order.total ||0),0);
    const percent={
      revenue: calculatePercentage(thismonthRevenue,lastmonthRevenue),
      product:calculatePercentage(thisMonthProducts.length,LastMonthProducts.length),
      user:calculatePercentage(thisMonthUser.length,LastMonthUser.length),
      order:calculatePercentage(thisMonthOrders.length,LastMonthOrders.length),
    }

 const revenue= allorders.reduce((total,order)=>total+(order.total||0),0);
 const count={
  revenue,
  user: usersCount,
  product: productCount,
  order: allorders.length,
 }
 const orderMonthscount= getChartdata({length:12, docArr:LastSixMonthOrders});
 const Monthlyrevenue= getChartdata({length:12, docArr:LastSixMonthOrders, property:"total"});
 

const categoryCount=await getInventories({categories,productCount,});

const Userratio={
  male: usersCount - femaleUsercount,
  female: femaleUsercount,
};
const modifiedLatestTransaction= latestTransactions.map(i=>({
  _id: i._id,
  discount: i.discount,
  amount: i.total,
  quantity:i.orderItems.length,
  status:i.status,
}));
    stats={
      categoryCount,
      percent,
      count,
      chart:{
        order: orderMonthscount,
        revenue: Monthlyrevenue,
      },
      Userratio,
      latestTransactions: modifiedLatestTransaction,
    };

    mycache.set("admin-stats",JSON.stringify(stats));
    }
    return res.status(200).json({
        success: true,
        stats,
    })
})
export const getPiecharts= Trycatch(async(req,res,next)=>{
  let charts;
  if(mycache.has("admin-pie-charts")) charts= JSON.parse(mycache.get("admin-pie-charts")as string);
  else{

    const[processingOrder,shippedOrder,deliveredOrder,categories,productCount,outofStock,Orders,
      allusers,adminUsers,customerUsers]= await Promise.all([
      Order.countDocuments({status:"Processing"}),
      Order.countDocuments({status: "Shipped"}),
      Order.countDocuments({status: "Delivered"}),
      Product.distinct("category"),
      Product.countDocuments(),
      Product.countDocuments({stock:0}),
      Order.find({}).select(["total","discount","subtotal","tax","shippingCharges",]),
      User.find({}).select(["dob"]),
      User.countDocuments({role:"admin"}),
      User.countDocuments({role:"user"}),
    ]);
    const orderFullfillment={
      processing: processingOrder,
      shipped: shippedOrder,
      delivered: deliveredOrder,
    };
    const productCategories=await getInventories({categories,productCount,});
    const stockAvailability={
      inStock: productCount - outofStock,
      outofStock,
    };
   const grossIncome=Orders.reduce((prev, order)=>prev+(order.total ||0),0);
   const discount=Orders.reduce((prev, order)=>prev+(order.discount ||0),0);
   const productionCost=Orders.reduce((prev, order)=>prev+(order.shippingCharges ||0),0);
   const burnt=Orders.reduce((prev, order)=>prev+(order.tax ||0),0);
   const marketingCost= Math.round(grossIncome*(30/100));
   const netMargin= grossIncome -discount- productionCost -burnt -marketingCost;
    const revenueDistribution={
      netMargin,
      discount,
      productionCost,
      burnt,
      marketingCost,
    };
    
   const Userage={
    teen: allusers.filter((i)=>i.age <20).length,
    adult: allusers.filter((i)=>i.age >=20 && i.age <40).length,
    old: allusers.filter((i)=>i.age >= 40).length,
   };


    const userRole={
    admin: adminUsers,
    customer: customerUsers,
    }
    charts={
      orderFullfillment,
      productCategories,
      stockAvailability,
      revenueDistribution,
      userRole,
      Userage,
    };
    mycache.set("admin-pie-charts",JSON.stringify(charts));
  }
  return res.status(200).json({
    success: true,
    charts,
});
});
export const getBarcharts= Trycatch(async(req,res,next)=>{
  let charts;
  const key="admin-bar-charts";
  if(mycache.has(key)) charts= JSON.parse(mycache.get(key)as string);
  else{
    const today= new Date();
          const sixMonthago= new Date();
          sixMonthago.setMonth(sixMonthago.getMonth()- 6);
          const twelveMonthago= new Date();
          twelveMonthago.setMonth(twelveMonthago.getMonth()- 12);
          const SixMonthProductPromise=  Product.find({
            createdAt:{
                $gte:sixMonthago,
                $lte:today,
            },
          }).select("createdAt");
          const SixMonthUsersPromise=  User.find({
            createdAt:{
                $gte:sixMonthago,
                $lte:today,
            },
          }).select("createdAt");
          const TwelveMonthOrdersPromise=  Order.find({
            createdAt:{
                $gte:twelveMonthago,
                $lte:today,
            },
          }).select("createdAt");
          const[products,users,orders]= await Promise.all([SixMonthProductPromise,SixMonthUsersPromise,TwelveMonthOrdersPromise]);

          const productCounts=getChartdata({length:6, docArr:products});
          const userCounts=getChartdata({length:6, docArr:users});
          const orderCounts=getChartdata({length:12, docArr:orders});
  charts={
  user: userCounts,
  product: productCounts,
  order: orderCounts,
  }
  mycache.set(key,JSON.stringify(charts));
  };
  return res.status(200).json({
    success: true,
    charts,
});
});
export const getLinecharts= Trycatch(async(req,res,next)=>{
  let charts;
  const key="admin-line-charts";
  if(mycache.has(key)) charts= JSON.parse(mycache.get(key)as string);
  else{
    const today= new Date();
          const twelveMonthago= new Date();
          twelveMonthago.setMonth(twelveMonthago.getMonth()- 12);
          const baseQuery={
            createdAt:{
              $gte:twelveMonthago,
              $lte:today,
          },
          };
          const[products,users,orders]= await Promise.all([Product.find(baseQuery).select("createdAt"),
          User.find(baseQuery).select("createdAt"),Order.find(baseQuery).select(["createdAt","discount","total"])]);

          const productCounts=getChartdata({length:12, docArr:products});
          const userCounts=getChartdata({length:12, docArr:users});
          const discount=getChartdata({length:12, docArr:orders, property:"discount",});
          const revenue=getChartdata({length:12, docArr:orders, property:"total",});
  charts={
  user: userCounts,
  product: productCounts,
  discount,
  revenue,
  }
  mycache.set(key,JSON.stringify(charts));
  };
  return res.status(200).json({
    success: true,
    charts,
});
})