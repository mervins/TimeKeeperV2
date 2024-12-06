import Modal from "../Modal";
import { useState, useEffect } from "react";
import Select from "../../../UI/Select";
import { Close  } from "../../Icons/Icons";
import { updateStageInfo } from "../../../data/stagesController";

const PenaltyRider = ({stageServer,hide})=>{
    const [selectStage, setStage] = useState(stageServer ? stageServer[0]?.stage_id : 0);

    const [time, setTime] = useState({ minutes: null, seconds: null, milliseconds: null });
    
    useEffect(()=>{
        if(stageServer && stageServer.length > 0){
            let time = stageServer.find(item => item.stage_id === parseInt(selectStage));
            const minutes = Math.floor(time?.totalTime / 60000);
            const seconds = Math.floor((time?.totalTime % 60000) / 1000);
            const milliseconds = time?.totalTime % 1000;
            setTime((prev)=>{
                return { ...prev, minutes, seconds, milliseconds };
            });
        }
    },[selectStage]);

    const saveHandle = async()=>{
        let computeTime = timeToMilliseconds(time);
        try{
            let userStage = stageServer.find(item => item.stage_id === parseInt(selectStage));
            let updateDetails = {totalTime:parseInt(computeTime)};
            await updateStageInfo(userStage?.id,updateDetails);
            hide({success: true });
        }catch(e){
            alert(`Error : ${e}`);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(value);
        const newTime = {
            ...time,
            [name]: Math.max(0, parseInt(value || 0, 10)),
        };
        console.log(newTime);
        setTime(newTime);
    };

    const timeToMilliseconds = (time) => {
        return (
            parseInt(time?.minutes) * 60000 + // Convert minutes to milliseconds
            parseInt(time?.seconds) * 1000 +  // Convert seconds to milliseconds
            parseInt(time?.milliseconds)      // Add milliseconds directly
        );
    };
    return(
        <Modal>
            <div className="relative">
                <button className="text-lg absolute right-2 -top-1" onClick={hide}>
                    <Close/>
                </button> 
                <div className="border-b mb-2">
                    <div className="font-bold text-md ml-4 mt-2 text-red-500">Penalty</div>
                </div>
                <div className="m-auto md:w-[80%] sm:w-[100%] xs:w-[100%] lg:w-[80%] mt-3">   
                    <div className="mb-3">
                        <Select stage={true} items={stageServer} 
                            label="Stage" 
                            getValue={(value)=>{setStage(value);}} 
                            currentSelect={selectStage}/>
                    </div>  
                    <div>
                        <label>
                        Minutes
                            <input
                                className="truncate block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent focus:border-blue-600 border appearance-none focus:outline-none focus:ring-0 peer rounded-lg px-[15px] disabled:cursor-not-allowed"
                                type="number"
                                name="minutes"
                                value={time.minutes}
                                onChange={handleInputChange}
                                
                            />
                        </label>
                        <label>
                        Seconds
                            <input
                                className="truncate block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent focus:border-blue-600 border appearance-none focus:outline-none focus:ring-0 peer rounded-lg px-[15px] disabled:cursor-not-allowed"
                                type="number"
                                name="seconds"
                                value={time.seconds}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                        Milliseconds
                            <input
                                className="truncate block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent focus:border-blue-600 border appearance-none focus:outline-none focus:ring-0 peer rounded-lg px-[15px] disabled:cursor-not-allowed"
                                type="number"
                                name="milliseconds"
                                value={time.milliseconds}
                                onChange={handleInputChange}
                            />
                        </label>
                    </div>

                    <div className="flex justify-end items-center rounded-br-lg mb-2">
                        <button className="text-white font-medium px-8 py-2 rounded-lg cursor-pointer bg-indigo-500 mr-2 text-xs" onClick={saveHandle}>Save</button>
                    </div>
                </div> 
            </div>
        </Modal>
    );
};

export default PenaltyRider;