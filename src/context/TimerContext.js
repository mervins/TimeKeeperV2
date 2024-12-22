import React, { createContext, useState,useEffect,useRef,useContext } from "react";
import { toastProperties } from "../components/Toast/Toast";
import socketIO from "socket.io-client";
// Create a Context
export const TimerContext = createContext();

// Create a Provider Component
export const TimerProvider = ({ children }) => {
    const [listToast, setListToast] = useState([]);  
    const [prepareToStop, setToStop] = useState([]);
    const socketRef = useRef(null);

    useEffect(() => {
        // Initialize the socket connection
        socketRef.current = socketIO.connect("http://localhost:4000");

        // Cleanup on unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const deleteToast = id => { 
        const toastListItem = listToast.findIndex(e => e.id === id); 
        listToast.splice(toastListItem, 1);
        setListToast([...listToast]);
    };
    const showToast = (type,message,title)=>{ 
        let toast = toastProperties(type,message,title);  
        setListToast([...listToast, toast]);   
    };

    const toggleCard = (id) => {
        if (prepareToStop.includes(id)) {
            setToStop(prepareToStop.filter((cardIndex) => cardIndex !== id));
        } else {
            setToStop([...prepareToStop, id]);
        }
    };

    const positionId = (id)=>{
        let index = prepareToStop.indexOf(id);
        return index+1;
    };
    
    return (
        <TimerContext.Provider value={{ 
            listToast, 
            setListToast,
            deleteToast,
            showToast,
            prepareToStop,
            setToStop,
            toggleCard,
            positionId,
            socketRef
        }}>
            {children}
        </TimerContext.Provider>
    );
};

export const useSocket = () => {
    return useContext(TimerProvider);
};
