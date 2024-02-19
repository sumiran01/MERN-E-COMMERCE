import { useState, ChangeEvent, FormEvent } from "react";
import Admin_sidebar from "../../Components/admin_sidebar";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../types/reducer-types";
import { useCreateProductsMutation } from "../../redux/reducer/api/productAPI";
import { responseToast } from "../../Utils/features";
import { useNavigate } from "react-router-dom";

const NewProduct = () => {
  const{user}=useSelector(
    (state:{userReducer:UserReducerInitialState})=>state.userReducer
  );
  const[name,setName]= useState<string>("");
  const[category,setcategory]= useState<string>("");
  const[price,setPrice]= useState<number>(10000);
  const[stock,setStock]= useState<number>(5);
  const[photoPrev,setPhotoPrev]=useState<string>("");
  const[photo,setPhoto]= useState<File>();
  const[newProduct]=useCreateProductsMutation();
 const navigate= useNavigate();
  const ChangeImageHandler=(e:ChangeEvent<HTMLInputElement>)=>{
   const file:File|undefined = e.target.files?.[0];

   const reader: FileReader= new FileReader();

   if(file){
    reader.readAsDataURL(file);
    reader.onloadend=()=>{
      if(typeof reader.result==="string") {setPhotoPrev(reader.result);
      setPhoto(file);
    }
    };
   }
  };
  const submitHandler= async (e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    if(!name|| !price||!stock|| !category|| !photo)
     return;

     const formData= new FormData()
     formData.set("name",name);
     formData.set("price",price.toString());
     formData.set("stock",stock.toString());
     formData.set("photo",photo);
     formData.set("category",category);


     const res= await newProduct({id:user?._id!, formData});
     responseToast(res, navigate,"/Admin/Products")
  };
  return (
    <div className="admin-container">
      <Admin_sidebar />
      <main className="product-management">
     <article>
     <form onSubmit={submitHandler} method="post">
          <h2>New Product</h2>
          <div>
            <label>Name</label>
            <input required type="text" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
          </div>
          <div>
            <label>Price</label>
            <input required type="number" placeholder="Price" value={price} onChange={(e)=>setPrice(Number(e.target.value))} />
          </div>
          <div>
            <label>Stock</label>
            <input required type="number" placeholder="Stock" value={stock} onChange={(e)=>setStock(Number(e.target.value))} />
          </div>
          <div>
            <label>Category</label>
            <input required type="text"  value={category} onChange={(e)=>setcategory(e.target.value)} />
          </div>
          <div>
            <label>Photo</label>
            <input required type="file"  onChange={ChangeImageHandler} />
          </div>
          {photo && <img src={photoPrev} alt="new image" />}
          <button type="submit">Create</button>
        </form>
     </article>
      </main>
    </div>
  );
};

export default NewProduct;
