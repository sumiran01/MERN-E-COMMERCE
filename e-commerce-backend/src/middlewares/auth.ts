import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { Trycatch } from "./error.js";

// middleware to make sure only admin is allowed
export const adminOnly= Trycatch(async(req,res,next)=>{
const{id}= req.query;
if(!id) return next(new ErrorHandler("Please Login",401));
 const user= await User.findById(id);
 if(!user) return next(new ErrorHandler("Invalid id",401));
 if(user.role!=="admin") return next(new ErrorHandler("user not allowed only admin",401));

next();
});