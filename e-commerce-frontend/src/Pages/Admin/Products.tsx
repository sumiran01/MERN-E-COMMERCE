import { ReactElement,  useEffect,  useState } from "react";
import Admin_sidebar from "../../Components/admin_sidebar"
import TableHOC from "../../Components/tableHOC"
import { Column } from "react-table";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useAllProductsQuery } from "../../redux/reducer/api/productAPI";
import { server } from "../../redux/reducer/store";
import toast from "react-hot-toast";
import { CustomError } from "../../types/api-types";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../types/reducer-types";
import { Skeleton } from "../../Components/loader";

interface DataType{
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement;
}
const columns: Column<DataType>[]=[
  {
  Header:"Photo",
  accessor: "photo"
},
  {
  Header:"Name",
  accessor: "name"
},
  {
  Header:"Price",
  accessor: "price"
},
  {
  Header:"Stock",
  accessor: "stock"
},
  {
  Header:"Action",
  accessor: "action"
},
]


const Products = () => {
  const{user}=useSelector((state:{userReducer: UserReducerInitialState})=>state.userReducer)
 const{ isLoading,isError,error,data}= useAllProductsQuery(user?._id!)
  const[rows, setrows]= useState<DataType[]>([]);
  if(isError){
    const err=error as CustomError;
    toast.error(err.data.message);
  }
  useEffect(() => {
    if(data)setrows(data.products.map((i)=>({
      photo: <img src={`${server}/${i.photo}`}/>,
      name: i.name,
      price: i.price,
      stock: i.stock,
      action:<Link to={`/Admin/Products/${i._id}`}>Manage</Link>
    })))
  }, [data])
  console.log(data)
  
  const Table= TableHOC<DataType>(columns, rows, "dashboard-product-box","Products", rows.length>6)();
  return (
    <div className="admin-container">
    <Admin_sidebar/>
    <main>{isLoading?<Skeleton/>:Table}</main>
    <Link to="/Admin/Products/new" className="create-product-btn">
      <FaPlus/>
    </Link>
    </div>

  )
}

export default Products;