import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { server } from "../redux/reducer/store";
import { CartItem } from "../types/types";

interface CartitemProps{
 cartitem: CartItem;
 incrementHandler:(cartitem:CartItem)=>void;
 decrementHandler:(cartitem:CartItem)=>void;
 removerHandler:(id:string)=>void;
};

const Cartitem = ({cartitem,incrementHandler,decrementHandler,removerHandler}:CartitemProps) => {
 const {photo,productId,name,price,quantity}= cartitem
  return (
    <div className="cart_item">
      <img src={`${server}/${photo}`} alt={name} />
      <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span>${price}</span>
      </article>
      <div>
        <button onClick={()=>decrementHandler(cartitem)}>-</button>
        <p>{quantity}</p>
        <button onClick={()=>incrementHandler(cartitem)}>+</button>
      </div>
      <button onClick={()=>removerHandler(productId)}><FaTrash/></button>
    </div>
  )
}

export default Cartitem