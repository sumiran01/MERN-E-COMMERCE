export type OrderItemType={
    name: string;
    photo: string;
    price: number;
     quantity: number;
     productID: string;
};
export type OrderType={
    name: string;
    address: string;
    city: string;
    country: string;
    state: string;
     pinCode: number;
     status: "Processing|Shipped|Delivered";
     subtotal: number;
     discount: number;
     ShippingCharges: number;
     tax: number;
     total: number;
     orderItem: OrderItemType[];
     _id: string;
};