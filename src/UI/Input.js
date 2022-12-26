import React from "react";
import "./Input.css"; 
const Input = (props)=>{ 
    const {value} = props; 
    return (
        <>
            <div className="relative z-0 group border-none m-1">   
                <input type={props.type} ref={value}
                    className="truncate block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent focus:border-blue-600 border appearance-none focus:outline-none focus:ring-0 peer rounded-lg px-[15px] disabled:cursor-not-allowed"></input> 
                <label htmlFor="UserInput" className="peer-focus:font-medium absolute text-sm text-gray-600 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6 ml-2 px-4 peer-placeholder-shown:-z-10 peer-focus:z-20 rounded-lg bg-white">{props.label}</label>
            </div>
        </>
    );
}; 
export default Input; 