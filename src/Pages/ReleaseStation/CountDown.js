
import Modal from "../../components/Modal/Modal";
import GO from "../../assets/GO.mp3";
import LastThree from "../../assets/3_sec.mp3";
import React from "react";

const Countdown = ({timeLeft,number,hide})=>{

    React.useEffect(()=>{
        const playBeep = () => {
            const audio = new Audio(GO); // Ensure the file path is correct
            audio.play();
        };
        const last_five_sec = ()=>{
            const audio = new Audio(LastThree); // Ensure the file path is correct
            audio.play();
        };

        if(timeLeft == 6){
            last_five_sec();
        }

        if(timeLeft <=1 ){
            playBeep();
            setTimeout(()=>{
                hide();
            },1000);
        }
    },[timeLeft]);
    
    return(<Modal>
        <div className="flex flex-col justify-center items-center">
            {
                timeLeft <= 1 ?
                    <div className="text-[10rem] font-medium mb-4 p-4 text-red-500 font-bold">GO!</div> : 
                    <div className="flex w-full flex-col justify-center items-center">
                        <div className="text-[3rem] font-medium  font-bold">RIDER: {number}</div>
                        <div className="text-[1rem] font-medium  font-bold"> COUNTDOWN</div>
                        <div className="flex-1 text-[10rem] font-medium text-center p-4 bg-black w-64 mb-6 text-red-500 p-4 rounded-lg shadow-md">{timeLeft}</div>
                    </div>
            }
        </div>
    </Modal>);
};

export default Countdown;