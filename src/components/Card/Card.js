import { ButtonIcon } from "../Button";
import { Play,Stop,Cycle, Save } from "../Icons/Icons";
import React, { useState, useEffect,useRef} from "react";
import { UpdateRider } from "../../data/ridersController";
import { StatusRider } from "../../data/DummyData";
import { AddIndividualRiderFinished } from "../../data/stagesController";
import Modal from "../Modal/Modal";
import RerunMessage from "../../Pages/ModalMainPage/RerunMessage";

const Card = (props)=>{
    const {category,number, stage} = props.item;
    const [totalTime, setTotalTime] = useState(0);
    const [running, setRunning] = useState(false);
    const [getStartTime,setGetStartTime] = useState("00:00:00:00");
    const [finishedTime,setFinishedTime] = useState("00:00:00:00");
    const [showMessage, setShowMessage] = useState(false);
    const buttonsDisplay = useRef({
        start:true,
        end:false,
        rerun:false,
        save:false
    });
    useEffect(() => {
        console.log(buttonsDisplay.current.start);
        let interval;
        if (running) {
            interval = setInterval(() => {
                setTotalTime((prevTime) => prevTime + 10);  
            }, 10);
        } else if (!running) {
            clearInterval(interval); 
        }
        return () => clearInterval(interval);
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
        AddIndividualRiderFinished({rider_id: number, stage:stage, startTime:getStartTime, finishedTime:finishedTime, totalTime:totalTime});
        setTotalTime(0); 
        setGetStartTime("00:00:00:00");
        setFinishedTime("00:00:00:00");
        buttonsDisplay.current.start = true;  
        buttonsDisplay.current.save = false; 
        props.messageToast();
    };
    return(<>
        {showMessage && <Modal>
            <RerunMessage closeModal={()=>setShowMessage(false)} confirmReRun={()=>confirmReRun} label="Confirm" message="Could you please confirm that you want to run the rider?"/>
        </Modal>}
        <div>
            <div className="border rounded-lg shadow-lg relative">
                <div className="flex bg-violet-500 rounded-t-lg px-3 py-4 justify-between font-bold text-white">
                    <div>Rider: {number}</div> 
                    <div>{stage}</div>
                </div>
                <div className=" p-2">
                    <div className="text-center font-bold">Category: {category}</div>
                    <div className="border-2 p-1 rounded-lg shadow-md">
                        <div className="text-center font-bold">TIME</div>
                        <div className="flex flex-col justify-between gap-2 md:flex">
                            <div className="flex justify-center grow ">
                                <div>
                                    <div className="flex justify-center">Start</div>
                                    <div className="flex justify-center">{getStartTime}</div>
                                </div> 
                            </div>
                            <div className="flex justify-center grow">
                                <div>
                                    <div className="flex justify-center">Finished</div>
                                    <div className="flex justify-center">{finishedTime}</div>
                                </div> 
                            </div>
                        </div>
                    </div> 
                    <div className="border mt-2 rounded-full bg-indigo-500 py-1 text-white font-bold shadow-md">
                        <div className="flex justify-center">
                        Result
                        </div>
                        <div className="flex justify-center">
                            <span>{("0" + Math.floor((totalTime / 60000) % 60)).slice(-2)}:</span>
                            <span>{("0" + Math.floor((totalTime / 1000) % 60)).slice(-2)}:</span>
                            <span>{("0" + ((totalTime / 10) % 100)).slice(-2)}</span> 
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 border-t w-full p-2 justify-center"> 
                    {buttonsDisplay.current.start &&
                        <div onClick={playHandle}><ButtonIcon title="Start" Icon={<Play/>}></ButtonIcon></div> 
                    }
                    {
                        buttonsDisplay.current.end &&
                        <div onClick={stopHandler}><ButtonIcon title="End" Icon={<Stop/>}></ButtonIcon></div>
                    }
                    {
                        buttonsDisplay.current.save && 
                        <div onClick={rerunHandler}><ButtonIcon title="Rerun" Icon={<Cycle/>}></ButtonIcon></div> 
                    }
                    {
                        buttonsDisplay.current.save &&  
                    <div onClick={() => {saveHandler();}}><ButtonIcon title="Save" Icon={<Save/>}></ButtonIcon></div>   
                    }
                </div>
            </div>
        </div>
    </>);
};

export default Card;