import { ReactElement, useEffect, useState } from "react";
import TableHOC from "../Components/tableHOC"
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../types/reducer-types";

import { Column } from "react-table";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { CustomError } from "../types/api-types";
import { useMyOrdersQuery } from "../redux/reducer/api/orderAPI";
import { Skeleton } from "../Components/loader";

type Datatype={ 
    _id: string;
    amount:number;
    quantity:number;
    discount:number;
    status: ReactElement;
    action: ReactElement;
}
const column: Column<Datatype>[]=[
    {
    Header: "ID",
    accessor: "_id",
},
    {
    Header: "Amount",
    accessor: "amount",
},
    {
    Header: "Quantity",
    accessor: "quantity",
},
    {
    Header: "Discount",
    accessor: "discount",
},
    {
    Header: "Status",
    accessor: "status",
},
    {
    Header: "Action",
    accessor: "action",
},
]
const Orders = () => {
    const{user}= useSelector((state:{userReducer:UserReducerInitialState})=>state.userReducer)
  const{isLoading,data,isError,error}=useMyOrdersQuery(user?._id!)
    const[rows,setrows]= useState<Datatype[]>([]);
    if(isError){
        const err=error as CustomError;
      toast.error(err.data.message);
      }
      useEffect(() => {
        if(data)setrows(data.orders.map((i)=>({
          _id: i._id,
          amount:i.total,
          discount:i.discount,
          quantity:i.orderItems.length,
          status:(<span className={
            i.status==="Processing"?"red":i.status==="shipped"?"green":"purple"
          }>{i.status}</span>),
          action:<Link to={`Admin/Transaction/${i._id}`}>Manage</Link>,
        })));
      }, [data]);
    const Table= TableHOC<Datatype>(column,rows,"dashboard-product-box","Orders",rows.length>6)()
  return (
    <div className="container">
        <h1>My Orders</h1>
        {isLoading?<Skeleton/>:Table}
    </div>
  )
}

export default Orders