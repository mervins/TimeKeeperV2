import React,{Fragment} from "react";
import "./Toast.css";
import { FiCheckSquare } from "react-icons/fi";
import { BsExclamationOctagon,BsXLg,BsFillInfoCircleFill } from "react-icons/bs";

export const toastProperties = (type,message,title)=>{
    let toastProperties = null;
    switch(type) {
    case "success":
        return toastProperties = {
            id:1,
            title: title,
            description: message,
            backgroundColor: "#5cb85c",
            icon: <FiCheckSquare/>
        }; 
    case "warning":
        return toastProperties = {
            id:2,
            title: title,
            description: message,
            backgroundColor: "#d9534f",
            icon: <BsExclamationOctagon/>
        }; 
    case "info":
        return toastProperties = {
            id:3,
            title: title,
            description: message,
            backgroundColor: "#5bc0de",
            icon: <BsFillInfoCircleFill/>
        }; 
    case "error":
        return toastProperties = {
            id:4,
            title: title,
            description: message,
            backgroundColor: "#f0ad4e",
            icon: <BsXLg/>
        }; 
    default: 
        console.log(toastProperties);
        return [];
    }
};

const Toast = (props)=>{
    const {position,toast } = props;
    return (
        <Fragment>
            <div className={`notification-container ${position}`}>
                {/* {listItem}  */}
                <div className={`notification toast ${position}`} >
                    <div className="toastContainer">
                        <div className="notification-icon" style={{ backgroundColor: toast.backgroundColor }}>
                            {toast.icon}
                        </div>
                        <div>
                            <p className="notification-message">
                                {toast.description}
                            </p> 
                            <p className="notification-title" style={{ color: toast.backgroundColor }}>{toast.title}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Toast;