import { ButtonIcon } from "../Button";
import { Play,Stop,Cycle, Save } from "../Icons/Icons";
import React, { useState, useEffect,useRef,useContext} from "react";
import { UpdateRider } from "../../data/ridersController";
import { StatusRider } from "../../data/DummyData";
import { AddIndividualRiderFinished } from "../../data/stagesController";
import Modal from "../Modal/Modal";
import RerunMessage from "../../Pages/ModalMainPage/RerunMessage";
// import stringPadding from "../../util/stringPadding";
// import socketIO from "socket.io-client";
// import { useSocket } from "../../context/TimerContext";
import { TimerContext } from "../../context/TimerContext";

const ListItem = (props)=>{
    const {number, stage, id} = props.item;
    const prepareToStop = props.prepareToStop;
    const {socketRef} = useContext(TimerContext);
    const [totalTime, setTotalTime] = useState(0);
    const [running, setRunning] = useState(false);
    const [getStartTime,setGetStartTime] = useState("00:00:00:000");
    const [finishedTime,setFinishedTime] = useState("00:00:00:000");
    const [showMessage, setShowMessage] = useState(false);
    const buttonsDisplay = useRef({
        start:true,
        end:false,
        rerun:false,
        save:false
    });
    
    const interval = useRef();
    const startTime = useRef();
    // const socketRef = useRef(null);
    useEffect(() => {
    
        // const socket = socketIO.connect("http://localhost:4000");  // Make sure this matches your server URL
        // socket.on("stopTimer", (data) => {
        //     console.log(data);
        //     if (id === prepareToStop[0] && running) {
        //         stopHandler();
        //         props.toggleCard(id);
        //     }
        // });
    
        // // Cleanup the socket connection on component unmount
        // return () => {
        //     socket.disconnect();
        // };

        if (!socketRef.current) return; // Wait for the socket to initialize

        const handleStopTimer = (data) => {
            console.log(data);
            if (id === prepareToStop[0] && running) {
                stopHandler();
                props.toggleCard(id);
            }
        };

        // Listen for the stopTimer event
        socketRef.current.on("stopTimer", handleStopTimer);

        // Cleanup
        return () => {
            socketRef.current.off("stopTimer", handleStopTimer);
        };

    }, [prepareToStop,id,running,socketRef.current]);

    useEffect(() => { 
        if (running) { 
            if(interval.current)
                clearInterval(interval.current);
            interval.current = setInterval(() => {
                setTotalTime(() => ((Date.now() - startTime.current)));   
            }, 100);
        } else if (!running) {
            clearInterval(interval.current); 
        }
        return () => clearInterval(interval.current);
    }, [running]);

    const getOnTime = ()=>{
        var d = new Date();
        let hour = d.getHours();
        let minute = d.getMinutes();
        let second = d.getSeconds();
        let mili = d.getMilliseconds();
        return(`${hour }:${minute}:${second}:${(mili)}`);
    };

    const playHandle = ()=>{
        startTime.current = Date.now();
        UpdateRider(props.item,StatusRider.RUNNING,stage);
        setRunning(true); 
        setGetStartTime(getOnTime);
        buttonsDisplay.current.start = false;
        buttonsDisplay.current.end = true; 

    };
    const stopHandler = ()=>{
        setRunning(false); 
        UpdateRider(props.item,StatusRider.TOUCHDOWN,stage);
        setFinishedTime(getOnTime);
        buttonsDisplay.current.end = false;  
        buttonsDisplay.current.save = true;  
    };
    const rerunHandler = ()=>{ 
        setShowMessage(true); 
    };
    const confirmReRun = () =>{ 
        UpdateRider(props.item,StatusRider.RERUN,stage);
        setTotalTime(0); 
        setGetStartTime("00:00:00:00");
        setFinishedTime("00:00:00:00");
        buttonsDisplay.current.start = true;  
        buttonsDisplay.current.save = false; 
        setShowMessage(false); 
    };
    const saveHandler =() =>{
        UpdateRider(props.item,StatusRider.FINISHED,stage);
        AddIndividualRiderFinished({rider_id: id, rider_number:number, stage:stage.name,stage_id:stage.id, startTime:getStartTime, finishedTime:finishedTime, totalTime:totalTime});
        setTotalTime(0); 
        setGetStartTime("00:00:00:00");
        setFinishedTime("00:00:00:00");
        buttonsDisplay.current.start = true;  
        buttonsDisplay.current.save = false; 
        props.messageToast();
    };
    const meliSecond = ()=>{
        const milli = new Date();
        milli.setMilliseconds(totalTime);
        return milli;
    };
    return(<>
        {showMessage && <Modal>
            <RerunMessage closeModal={()=>setShowMessage(false)} confirmReRun={()=>confirmReRun} label="Confirm" message="Could you please confirm that you want to run the rider?"/>
        </Modal>} 
        <div className="relative w-full">   
            <div className="border py-2 text-black font-bold shadow-md flex items-center rounded-lg bg-white w-full sm:w-64"> 
                <div className="pl-1"><center className={`${prepareToStop.includes(id) && running ? "text-red-500" : "text-sx"} `}>Rider</center>
                    <div className="flex items-center">
                        <div>#</div>
                        <div className={`text-3xl ${prepareToStop.includes(id) && running ? "text-red-500" : "text-yellow-500"}`}>{number}</div>
                    </div>
                </div> 
                <div className="w-full">
                    <center className={`${prepareToStop.includes(id) && running ?"text-red-500 text-sx" : "text-sx"} `}>{props.item.name}</center>
                    <div className="flex justify-center font-mono">
                        <span className="w-8 text-center">{("0" + Math.floor((totalTime / 60000) % 60)).slice(-2)}:</span>
                        <span className="w-8 text-center">{("0" + Math.floor((totalTime / 1000) % 60)).slice(-2)}:</span>
                        {/* <span>{("0" + ((totalTime / 10) % 100)).slice(-2)}</span>  */}
                        {/* <span>{stringPadding(Math.floor((totalTime / 10) % 100),2)}</span> */}
                        <span className="w-8 text-center">{meliSecond().getMilliseconds()}</span>
                        
                        
                    </div> 
                </div>
                <div className="flex gap-2 justify-center pr-2"> 
                    {buttonsDisplay.current.start &&
                        <div className="text-green-500 cursor-pointer" onClick={playHandle}><ButtonIcon title="Start" Icon={<Play/>}></ButtonIcon></div> 
                    }
                    {
                        buttonsDisplay.current.end &&
                        <div className="text-red-500 cursor-pointer" onClick={stopHandler}><ButtonIcon title="End" Icon={<Stop/>}></ButtonIcon></div>
                    }
                    
                    {
                        buttonsDisplay.current.save &&  
                    <div className="text-blue-500 cursor-pointer" onClick={() => {saveHandler();}}><ButtonIcon title="Save" Icon={<Save/>}></ButtonIcon></div>   
                    }
                    {
                        buttonsDisplay.current.save && 
                        <div className="text-orange-400 cursor-pointer" onClick={rerunHandler}><ButtonIcon title="Rerun" Icon={<Cycle/>}></ButtonIcon></div> 
                    }
                </div>
            </div>  
        </div> 
    </>);
};

export default ListItem;