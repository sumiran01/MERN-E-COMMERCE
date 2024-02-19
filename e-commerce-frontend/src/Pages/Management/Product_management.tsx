import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Admin_sidebar from "../../Components/admin_sidebar";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../types/reducer-types";
import { useDeleteProductsMutation, useProductdetailsQuery, useUpdateProductsMutation } from "../../redux/reducer/api/productAPI";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { server } from "../../redux/reducer/store";
import { Skeleton } from "../../Components/loader";
import { responseToast } from "../../Utils/features";
import { FaTrash } from "react-icons/fa";



const Product_management = () => {

const {user}= useSelector((state:{userReducer: UserReducerInitialState})=>state.userReducer);
const params= useParams();
const navigate= useNavigate();
const{data,isLoading,isError}= useProductdetailsQuery(params.id!);                         

  const{price,photo,name,stock, category}=data?.product||{
    photo:"",
    category:"",
    name:"",
    price:0,
    stock:0,
  };
  const[nameUpdate,setNameupdate]= useState<string>(name);
  const[priceUpdate,setPriceupdate]= useState<number>(price);
  const[categoryUpdate,setcategoryupdate]= useState<string>(category);
  const[stockUpdate,setStockupdate]= useState<number>(stock);
  const[photoupdate,setPhotoupdate]= useState<string>(photo);
  const[photoFile,setPhotoFile]= useState<File>();
 const[updateProduct]= useUpdateProductsMutation();
 const[deleteProduct]=useDeleteProductsMutation();
  const ChangeImageHandler=(e:ChangeEvent<HTMLInputElement>)=>{
   const file:File|undefined = e.target.files?.[0];

   const reader: FileReader= new FileReader();

   if(file){
    reader.readAsDataURL(file);
    reader.onloadend=()=>{
      if(typeof reader.result==="string") setPhotoupdate(reader.result);
      setPhotoFile(file);
    }
   }
  };
 
 const Submithandler=async(e:FormEvent<HTMLFormElement>)=>{
  e.preventDefault();
 const formData= new FormData();
 if(nameUpdate) formData.set("name",nameUpdate);
 if(priceUpdate) formData.set("price",priceUpdate.toString());
 if(stockUpdate !==undefined) formData.set("stock",stockUpdate.toString());
 if(photoFile) formData.set("photo",photoFile);
 if(categoryUpdate)formData.set("category",categoryUpdate);
 const res= await updateProduct({formData,Userid:user?._id!,Productid:data?.product._id!,});
 responseToast(res,navigate,"/Admin/Products")
 }
 const Deletehandler=async()=>{
  const res= await deleteProduct({Userid:user?._id!,Productid:data?.product._id!,});
 responseToast(res,navigate,"/Admin/Products")
 }
useEffect(() => {
if(data){
  setNameupdate(data.product.name);
  setPriceupdate(data.product.price);
  setStockupdate(data.product.stock);
  setcategoryupdate(data.product.category);
}
}, [data]);
if(isError) return <Navigate to={"/404"}/>;
  return (
    <div className="admin-container">
      <Admin_sidebar />
      <main className="product-management">
        {
          isLoading?<Skeleton/>:(
         <>
         <section>
          <strong>ID-{data?.product._id}</strong>
          <img src={`${server}/${photo}`} alt="img" />
          <p>{name}</p>
          {
            stock > 0?(
              <span className="green">{stock} Available</span>
              ):<span className="red"> Not Available</span>
          }
          <h3>${price}</h3>
        </section>
     <article>
      <button onClick={Deletehandler}  className="product-delete-btn">
        <FaTrash/>
      </button>
     <form method="post" onSubmit={Submithandler}>
          <h2>Manage</h2>
          <div>
            <label>Name</label>
            <input required type="text" placeholder="Name" value={nameUpdate} onChange={(e)=>setNameupdate(e.target.value)} />
          </div>
          <div>
            <label>Price</label>
            <input required type="number" placeholder="Price" value={priceUpdate} onChange={(e)=>setPriceupdate(Number(e.target.value))} />
          </div>
          <div>
            <label>Stock</label>
            <input required type="number" placeholder="Stock" value={stockUpdate} onChange={(e)=>setStockupdate(Number(e.target.value))} />
          </div>
          <div>
            <label>Category</label>
            <input required type="text" placeholder="Category" value={categoryUpdate} onChange={(e)=>setcategoryupdate(e.target.value)} />
          </div>
          <div>
            <label>Photo</label>
            <input required type="file"  onChange={ChangeImageHandler} />
          </div>
          {photo && <img src={photoupdate} alt="new image" />}
          <button type="submit">Update</button>
        </form>
     </article>
         </>
          )
        }
      </main>
    </div>
  );
};




export default Product_management;