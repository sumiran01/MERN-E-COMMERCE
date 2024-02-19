import { FormEvent, useEffect, useState } from "react"
import Admin_sidebar from "../../Components/admin_sidebar"



  const getrandomlower=()=>{
    return String.fromCharCode(Math.floor(Math.random()*26)+97);
  }
  const getrandomupper=()=>{
    return String.fromCharCode(Math.floor(Math.random()*26)+65);
  }
  const getrandomnumber=()=>{
    return String.fromCharCode(Math.floor(Math.random()*10)+48);
  }
  const getrandomsymbols=()=>{
    let symbolstr='!@#$%&*^?/:;';
    return symbolstr[Math.floor(Math.random()*symbolstr.length)];
  }


const Coupons = () => {

  const [size, setSize]= useState<number>(8);
  const [prefix, setprefix]= useState<string>("");
  const[includeNumbers,setIncludeNumbers]= useState<boolean>(false);
  const[includeCharacters,setIncludeCharacters]= useState<boolean>(false);
  const[includesymbols,setIncludesymbols]= useState<boolean>(false);
  const[isCopied,setIsCopied]= useState<boolean>(false);

  const[coupon,setcoupon]=useState<string>("");
  

  const copytext= async(coupon:string)=>{
   await window.navigator.clipboard.writeText(coupon);
   setIsCopied(true);
  };

  useEffect(() => {
    setIsCopied(false);
  }, [coupon])
  
  const SubmitHandler=(e: FormEvent<HTMLFormElement>)=>{
 e.preventDefault();
 if(!includeNumbers&& !includesymbols && !includeCharacters)return alert("Please Select one Atleast");
 let result:string= prefix||"";
 const lopplength:number= size- result.length
 for(let i=0; i<lopplength; i++){
  let entirestring:string=""
  if(includeCharacters)entirestring+= getrandomlower() + getrandomupper();
  if(includeNumbers)entirestring+= getrandomnumber();
  if(includesymbols)entirestring+= getrandomsymbols();
  result+=entirestring;
  }
  setcoupon(result);
  }

  return (
    <div className="admin-container">
        <Admin_sidebar/>
        <main className="dashboard-app-container">
      <h1>Coupon Generator</h1>
      <section>
        <form  className="coupon-form" onSubmit={SubmitHandler}>
          <input type="text" placeholder="Text to include" value={prefix} onChange={(e)=>setprefix(e.target.value)}
          maxLength={size} />
          <input type="number" placeholder="Length" value={size} onChange={(e)=>setSize(Number(e.target.value))}
          min={8}
          max={25} />

          <fieldset>
            <legend>Include</legend>
          <input type="checkbox"  checked={includeNumbers} onChange={()=>setIncludeNumbers(prev=>!prev)}/>
          <span>Numbers</span>
          <input type="checkbox"  checked={includeCharacters} onChange={()=>setIncludeCharacters(prev=>!prev)}/>
          <span>Characters</span>
          <input type="checkbox"  checked={includesymbols} onChange={()=>setIncludesymbols(prev=>!prev)}/>
          <span>Symbols</span>
          </fieldset>
          <button type="submit">Generate</button>
        </form>
          {coupon && <code>{coupon} <span onClick={()=>copytext(coupon)}>{isCopied?"Copied":"Copy"}</span></code>}
      </section>
        </main>
    </div>
  )
}

export default Coupons