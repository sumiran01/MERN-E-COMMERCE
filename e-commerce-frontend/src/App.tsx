import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Loader from "./Components/loader";
import Header from "./Components/Header";
import {Toaster} from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { userExist, userNotExist} from "./redux/reducer/userReducer";
import { getUser } from "./redux/reducer/api/userAPI";
import { UserReducerInitialState } from "./types/reducer-types";
import ProtectedRoute from "./Components/protectedRoute";
const Home = lazy(()=>import("./Pages/Home"));
const Search = lazy(()=>import("./Pages/Search"));
const Cart = lazy(()=>import("./Pages/Cart"));
const Shipping = lazy(()=>import("./Pages/Shipping"));
const Orders = lazy(()=>import("./Pages/Orders"));
const Order_Details = lazy(()=>import("./Pages/Order_Details"));
const Login = lazy(()=>import("./Pages/Login"));
const Dashboard = lazy(()=>import("./Pages/Admin/Dashboard"));
const Products = lazy(()=>import("./Pages/Admin/Products"));
const Customers = lazy(()=>import("./Pages/Admin/Customers"));
const Transaction = lazy(()=>import("./Pages/Admin/Transaction"));
const NewProduct = lazy(()=>import("./Pages/Management/NewProduct"));
const Product_management = lazy(()=>import("./Pages/Management/Product_management"));
const Transaction_management = lazy(()=>import("./Pages/Management/Transaction_management"));
const BarCharts = lazy(()=>import("./Pages/Charts/BarCharts"));
const LineCharts = lazy(()=>import("./Pages/Charts/LineCharts"));
const PieCharts = lazy(()=>import("./Pages/Charts/PieCharts"));
const Coupons = lazy(()=>import("./Pages/Apps/Coupons"));
const Stopwatch = lazy(()=>import("./Pages/Apps/Stopwatch"));
const Toss = lazy(()=>import("./Pages/Apps/Toss "));
const App = () => {
  const{user,loading}= useSelector((state:{userReducer:UserReducerInitialState})=>state.userReducer);
const dispatch= useDispatch();
  useEffect(() => {
    onAuthStateChanged(auth,async(user)=>{
      if(user){
        const data= await getUser(user.uid);
        dispatch(userExist(data.user));
      
      }else dispatch(userNotExist());
    })
  }, []);
  
  return  loading?(<Loader/>):(
    <Router>
      <Header user={user}/>
      <Suspense fallback={<Loader/>}>
      <Routes>
        <Route  path="/"element={<Home/>}/>
        <Route  path="/Search"element={<Search/>}/>
        <Route  path="/Cart"element={<Cart/>}/>



{/* Not Logged in Route */}



        <Route 
         path="/Login"
         element={
         <ProtectedRoute isAuthenticated={user?false:true}>
          <Login/>
            </ProtectedRoute>
        }
        />

         {/* Logged in user routes */}
        



       <Route
        element={<ProtectedRoute isAuthenticated={user?true:false}/>}
        >
       <Route  path="/Shipping"element={<Shipping/>}/>
       <Route  path="/Orders"element={<Orders/>}/>
       <Route  path="/Orders/:id"element={<Order_Details/>}/>
       </Route>

        {/* Admin Routes */}
        <Route 
        element={<ProtectedRoute isAuthenticated={true} adminRoute={true} isAdmin={user?.role==="admin"?true:false} />}
        >

        <Route path="/Admin/Dashboard" element={<Dashboard/>}/>
        <Route path="/Admin/Products" element={<Products/>}/>
        <Route path="/Admin/Customers" element={<Customers/>}/>
        <Route path="/Admin/Transaction" element={<Transaction/>}/>

        {/* Charts */}
        <Route path="/Admin/Chart/Bar" element={<BarCharts/>}/>
        <Route path="/Admin/charts/Lines" element={<LineCharts/>}/>
        <Route path="/Admin/Charts/Pie" element={<PieCharts/>}/>
        {/* Apps */}
        <Route path="/Apps/Coupon" element={<Coupons/>}/>
        <Route path="/Apps/Stopwatch" element={<Stopwatch/>}/>
        <Route path="/Apps/Toss" element={<Toss/>}/>
        {/* management */}
        <Route path="/Admin/Products/new" element={<NewProduct/>}/>
        <Route path="/Admin/Products/:id" element={<Product_management/>}/>
        <Route path="/Admin/Transaction/:id" element={<Transaction_management/>}/>
        </Route>
      </Routes>
      

      </Suspense>
      <Toaster position="top-center"/>
          </Router>

  )
}

export default App