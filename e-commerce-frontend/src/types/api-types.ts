import { CartItem, Order, Product, ShippingInfo, User } from "./types";


export type CustomError={
status:number;
data:{
    message:string;
    success: boolean;
}
}
export type MessageResponse={
    success: boolean;
    message: string;
}
export type userResponse={
    success: boolean;
    user: User;
}
export type ProductsResponse={
    success: true;
    products: Product[];
}
export type CategoriesResponse={
    success: boolean;
    categories: string[];
}
export type SearchResponse={
    success:boolean;
    products: Product[];
    totalPage: number;
}
export type SeacrhRequest={
    price: number;
    page: number;
    category:string;
    search:string;
    sort:string;
}
export type ProductDetailResponse={
    success: boolean;
    product: Product;
}
export type NewProductrequest={
    id: string;
    formData: FormData;
}
export type UpdateProductrequest={
    Userid: string;
    Productid: string;
    formData: FormData;
}
export type deleteProductrequest={
    Userid: string;
    Productid: string;
}

export type NewOrderrequest={
    OrderItem: CartItem[];
    subtotal:number;
    tax:number;
    shippingcharges:number;
    discount:number;
    total:number;
    shippingInfo: ShippingInfo;
    user:string;
}
export type UpdateorderRequest={
    userid: string;
    orderId:string;
}
export type OrdersResponse={
    success: true;
    orders: Order[];
}
export type OrderDetailResponse={
    success: true;
    orders: Order;
}
