import { useEffect, useState } from "react";
import{VscError} from "react-icons/vsc"
import Cartitem from "../Components/Cartitem";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducer-types";
import { CartItem } from "../types/types";
import { addtoCart, calculatePrice, discountApplied, removeCartitem } from "../redux/reducer/cartReducer";
import axios from "axios";
import { server } from "../redux/reducer/store";

const Cart = () => {
  const{
    cartItems,total,discount,subtotal,tax,ShippingCharges
  }=useSelector((state:{cartReducer:CartReducerInitialState})=>state.cartReducer)
   
  const[couponcode ,setCouponcode]= useState<string>("");
  const[Isvalid ,setIsvalid]= useState<boolean>(false);

  const dispatch= useDispatch()


  const incrementHandler=(cartItem:CartItem)=>{
    if(cartItem.quantity>=cartItem.stock)return;
    dispatch(addtoCart({...cartItem,quantity:cartItem.quantity+1}))
  };
  const decrementHandler=(cartItem:CartItem)=>{
    if(cartItem.quantity==1)return;
    dispatch(addtoCart({...cartItem,quantity:cartItem.quantity-1}))
  };
  const removerHandler=(id:string)=>{
    dispatch(removeCartitem(id))
  };
  useEffect(() => {
    const{token: cancelToken,cancel}=axios.CancelToken.source()
    const timeOutid= setTimeout(()=>{

      axios.get(
        `${server}/api/v1/payment/discount?coupon=${couponcode}`,{cancelToken}).then(
          (res)=>{dispatch(discountApplied(res.data.discount));
            setIsvalid(true)
            dispatch(calculatePrice())
          })
            .catch(()=>{
              dispatch(discountApplied(0))
        setIsvalid(false);
        dispatch(calculatePrice())
      }) 
   
    },1000)
  
    return () => {
      clearTimeout(timeOutid);
      cancel();
      setIsvalid(false)
    }
  }, [couponcode])
  
  useEffect(() => {
    dispatch(calculatePrice())
  }, [cartItems]);
  
  return (
    <div className="cart">
      <main>
        {cartItems.length>0? cartItems.map((i,idx)=>(
          <Cartitem  
          incrementHandler={incrementHandler} 
          decrementHandler={decrementHandler} 
          removerHandler={removerHandler} key={idx} cartitem={i}/>
        )):(<h1>No items Added</h1>)} 
      </main>
      <aside>
        <p>Subtotal: ${subtotal}</p>
        <p>Shipping charges: ${ShippingCharges}</p>
        <p>Tax: ${tax}</p>
        <p>Discount: <em className="red">-${discount}</em></p>
        <p><b>Total: ${total}</b></p>
        <input type="text"placeholder="Coupon code" value={couponcode} onChange={e=>setCouponcode(e.target.value)} />
        {
          couponcode && (Isvalid? (<span className="green">${discount} off using the <code>{couponcode}</code></span>)
          : (<span className="red">Invalid <VscError/></span>)
        )}
        {
          cartItems.length>0 && <Link to="/Shipping">CheckOut</Link>
        }
      </aside>
    </div>
  )
}

export default Cart