import { FaRegBell } from "react-icons/fa"
import Admin_sidebar from "../../Components/admin_sidebar"
import {BsSearch} from "react-icons/bs"
import {HiTrendingUp,HiTrendingDown} from "react-icons/hi"
import data from "../../assets/data.json"
import {BarChart, DoughnutChart} from "../../Components/Charts"
import {BiMaleFemale} from "react-icons/bi"
import DashboardTables from "./DashboardTables"
const Userimg= "https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg"
const Dashboard = () => {
  return (
    <div className="admin-container">
    <Admin_sidebar/>
    <main className="dashboard">
<div className="bar">
<BsSearch/>
<input type="text" placeholder="Search for Data,Users,Docs..." />
<FaRegBell/>
<img src={Userimg} alt="user" />
</div>
  <section className="widget_container">
    <WidgetItem percent={40} amount={true}  value={340000000}
    heading="Revenue" color="rgb(0,115,255)"
    />
    <WidgetItem percent={-14} value={400}
    heading="Users" color="rgb(0,198,202)"
    />
    <WidgetItem percent={80} value={23000}
    heading="Transactions" color="rgb(255,196,0)"
    />
    <WidgetItem percent={30}  value={1000}
    heading="Products" color="rgb(76 0 255)"
    />
  </section>
  <section className="graph-container">
    <div className="revenue-charts">
      <h2>Revenue & Transaction</h2>
      <div>
     <BarChart data_1={[300,144,433,655,237,755,190]}
     data_2={[200,444,343,556,778,455,990]}
     title_1="Revenue"
     title_2="Transaction"
     bgcolor_1="rgb(0, 115, 255)"
     bgcolor_2="rgba(53, 162, 235, 0.8)"/>      
      </div>
    </div>
    <div className="dashboard-categories">
      <h2>Inventory</h2>
      <div>
        {data.categories.map((i)=>(
          
          <CategoryItem key={i.name} heading={i.name} value={i.value} color={`hsl(${i.value},${i.value}%,50%)`}/>

        ))}
        
              </div>
    </div>
  </section>
  <section className="transaction-container">
    <div className="gender-chart">
      <h2>Gender Ratio</h2>
    <DoughnutChart 
    labels={['Females','Males']} 
    data={[12,19]}
     backgroundColor={["hsl(340,82%,56%)","rgba(53, 162, 235, 0.8)"]} 
     cutout={70}/>
      <p><BiMaleFemale/></p>
    </div>
    <DashboardTables data={data.Transaction}/>
  </section>
    </main>
    </div>
  )
}

interface WidgetItemProps{
heading:string;
value:number;
percent: number;
color: string;
amount?: boolean
}
const WidgetItem=({heading,value,percent,color,amount=false}:WidgetItemProps)=>(
  <article className="widget">
  <div className="widgetInfo">
    <p>{heading}</p>
    <h4>{amount?`$${value}`:value}</h4>
    {
      percent>0?(<span className="green"><HiTrendingUp/>+{percent}%{""}</span>):(<span className="red"><HiTrendingDown/>{percent}%{""}</span>
      )}
  </div>
  <div className="widgetcircle" style={{
    background:`conic-gradient(
      ${color} ${Math.abs(percent)/100*360}deg,
      rgb(255,255,255)0
    )`,
  }}>
    <span style={{
      color,
    }}>{percent}%</span>
  </div>
</article>
);

interface CategoryItemProps{
  color: string;
  value:number;
  heading:string;
}
const CategoryItem=({color,value,heading}:CategoryItemProps)=>
(<div className="category-item">
  <h5>{heading}</h5>
  <div>
    <div style={{
      backgroundColor:color,
      width:`${value}%`
    }}></div>
  </div>
  <span>{value}%</span>
</div>
);

export default Dashboard