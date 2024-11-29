import React, { createContext, useState } from "react";
import { toastProperties } from "../components/Toast/Toast";

// Create a Context
export const TimerContext = createContext();

// Create a Provider Component
export const TimerProvider = ({ children }) => {
    const [listToast, setListToast] = useState([]);  

    const deleteToast = id => { 
        const toastListItem = listToast.findIndex(e => e.id === id); 
        listToast.splice(toastListItem, 1);
        setListToast([...listToast]);
    };
    const showToast = (type,message,title)=>{ 
        let toast = toastProperties(type,message,title);  
        setListToast([...listToast, toast]);   
    };
    
    return (
        <TimerContext.Provider value={{ 
            listToast, 
            setListToast,
            deleteToast,
            showToast
        }}>
            {children}
        </TimerContext.Provider>
    );
};
