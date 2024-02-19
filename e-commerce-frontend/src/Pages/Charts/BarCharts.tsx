import { BarChart } from "../../Components/Charts"
import Admin_sidebar from "../../Components/admin_sidebar"


const months = [
  'January', 
  'February', 
  'March', 
  'April', 
  'May', 
  'June', 
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const BarCharts = () => {
  return (
    <div className="admin-container">
 <Admin_sidebar/>
 <main className="chart-container">
  <h1>Bar Charts</h1>
  <section>
    <BarChart
     data_1={[300,144,433,655,237,755,190]}
      data_2={[200,444,343,556,778,455,990]} 
      title_1="Products"
       title_2="Users" 
       bgcolor_1={`hsl(260,50%,30%)`} 
       bgcolor_2={`hsl(360,90%,90%)`}/>
       <h2>Top SELLING PRODUCTS & TOP CUSTOMERS</h2>
  </section>
  <section>
    <BarChart
    horizontal={true}
     data_1={[200,444,343,556,778,455,990,444,122,334,890,909]}
      data_2={[]} 
      title_1="Products"
       title_2="" 
       bgcolor_1={`hsl(260,50%,30%)`} 
       bgcolor_2=""
       labels={months}
       />
       <h2>Orders Throughout the Year</h2>
  </section>
 </main>
    </div>
  )
}

export default BarCharts