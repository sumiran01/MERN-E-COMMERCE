import { useState } from "react"
import Admin_sidebar from "../../Components/admin_sidebar"


const Toss  = () => {

const[angle,setAngle]= useState<number>(0);

const flipcoin=()=>{
    if (Math.random()>0.5)setAngle((prev)=>prev+180) 
        
    else setAngle((prev)=>prev+360);
};

  return (
    <div className="admin-container"> 
<Admin_sidebar/>
<main className="dashboard-app-container">
    <h1>Toss</h1>
    <section>
        <article className="tosscoin" onClick={flipcoin}
        style={{
            transform:`rotateY(${angle}deg)`,
        }}>
         <div></div>
         <div></div>
        </article>
    </section>
</main>
    </div>
  )
}

export default Toss 