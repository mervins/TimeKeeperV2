import Modal from "../Modal";
import { useState } from "react";
import { UpdateInfo } from "../../../data/ridersController"; 
import Select from "../../../UI/Select";
import { Close  } from "../../Icons/Icons";

const UpdateParticipants = ({riders,categoryServer,hide,participant})=>{
    console.log(participant);
    const [userInfo, setUserInfo] = useState(participant || {});
    const [category, setCategory] = useState(participant.category_id);
    
    const saveHandle = async()=>{
        try{
            let duplicateServer = riders.filter(rider => rider.id != participant.id).some(item => parseInt(item.number) === parseInt(userInfo.number)); 
            if(duplicateServer){
                alert("Try another number"); 
                return;
            }
            await UpdateInfo(participant?.id,userInfo);
            hide({success: true });
        }catch(e){
            alert(`Error : ${e}`);
        }
    };
    return(
        <Modal>
            <div className="relative">
                <button className="text-lg absolute right-2 -top-1" onClick={hide}>
                    <Close/>
                </button> 
                <div className="border-b mb-2">
                    <div className="font-bold text-md ml-4 mt-2">Update Rider</div>
                </div>
                <div className="m-auto md:w-[80%] sm:w-[100%] xs:w-[100%] lg:w-[80%] mt-3">   
                    <div className="mb-3">
                        <Select items={categoryServer} label="Category" getValue={(value)=>{setCategory(value);}} value={category}/>
                    </div>  
                    <div className="my-4">
                        <div className="relative z-0 group border-none m-1">   
                            <input label="Name" type="number" name="name" value={userInfo.number} onChange={(e)=>{
                                setUserInfo({...userInfo, number: e.target.value});}}
                            className="truncate block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent focus:border-blue-600 border appearance-none focus:outline-none focus:ring-0 peer rounded-lg px-[15px] disabled:cursor-not-allowed"></input> 
                            <label htmlFor="UserInput" className="peer-focus:font-medium absolute text-sm text-gray-600 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6 ml-2 px-4 peer-placeholder-shown:-z-10 peer-focus:z-20 rounded-lg bg-white">Race Plate</label>
                        </div>
                    </div>
                    <div className="my-4">  
                        <div className="relative z-0 group border-none m-1">   
                            <input label="Name" type="text" name="name" value={userInfo.name} onChange={(e)=>{
                                setUserInfo({...userInfo, name: e.target.value});}}
                            className="truncate block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent focus:border-blue-600 border appearance-none focus:outline-none focus:ring-0 peer rounded-lg px-[15px] disabled:cursor-not-allowed"></input> 
                            <label htmlFor="UserInput" className="peer-focus:font-medium absolute text-sm text-gray-600 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6 ml-2 px-4 peer-placeholder-shown:-z-10 peer-focus:z-20 rounded-lg bg-white">Name</label>
                        </div>
                    </div>
                    <div className="flex justify-end items-center rounded-br-lg mb-2">
                        <button className="text-white font-medium px-8 py-2 rounded-lg cursor-pointer bg-indigo-500 mr-2 text-xs" onClick={saveHandle}>Save</button>
                    </div>
                </div> 
            </div>
        </Modal>
    );
};

export default UpdateParticipants;