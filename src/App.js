import "./App.css"; 
// import Clock from "react-live-clock"; 
// import MainPage from "./Pages/MainPage";  
import RouterComponents from "./router";
import { ModalProvider } from "react-modal-hook";
import { TimerProvider } from "./context/TimerContext";
import React,{useEffect} from "react";
// import socketIO from "socket.io-client";

function App() {  
    useEffect(() => {
        // Ensure you're using the correct URL to connect to your server
        // const socket = socketIO.connect("http://localhost:4000");  // Make sure this matches your server URL
        // socket.on("stopTimer", (data) => {
        //     alert(data);
        // });
    
        // // // Cleanup the socket connection on component unmount
        // return () => {
        //     socket.disconnect();
        // };
    }, []);
    return (
        // <div> 
        //     <center>
        //         <h1 className='font-bold py-2'><Clock format={"HH:mm:ss"} ticking={true} timezone={"Asia/Manila"} /></h1>
        //     </center>
        //     <MainPage ></MainPage>
        // </div>
        <TimerProvider>
            <ModalProvider>
                <RouterComponents/>
            </ModalProvider>
        </TimerProvider>
    );
}

export default App;