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
import { DateDisplay } from "../../util/helper";

const ListItem = (props)=>{
    const {number, stage, id, start_time=null} = props.item || {};
    const prepareToStop = props.prepareToStop;
    const {socketRef} = useContext(TimerContext);
    const [totalTime, setTotalTime] = useState(0);
    const [running, setRunning] = useState(false);
    const [getStartTime,setGetStartTime] = useState("00:00:00:000");
    const [finishedTime,setFinishedTime] = useState("00:00:00:000");
    const [showMessage, setShowMessage] = useState(false);
    const [timeLeft, setTimeLeft] = useState(20); 
    const [alertTriggered, setAlertTriggered] = useState(false);
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

    useEffect(() => {
        const startDateTime = new Date(start_time);
        const now = new Date();
        const initialTimeDifference = Math.round((startDateTime - now) / 1000); // Time difference in seconds
    
        if (initialTimeDifference <= 0) {
            console.log("Start time has already passed.");
            return;
        }
    
        // Check if we need a countdown
        if (initialTimeDifference <= 20) {
            setTimeLeft(initialTimeDifference); // Start countdown immediately
        }
    
        const interval = setInterval(() => {
            const now = new Date();
            const timeDifference = Math.round((startDateTime - now) / 1000);
    
            if (timeDifference > 0 && timeDifference <= 20) {
                setTimeLeft(timeDifference); // Update countdown
            } else if (timeDifference <= 0) {
                clearInterval(interval); // Clear interval when start_time is reached
                if (!alertTriggered) {
                    playHandle();
                    // alert(`The start time has begun: ${startDateTime.toLocaleTimeString()}`);
                    setAlertTriggered(true);
                }
            }
        }, 1000);
    
        // Cleanup interval on component unmount or when startTime changes
        return () => clearInterval(interval);
    }, [start_time, alertTriggered]);

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
        setAlertTriggered(false);
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
            <div>
                {
                    !running &&
                        <div className="flex justify-center flex-col w-full bg-white rounded-md">
                            <div className="text-center"> 
                            Start Time: {DateDisplay(start_time)}
                            </div>
                            {
                                timeLeft < 1 ?
                                    <p className="text-center">Released</p>:
                                    <p className="text-center">Countdown: {timeLeft || 20}</p>
                            }
                        </div>
                    
                } 
            </div>
        </div> 
    </>);
};

export default ListItem;