import { ChangeEvent, useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import{ Country, State} from "country-state-city"
import { useNavigate } from "react-router-dom";
import { CartReducerInitialState } from "../types/reducer-types";
import { useSelector } from "react-redux";

const Shipping = () => {

 const{cartItems }=useSelector((state:{cartReducer:CartReducerInitialState})=>state.cartReducer)

  const navigate= useNavigate();
    const[shippingInfo, setShippingInfo]=useState({
        address: "",
        city:"",
        state: "",
        country:"",
        pinCode:"",
    });
    const[country, setcountry]=useState(shippingInfo.country);
    const[state, setstate]=useState(shippingInfo.state);
    // const[city, setcity]=useState(shippingInfo.city);

   
    const ChangeHandler=(e:ChangeEvent<HTMLInputElement|HTMLSelectElement>)=>{
      setShippingInfo((prev)=>({...prev,[e.target.name]:e.target.value}))
    };
    useEffect(() => {
      if(cartItems.length==0) return navigate("/Cart")
  
    },[cartItems])
    
  return (
    <div className="shipping">
  <button className="back-btn" onClick={()=>navigate("/Cart")}><BiArrowBack/></button>
  <form>
    <h1>Shipping Address</h1>
    <input required type="text" placeholder="Address" name="address" value={shippingInfo.address} onChange={ChangeHandler} />
    <input required type="text" placeholder="City" name="city" value={shippingInfo.city} onChange={ChangeHandler} />
    
      {/* <select required  name="city" value={city} onChange={(e)=>setcity(e.target.value)}>
     <option>City</option>
     {
      City && City.getCitiesOfState  (country,state).map((item)=>(
        <option key={item.stateCode} value={item.stateCode}>{item.name}</option>
      ))
     }
    </select>  */}
    <select name="state" required  value={state} onChange={(e)=>setstate(e.target.value)}>
      <option>State</option>
      {State && State.getStatesOfCountry(country).map((item)=>(
        <option key={item.isoCode}value={item.isoCode}>{item.name}</option>
        ))}
          </select>
    <select name="country" required  value={country} onChange={(e)=>setcountry(e.target.value)}>
    <option>Country</option> 
      { Country && Country.getAllCountries().map((item)=>(
        <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
        ))}
    </select>
    <input required type=" number" placeholder="Pin-Code" name="pinCode" value={shippingInfo.pinCode} onChange={ChangeHandler} />
    <button type="submit">Pay Now</button>
  </form>
    </div>
  )
}

export default Shipping