import { DeleteRiderFinished } from "../data/stagesController";
import { UpdateStatus } from "../data/ridersController"; 
const NumberToTime = ({stages,desc,showDel,close, number})=>{ 
    let hasKey = stages.filter((item)=> Object.keys(item).some(key => key === desc));
    console.log(hasKey[0]?.time);
    const milli = new Date();
    milli.setMilliseconds(hasKey[0]?.time);
    return (
        <div className="flex"> 
            {hasKey.length ? <div className="text-green-600">
                <span>{("0" + Math.floor((hasKey[0].time  / 60000) % 60)).slice(-2)}:</span>
                <span>{("0" + Math.floor((hasKey[0].time  / 1000) % 60)).slice(-2)}:</span> 
                {/* <span>{stringPadding(Math.floor((hasKey[0].time / 10) % 100),2)}</span> */}
                {/* <span>{stringPadding((hasKey[0].time % 1000) / 100,3)}</span>   */}
                <span>{milli.getMilliseconds()}</span>  
                {showDel && <span className="text-red-500 cursor-pointer ml-2" onClick={ async()=>{
                    let text = "Click OK to confirm?";
                    if (confirm(text) == true) {
                        text = "You pressed OK!";
                        console.log(desc); 
                        await DeleteRiderFinished(hasKey[0].id);
                        await UpdateStatus(number,desc,"WAITING");
                        close();
                    } else {
                        text = "You canceled!";
                    }
                }}>Delete</span>}
            </div> : <div>00:00:00</div> }
        </div>
    );
};

export default NumberToTime;