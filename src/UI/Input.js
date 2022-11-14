import React,{useState} from "react";
import "./Input.css"; 
const Input = (props)=>{ 
    const [isValidate, showIsValidate] = useState(true); 
    const [inputValue,setInputValue] = useState(props.value); 
    const inputStyle = {
        maxWidth: props.width, 
    }; 
    const labelStyle = {
        font_size:props.fontSize
    };
    const onChangeInput = (event) =>{ 
        setInputValue(event.target.value);
    };
    const onBlurInput = ()=>{ 
        try{
            if(inputValue.trim() !== ""){ 
                props.onChangeHandler(inputValue);
            }else{
                showIsValidate(false);
            }
        }catch(e){
            console.log(e);
        }
    };

    const errorShow = !isValidate ? "input inputError" : "input";
    return (
        <>
            <div className={errorShow} >   
                <input type={props.type} placeholder="" onBlur={onBlurInput} onChange={onChangeInput} value={inputValue} style={inputStyle} disabled={props.disabled}></input> 
                <label htmlFor="UserInput" style={labelStyle}>{props.label}</label>    
            </div>
        </>
    );
}; 
export default Input; 