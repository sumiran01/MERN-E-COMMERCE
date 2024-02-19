import { useEffect, useState } from "react";
import Admin_sidebar from "../../Components/admin_sidebar";

const FormatTime=(timeInSeconds:number)=>{
    const hours= String(Math.floor(timeInSeconds/3600));
    const minutes= String(Math.floor((timeInSeconds%3600)/60));
    const seconds= String(timeInSeconds%60);

    return `${hours.padStart(2,"0")}:${minutes.padStart(2,"0")}:${seconds.padStart(2,"0")}`;
};


const Stopwatch = () => {
    const[time,settime]= useState<number>(0);
    const[active,setactive]= useState<boolean>(false);

    const resetHandler=()=>{
        settime(0);
        setactive(false);
    }

 useEffect(()=>{
    let intervalID: number;
    if (active) 
        intervalID = window.setInterval(()=>{
            settime((prev)=>prev+1);
              },1000);
    

    return()=>{
        clearInterval(intervalID)
    };
 },[active]);

  return (
    <div className="admin-container">
        <Admin_sidebar/>
        <main className="dashboard-app-container">
     <h1>Stopwatch</h1>
     <section>
        <div className="stopwatch">
            <h2>{FormatTime(time)}</h2>
            <button onClick={()=>setactive((prev)=>!prev)}>{active?"Stop    ":"Start"}</button>
            <button onClick={resetHandler}>Reset</button>
        </div>
     </section>
        </main>
    </div>
  )
}

export default Stopwatch