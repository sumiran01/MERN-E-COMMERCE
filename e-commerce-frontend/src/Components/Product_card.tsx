import { FaPlus } from "react-icons/fa";
import { server } from "../redux/reducer/store";
import { CartItem } from "../types/types";


interface Productprops{
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  handler:((cartItem: CartItem) => string | undefined
  );
}

const Product_card = ({
  productId,
  photo,
  name,
  price,
  stock,
  handler,
}:Productprops) => {
  return (
    <div className="product-card">
      <img src={`${server}/${photo}`} alt={name}/>
      <p>{name}</p>
      <span>{price}</span>
      <div>
        <button onClick={()=>handler({productId,
  photo,
  name,
  price,
  stock,
  quantity:1,
})}><FaPlus/></button>
      </div>
    </div>
  )
}

export default Product_card