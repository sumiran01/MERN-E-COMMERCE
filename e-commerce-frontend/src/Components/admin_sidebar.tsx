import { Link, Location,useLocation } from "react-router-dom";
import{RiDashboardFill, RiShoppingBag3Fill,RiCoupon3Fill} from "react-icons/ri";
import{AiFillFileText} from "react-icons/ai";
import{IoIosPeople} from "react-icons/io";
import{FaChartBar, FaChartPie,FaChartLine,FaStopwatch,FaGamepad} from "react-icons/fa";
import { IconType } from "react-icons";
const Admin_sidebar = () => {
  
  const location= useLocation();
  return (
    <aside>
      <h2>LOGO.</h2>
      <DivOne location={location}/>
            <DivTwo location={location}/>
            <DivThree location={location}/>
    </aside>
  )
}
const DivOne=({location}:{location:Location})=>(
  <div>
        <h5>Dashboard</h5>
        <ul>
          <Li url="/Admin/Dashboard" 
          text="Dashboard" 
          Icon={RiDashboardFill} 
          location={location}/>
          <Li url="/Admin/Products" 
          text="Products" 
          Icon={RiShoppingBag3Fill} 
           location={location}/>
          <Li url="/Admin/Customers" 
          text="Customers" 
          Icon={IoIosPeople} 
           location={location}/>
          <Li url="/Admin/Transaction" 
          text="Transactions" 
          Icon={AiFillFileText} 
          location={location}/>
                   
        </ul>
      </div>

)
const DivTwo=({location}:{location:Location})=>(
  <div>
        <h5>Charts</h5>
        <ul>
          <Li url="/Admin/Chart/Bar" 
          text="Bar" 
          Icon={FaChartBar} 
          location={location}/>
          <Li url="/Admin/Charts/Pie" 
          text="Pie" 
          Icon={FaChartPie} 
           location={location}/>
          <Li url="/Admin/charts/Lines" 
          text="Lines" 
          Icon={FaChartLine} 
           location={location}/>
                   
        </ul>
      </div>
)
const DivThree=({location}:{location:Location})=>(
  <div>
        <h5>Apps</h5>
        <ul>
          <Li url="/Apps/Stopwatch" 
          text="Stopwatch" 
          Icon={FaStopwatch} 
          location={location}/>
          <Li url="/Apps/Coupon" 
          text="Coupon" 
          Icon={RiCoupon3Fill} 
           location={location}/>
          <Li url="/Apps/Toss" 
          text="Toss" 
          Icon={FaGamepad} 
           location={location}/>
          
                   
        </ul>
      </div>
)
interface LiProps{
  url: string;
  text: string;
  location: Location;
  Icon: IconType
}
const Li=({url,text,location,Icon}:LiProps)=>(
  <li style={
    {
      backgroundColor: location.pathname.includes(url)?"rgba(0,115,255,0.1)":"white"
    }
  }>
          <Link to={url}
          style={{
            color: location.pathname.includes(url)?"rgb(0,115,255)":"black",
          }}>
          <Icon/>
          {text}
          </Link>
          </li>
)
export default Admin_sidebar