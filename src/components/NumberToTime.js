import { DeleteRiderFinished } from "../data/stagesController";
import { UpdateStatus } from "../data/ridersController"; 
const NumberToTime = ({stages,desc,showDel,close, number})=>{ 
    // let hasKey = stages.filter((item)=> Object.keys(item).some(key => key === desc));
    // console.log(hasKey[0]?.time);
    const milli = new Date();
    milli.setMilliseconds(stages.time);
    return (
        <div className="flex text-sm"> 
            <div className={desc === "totalTime" ? "text-green-600" : "text-black"}>
                <span>{("0" + Math.floor((stages.time  / 60000) % 60)).slice(-2)}:</span>
                <span>{("0" + Math.floor((stages.time  / 1000) % 60)).slice(-2)}:</span>  
                <span>{milli.getMilliseconds()}</span>  
                {showDel && <span className="text-red-500 cursor-pointer ml-2" onClick={ async()=>{
                    let text = "Click OK to confirm?";
                    if (confirm(text) == true) {
                        text = "You pressed OK!"; 
                        await DeleteRiderFinished(stages.id);
                        await UpdateStatus(number,desc,"WAITING");
                        close();
                    } else {
                        text = "You canceled!";
                    }
                }}>Delete</span>}
            </div>
        </div>
    );
};

export default NumberToTime;