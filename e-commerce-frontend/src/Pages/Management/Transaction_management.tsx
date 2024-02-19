
import Admin_sidebar from "../../Components/admin_sidebar"
import { OrderItemType } from "../../Components/Types"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { UserReducerInitialState } from "../../types/reducer-types"
import { useDeleteOrderMutation, useOrderDetailsQuery, useUpdateOrderMutation } from "../../redux/reducer/api/orderAPI"
import { Order } from "../../types/types"
import { Skeleton } from "../../Components/loader"
import { responseToast } from "../../Utils/features"

const defaultData:Order={
  shippingInfo:{
    address:"",
    city:"",
    state:"",
    country:"",
    pinCode:"",
  },
  status:"",
  subtotal: 4000,
  discount: 1200,
  ShippingCharges: 0,
  tax:200,
  total:0,
  orderItems:[],
  user:{name:"",_id:""},
  _id:"",
}
const Transaction_management = () => {
const {user}=useSelector((state:{userReducer:UserReducerInitialState})=>state.userReducer);
const params= useParams();
const navigate= useNavigate();
const{isLoading,data,isError}=useOrderDetailsQuery(params._id!);
const{shippingInfo:{address,city,country,state,pinCode},orderItems,user:{name},status,subtotal,total,tax,discount,ShippingCharges}
= data?.orders||defaultData;
const[updateOrder]=useUpdateOrderMutation();
const[deleteOrder]=useDeleteOrderMutation();

    const UpdateHandler=async()=>{
      const res= await updateOrder({
        userid: user?._id!,
        orderId:data?.orders._id!
      })
      responseToast(res,navigate,"/Admin/Transaction")
    };
  const deleteHandler=async()=>{
    const res= await deleteOrder({
      userid: user?._id!,
      orderId:data?.orders._id!
    })
    responseToast(res,navigate,"/Admin/Transaction")
  };
  if(isError) return <Navigate to={"/404"}/>
  return (
    <div className="admin-container">
    <Admin_sidebar/>
    <main>
      {
        isLoading?<Skeleton/>:<>
        <section>
        <h2>Order items</h2>
        {
          orderItems.map((i)=>
          (<ProductCart name={i.name} photo={i.photo} quantity={i.quantity} price={i.price} productID={i.productId}/>)
          
          )
        }
      </section>
      <article className="shipping-info-card">
        <button className="product-del-btn" onClick={deleteHandler} ></button>
        <h1>Order Info</h1>
        <h5>User info</h5>
        <p> Name: {name}</p>
        <p> Address:{`${address}, ${city}, ${state}, ${country}, ${pinCode}`}</p>


        <h5>Amount Inf</h5>
        <p> Subtotal:{subtotal}</p>
        <p> Shipping Charges:{ShippingCharges}</p>
        <p> tax:{tax}</p>
        <p> Discount:{discount}</p>
        <p> Total:{total}</p>

        <h5>Status Info</h5>
        <p>Status:
          <span className={status==="Deliverd"?"purple":status==="Shipped"?"green":"red"}>{status}</span>
        </p>
        <button onClick={UpdateHandler}>Process Order</button>
      </article>
        </>
      }
    </main>
    </div>
  )
}
const ProductCart=({name, price,photo,quantity,productID}: OrderItemType)=>(
  <div className="transaction-product-card">
    <img src={photo} alt={name} />
    <Link to={`/product/${productID}`}>{name}</Link>
    <span>${price} X{quantity}=${price*quantity}</span>
  </div>
)
export default Transaction_management