
import Input from "../../UI/Input";
import { Stage, Trash,Close } from "../../components/Icons/Icons"; 
import { useRef,useState } from "react";
import StageController,{AddMutipleStage} from "../../data/stageController";
const StagesPage = ({closeModal,showToast}) =>{ 
    const [groupstage,setgroupstage] = useState([]);  
    const stage = useRef("");     
    let stageServer = StageController();
    const onDeleteHandler = (item)=>{
        console.log(item);
        setgroupstage((prev)=> prev.filter(itemRider => itemRider != item));
    } ;
    const saveHandle = async()=>{
        if(groupstage.length){
            await AddMutipleStage(groupstage);
            showToast("success","Stages Saved","Successfully");
            closeModal();
        }else{
            alert("Empty");
        }
    };

    const setSpacesAndLowerCase = (text)=>{
        return text.toLowerCase().trim().replace(/\s+/g, "");
    };

    return(<div className="relative">
        <button className="text-lg absolute right-2 -top-1" onClick={closeModal}>
            <Close/>
        </button> 
        <div className="border-b mb-2">
            <div className="font-bold text-md ml-4 mt-2">Add Stage</div>
        </div>
        <div className="m-auto md:w-[80%] sm:w-[100%] xs:w-[100%] lg:w-[80%] mt-3">   
            <div className="grid grid-cols-8 items-center"> 
                <div className="col-span-7">
                    <Input label="Stage Name" type="text" value={stage}/>
                </div> 
                <button className="col-span-1 cursor-pointer" onClick={()=>{  
                    if(stage.current.value.trim().length){
                        let duplicate = groupstage.some(item => setSpacesAndLowerCase(item.name) === setSpacesAndLowerCase(stage.current.value));
                        let duplicateServer = stageServer.some(item => setSpacesAndLowerCase(item.name) === setSpacesAndLowerCase(stage.current.value)); //check in server 
                        if(duplicate || duplicateServer)
                            alert("stage are in the list"); 
                        else{ 
                            const newStage = stage.current.value;
                            setgroupstage(()=>[...groupstage,{name:newStage}]);   
                            stage.current.value = "";   
                        }
                            
                    }else{
                        alert("Empty List");
                    } 
                }}><Stage/></button> 
            </div>
            <div className="mx-2">
                <div className="grid grid-cols-8 gap-3 items-center text-xs pt-2 font-bold">
                    <div className="ml-3 col-span-6">Stage Name</div>
                    <div className="col-span-2">Action</div>  
                </div>
                <div className="relative overflow-y-auto max-h-[30vh] border rounded-md shadow-lg">
                    {
                        groupstage?.map((item,index)=>{
                            return(
                                <div key={index} className="grid grid-cols-8 gap-3 items-center text-xs border-b py-3">
                                    <div className="ml-3 col-span-7 font-bold">{item.name}</div> 
                                    <button className="curspor pointer" onClick={()=>onDeleteHandler(item)}><Trash/></button>
                                </div>
                            );
                        })
                    } 
                </div>
            </div>
            <div className="flex justify-end items-center rounded-br-lg my-2">
                <button className="text-white font-medium px-8 py-2 rounded-lg cursor-pointer bg-indigo-500 mr-2 text-xs" onClick={saveHandle}>Save</button>
            </div>
        </div> 
    </div>);
};

export default StagesPage;