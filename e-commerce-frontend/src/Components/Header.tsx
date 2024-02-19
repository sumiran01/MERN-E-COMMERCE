import { useState } from "react"
import { FaHome, FaSearch, FaShoppingBag,  FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa"
import { Link } from "react-router-dom"
import { User } from "../types/types"
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";

interface PropsType{
    user: User|null;
}
const Header = ({user}:PropsType) => {
    const[ isopen, setIsopen]= useState<boolean>(false);

    const logoutHandler=async()=>{
  try {

    await signOut(auth);
   toast.success("Sign Out Successfully")
    setIsopen(false);
  } catch (error) {
    toast.error("sign out fail");
  }
    }
  return (
    <nav className="header">
        <Link onClick={()=>setIsopen(false)}  to={"/"}><FaHome/></Link>
        <Link  onClick={()=>setIsopen(false)} to={"/Search"}><FaSearch/></Link>
        <Link  onClick={()=>setIsopen(false)} to={"/Cart"}><FaShoppingBag/></Link>

        {
            user?._id?(
                <>
                <button onClick={()=>setIsopen((prev)=>!prev)}>
                    <FaUser/>
                </button>
                <dialog open={isopen}>
                    <div>
                        {
                            user.role==="admin" &&(
                                <Link onClick={()=>setIsopen(false)} to="/Admin/Dashboard">Admin</Link>
                            )
                        }
                        <Link  to="/Orders">Orders</Link>
                        <button onClick={logoutHandler}><FaSignOutAlt/></button>
                    </div>
                </dialog>
                </>
            ): <Link  to={"/Login"}><FaSignInAlt/></Link>
        }
    </nav>
  )
}

export default Header
