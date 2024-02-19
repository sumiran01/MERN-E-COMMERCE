import { Link } from "react-router-dom"
import Product_card from "../Components/Product_card"
import { useLatestProductsQuery } from "../redux/reducer/api/productAPI";
import toast from "react-hot-toast";
import { Skeleton } from "../Components/loader";
import { CartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { addtoCart } from "../redux/reducer/cartReducer";

const Home = () => {
  const {data,isLoading,isError}= useLatestProductsQuery("");
  const dispatch= useDispatch()
  const AddtocartHandler=(cartItem:CartItem)=>{
    if(cartItem.stock<1) return toast.error("Out of stock");
    dispatch(addtoCart(cartItem));
    toast.success("Added to Cart");
  };
  if(isError) toast.error("Cannot Fetch Products");
  return (
    <div className="home">
      <section></section>

      <h1>Latest Products
        <Link to="/Search" className="find_more">More</Link>
      </h1>
      <main>
    
        {
         isLoading?<Skeleton/>:( data?.products.map((i)=><Product_card 
          key={i._id}
            productId={i._id} 
            name={i.name}
             price={i.price}
             stock={i.stock}
             handler={AddtocartHandler} 
             photo={i.photo}/>)
        )}
      </main>
    </div>
  )
}

export default Home