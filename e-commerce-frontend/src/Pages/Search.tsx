import { useState } from "react"
import Product_card from "../Components/Product_card";
import { useCategoriesQuery, useSearchProductsQuery } from "../redux/reducer/api/productAPI";
import { CustomError } from "../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../Components/loader";
import { CartItem } from "../types/types";
import { addtoCart } from "../redux/reducer/cartReducer";
import { useDispatch } from "react-redux";

const Search = () => {
  const {data:categoriesResponse, isLoading:loadingCategories,isError,error}= useCategoriesQuery("")
  const[search,setSearch]= useState("");
  const[sort,setSort]= useState("");
  const[maxprice,setmaxPrice]= useState(100000);
  const[category,setcategory]= useState("");
  const[page,setPage]= useState(1);
  const{isLoading:productloading,
    data: searchedData,
    isError:productIsError,
    error:productError}= useSearchProductsQuery({
    search,
    sort,
    category,
    page,
    price: maxprice,
  })
  const dispatch= useDispatch()
  const AddtocartHandler=(cartItem:CartItem)=>{
    if(cartItem.stock<1) return toast.error("Out of stock");
    dispatch(addtoCart(cartItem));
    toast.success("Added to Cart");
  };

  const isnextpage= page< 4;
  const isprevpage= page>1;
  if(isError){
    const err= error as CustomError;
    toast.error(err.data.message);
  }
  if(productIsError){
    const err= productError as CustomError;
    toast.error(err.data.message);
  }
  return (
    <div className="product-search-page">
      <aside>
     <h2>Filters</h2>
     <div>
      <h4>Sort</h4>
      <select value={sort} onChange={(e)=>setSort(e.target.value)}>
        <option value="">None</option>
        <option value="asc">Price (Low to High)</option>
        <option value="dsc">Price (High to Low)</option>
      </select>
     </div>


     <div>
      <h4>Max Price:{maxprice|| ""}</h4>
      <input type="range" min={100} max={100000} value={maxprice} onChange={(e)=>setmaxPrice(Number(e.target.value))}/>
     </div>

     <div>
      <h4>Category</h4>
      <select value={category} onChange={(e)=>setcategory(e.target.value)}>
        <option value="">ALL</option>
        {
      !loadingCategories && categoriesResponse?.categories.map((i)=>(
      <option key={i} value={i}>{i.toUpperCase()}</option>
      ))
        }
        </select>
     </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input type="text" placeholder="Search by name..." value={search} onChange={(e)=>setSearch(e.target.value)} />
        {
          productloading? <Skeleton/>:(
            <div className="search-product-list">
         {
          searchedData?.products.map((i)=> <Product_card 
          key={i._id}
          productId={i._id}
           name={i.name} 
           price={i.price}
            stock={i.stock}
             handler={AddtocartHandler}
              photo={i.photo}
              />)
         }
        </div>
          )
        }
        {
         searchedData&& searchedData.totalPage>1 &&(
            <article>
          <button disabled={!isprevpage} onClick={()=>setPage(prev=>prev-1)}>Prev</button>
          <span>{page} of {searchedData.totalPage}</span>
          <button disabled={!isnextpage} onClick={()=>setPage(prev=>prev+1)}>Next</button>
        </article>
          )
        }
      </main>
    </div>
  )
}

export default Search