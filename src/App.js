import "./App.css"; 
// import Clock from "react-live-clock"; 
// import MainPage from "./Pages/MainPage";  
import RouterComponents from "./router";
import { ModalProvider } from "react-modal-hook";
import { TimerProvider } from "./context/TimerContext";

function App() {  
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