import "./StopWatch.css";
import { BiReset,BiStop,BiPlay,BiSave } from "react-icons/bi";

import React, { useState, useEffect } from "react";
const Stopwatch = () => {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    const [getTime,setGetTime] = useState("00:00:00:00");
    const [finishedTime,setFinishedTime] = useState("00:00:00:00");

    useEffect(() => {
        let interval;
        if (running) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 10);
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

    return (
        <div className="w-[80vw]">
            <div>
                {/* <div><h4>RIDER: #{props.plateNumber}</h4></div> */}
                <div>Time Start: <strong>{getTime}</strong></div> 
                <div>Time Finished: <strong>{finishedTime}</strong></div> 
            </div> 
            <div className="numbers">
                <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
                <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}:</span>
                <span>{("0" + ((time / 10) % 100)).slice(-2)}</span>
            </div>
            <div className="buttons">
                <button onClick={() => {setRunning(true); setGetTime(getOnTime);}}><BiPlay></BiPlay></button>
                <button onClick={() => {setRunning(false); setFinishedTime(getOnTime);}}><BiStop></BiStop></button>
                <button onClick={() => setTime("00:00:00:00")}><BiReset></BiReset></button>       
                <button onClick={() => setTime("00:00:00:00")}><BiSave></BiSave></button>   
            </div>
        </div>
    );
};

export default Stopwatch;