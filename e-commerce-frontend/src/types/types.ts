export type User={
    name: string;
    email: string;
    photo: string;
    gender: string;
    role: string;
    dob: string;
    _id: string;
}
export type Product={
    name: string;
    category: string;
    price: number;
    stock: number;
    photo: string;
    _id: string;
}
export type CartItem={
    productId: string;
    photo: string;
   name: string;
    price:number;
    quantity:number;
    stock:number;
}
export type ShippingInfo={
    address: string;
    city: string;
   state: string;
    country: string;
    pinCode: string;
}
export type OrderItem=Omit<CartItem,"stock">&{_id:string};

export type Order={
    orderItems:OrderItem[];
    shippingInfo: ShippingInfo;
    subtotal: number;
    tax: number;
    ShippingCharges: number;
    discount: number;
    total: number;
    status:string;
    _id: string;
    user:{
        name:string;
        _id:string;
    };
};