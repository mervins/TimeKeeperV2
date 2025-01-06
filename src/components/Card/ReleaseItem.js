import React, { useState, useEffect} from "react";
import { DateDisplay } from "../../util/helper";

import GO from "../../assets/GO.mp3";

const ReleaseItem = (props)=>{
    const { start_time=null, number} = props.item || {};
    const [timeLeft, setTimeLeft] = useState(20); 
    const [alertTriggered, setAlertTriggered] = useState(false);
    
    // const socketRef = useRef(null);

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
    
            if (timeDifference > 2 && timeDifference <= 20) {
                setTimeLeft(timeDifference); // Update countdown
            }else if (timeDifference <= 2) {
                clearInterval(interval); // Clear interval when start_time is reached
                if (!alertTriggered) {
                    playBeep();
                    // alert(`The start time has begun: ${startDateTime.toLocaleTimeString()}`);
                    setAlertTriggered(true);
                }
            }
        }, 1000);
    
        // Cleanup interval on component unmount or when startTime changes
        return () => clearInterval(interval);
    }, [start_time, alertTriggered]);

    const playBeep = () => {
        const audio = new Audio(GO); // Ensure the file path is correct
        audio.play();
    };

    return(<>
        <div className="relative w-full">  
            <div>
                <div className="flex justify-center flex-col w-full bg-white rounded-md">
                    <div className="border py-2 text-black font-bold shadow-md rounded-lg bg-white w-full sm:w-64"> 
                        <div className="pl-1 flex gap-2 justify-center items-center">
                            <center className={`${timeLeft ? "text-red-500" : "text-sx"} `}>Rider</center>
                            <div className="flex items-center justify-between">
                                <div>#</div>
                                <div className={`text-3xl ${timeLeft ? "text-red-500" : "text-yellow-500"}`}>{number}</div>
                                
                            </div>
                        </div> 
                        <div>
                            <div className="text-center"> 
                            Start Time: {DateDisplay(start_time)}
                            </div>
                            {
                                timeLeft <= 2 ?
                                    <p className="text-center">Released</p>:
                                    <p className="text-center">Countdown: {timeLeft || 20}</p>
                            }
                        </div>
                    </div> 
                </div>
            </div>
        </div> 
    </>);
};

export default ReleaseItem;