import { LineChart } from "../../Components/Charts"
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

const LineCharts = () => {
  return (
    <div className="admin-container">
      <Admin_sidebar/>
      <main className="chart-container">
      <h1>Line Charts</h1>
      <section>
        <LineChart data={[200,444,444,556,778,455,990,1444,256,447,1000,1200]}
                   label="Users"                                                              
                    borderColor="rgb(53,162,255)"
                    backgroundColor="rgba(53,162,255,0.5)"
                    labels={months} 
                    />
                    <h2>Active Users</h2>
      </section>
      <section>
        <LineChart data={[40,60,244,100,143,120,41,47,50,56,32]}
                   label="Products"                                                              
                    borderColor="hsl(291,88%,22%)"
                    backgroundColor="hsla(291,88%,22%,0.4 )"
                    labels={months} 
                    />
                    <h2>Total Products (SKU)</h2>
      </section>
      <section>
        <LineChart data={[24000,14400,24100,34300,90000,20000,25600,44700,99000,144400,100000,120000]}
                   label="Revenue"                                                              
                    borderColor="hsl(129,80%,40%)"
                    backgroundColor="hsla(129,80%,40%,0.4 )"
                    labels={months} 
                    />
                    <h2>Total Revenue</h2>
      </section>
      <section>
        <LineChart data={[9000,12000,12000,9000,1000,5000, 4000,1200,1100,1500,2000,5000]}
                   label="Discount  "                                                              
                    borderColor="hsl(29,80%,40%)"
                    backgroundColor="hsla(29,80%,40%,0.4 )"
                    labels={months} 
                    />
                    <h2>Discount Alloted </h2>
      </section>
      </main>
    </div>
  )
}

export default LineCharts