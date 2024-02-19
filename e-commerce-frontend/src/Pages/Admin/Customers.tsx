import { ReactElement, useCallback, useState } from "react";
import Admin_sidebar from "../../Components/admin_sidebar"
import { Column } from "react-table";
import TableHOC from "../../Components/tableHOC";
import { FaTrash } from "react-icons/fa";




interface DataType{
  photo: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
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
  Header:"E-mail",
  accessor: "email"
},
  {
  Header:"Gender",
  accessor: "gender"
},
  {
  Header:"Role",
  accessor: "role"
},
  {
  Header:"Action",
  accessor: "action"
},
]

const img= "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bGFwdG9wJTIwY29tcHV0ZXJ8ZW58MHx8MHx8fDA%3D";

const img2="https://www.shutterstock.com/image-photo/camera-600nw-610909205.jpg";

const arr: DataType[]=[
  {
    photo: <img src={img} alt="laptops"/>,
    name: "Macbook",
    email: "232223",
    gender :"Male",
    role :"user",
    action:(
      <button><FaTrash/></button>
    )
   },
   {
     photo: <img src={img2} alt="laptops"/>,
     name: "DSLR camera",
     email: "26000",
     gender:"Female",
     role:"user",
     action:(
      <button><FaTrash/></button>
     )
  
   }
 
]
const Customers = () => {
  const[data]=useState<DataType[]>(arr);
  const Table= useCallback(TableHOC<DataType>(columns, data, "dashboard-product-box","Customers", true),[]);
  return (
    <div className="admin-container">
    <Admin_sidebar/>
    <main>{Table()}</main>
    {/* Main*/}
    </div>

  )
}

export default Customers