import { Column } from "react-table";
import Admin_sidebar from "../../Components/admin_sidebar"
import { ReactElement,  useEffect, useState } from "react";
import TableHOC from "../../Components/tableHOC";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../types/reducer-types";
import { useAllOrdersQuery } from "../../redux/reducer/api/orderAPI";
import toast from "react-hot-toast";
import { CustomError } from "../../types/api-types";
import { Skeleton } from "../../Components/loader";





interface DataType{
  user: string;
  quantity: number;
  discount: number;
  amount: number;
  status: ReactElement;
  action: ReactElement;
}



const columns: Column<DataType>[]=[
  {
  Header: 'User',
  accessor: 'user',
},
  {
  Header: 'Quantity',
  accessor: 'quantity',
},
  {
  Header: 'Amount',
  accessor: 'amount',
},
  {
  Header: 'Discount',
  accessor: 'discount',
},
  {
  Header: 'Status',
  accessor: 'status',
},
  {
  Header: 'Action',
  accessor: 'action',
}
]



const Transaction = () => {
  
  const{user}= useSelector((state:{userReducer:UserReducerInitialState})=>state.userReducer)
  const{isLoading,isError,error,data}=useAllOrdersQuery(user?._id!)
  const[row,setrows]=useState<DataType[]>([]);
  if(isError){
    const err=error as CustomError;
  toast.error(err.data.message);
  }
  useEffect(() => {
    if(data)setrows(data.orders.map((i)=>({
      user: i.user.name,
      amount:i.total,
      discount:i.discount,
      quantity:i.orderItems.length,
      status:(<span className={
        i.status==="Processing"?"red":i.status==="shipped"?"green":"purple"
      }>{i.status}</span>),
      action:<Link to={`/Admin/Transaction/${i._id}`}>Manage</Link>,
    })));
    try {
      if(data)setrows(data.orders.map((i)=>({
        user: i.user.name,
        amount:i.total,
        discount:i.discount,
        quantity:i.orderItems.length,
        status:(<span className={
          i.status==="Processing"?"red":i.status==="shipped"?"green":"purple"
        }>{i.status}</span>),
        action:<Link to={`/Admin/Transaction/${i._id}`}>Manage</Link>,
      })));
  
    } catch (error) {
      
    }
  },[data]);
  const Table=TableHOC<DataType>(columns, row, "dashboard-product-box","transaction", row.length>6)();

  return (
    <div className="admin-container">
    <Admin_sidebar/>
    <main>{isLoading?<Skeleton/>:Table}</main>
    {/* Main*/}
    </div>

  )
}

export default Transaction