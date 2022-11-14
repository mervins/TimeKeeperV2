import { ButtonIcon } from "../Button";
import { Play,Stop,Cycle, Save } from "../Icons/Icons";
import React, { useState, useEffect,useRef} from "react";
import { UpdateRider } from "../../data/ridersController";
import { StatusRider } from "../../data/DummyData";
import { AddIndividualRiderFinished } from "../../data/stagesController";
import Modal from "../Modal/Modal";
import RerunMessage from "../../Pages/ModalMainPage/RerunMessage";
import stringPadding from "../../util/stringPadding";

const ListItem = (props)=>{
    const {number, stage} = props.item;
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
    
    const interval = useRef();
    const startTime = useRef();

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
            <div className="relative">  
                <div className="pt-1"> 
                    <div className="border py-1 text-black font-bold shadow-md flex items-center"> 
                        <div className="pl-1"><div>Rider:</div>#{number}</div> 
                        <div className="w-full">
                            <center className="text-xs">{props.item.name}</center>
                            <div className="flex justify-center">
                                <span>{("0" + Math.floor((totalTime / 60000) % 60)).slice(-2)}:</span>
                                <span>{("0" + Math.floor((totalTime / 1000) % 60)).slice(-2)}:</span>
                                {/* <span>{("0" + ((totalTime / 10) % 100)).slice(-2)}</span>  */}
                                <span>{stringPadding(Math.floor((totalTime / 10) % 100),2)}</span>
                            </div>
                        </div>
                        <div className="flex gap-2 justify-center pr-2"> 
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
            </div>
        </div>
    </>);
};

export default ListItem;