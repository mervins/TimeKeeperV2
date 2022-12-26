
import Input from "../../UI/Input";
import Select from "../../UI/Select";
import { AddUser, Trash,Close } from "../../components/Icons/Icons";
import { AddMutipleRider } from "../../data/ridersController";
import { useRef,useState } from "react";
const AddRider = ({riders,closeModal,showToast, categoryServer}) =>{
    const [groupRider,setGroupRider] = useState([]);
    const category = useRef(categoryServer[0].name);
    const name = useRef(""); 
    const plateNumber = useRef("");
    const userInfo = useRef({
        name:"",
        number:null,
        category:"", 
    });
    const onDeleteHandler = (item)=>{
        console.log(item);
        setGroupRider((prev)=> prev.filter(itemRider => itemRider.number != item.number));
    } ;
    const saveHandle = async()=>{
        if(groupRider.length){
            await AddMutipleRider(groupRider);
            showToast("success","Riders Saved","Successfully");
            closeModal();
        }else{
            alert("Empty");
        }
    };

    return(<div className="relative">
        <button className="text-lg absolute right-2 -top-1" onClick={closeModal}>
            <Close/>
        </button> 
        <div className="border-b mb-2">
            <div className="font-bold text-md ml-4 mt-2">Add Rider</div>
        </div>
        <div className="m-auto md:w-[80%] sm:w-[100%] xs:w-[100%] lg:w-[80%] mt-3">   
            <div className="mb-3">
                <Select items={categoryServer} label="Category" getValue={(value)=>{category.current = value;}}/>
            </div>  
            <div className="grid grid-cols-8 items-center">
                <div className="col-span-3">
                    <Input label="Race Plate" type="number" value={plateNumber}/>
                </div>
                <div className="col-span-4">
                    <Input label="Name" type="text" value={name}/>
                </div>
                
                <button className="col-span-1 cursor-pointer" onClick={()=>{
                    let dataRider = JSON.parse(JSON.stringify(userInfo.current = {...userInfo.current,name:name.current.value, number:plateNumber.current.value}));
                    if(plateNumber.current.value && name.current.value.trim().length){
                        let duplicate = groupRider.some(item => item.number === plateNumber.current.value);
                        let duplicateServer = riders.some(item => item.number === plateNumber.current.value); 
                        console.log(groupRider);
                        if(duplicate || duplicateServer)
                            alert("Try another number"); 
                        else{
                            setGroupRider(()=>[...groupRider,Object.assign(dataRider,{category:category.current})]);  
                            plateNumber.current.value = "";
                            name.current.value = "";
                        }
                    }else{
                        alert("Try Again");
                    } 
                }}><AddUser/></button> 
            </div>
            <div className="pb-2 mx-2">
                <div className="grid grid-cols-8 gap-3 items-center text-xs py-2 font-bold">
                    <div className="ml-3 col-span-2">Plate</div>
                    <div className="col-span-3">Name</div>
                    <div className="col-span-2">Category</div>
                    <div></div>
                </div>
                <div className="relative overflow-y-auto max-h-[30vh] border rounded-md shadow-lg">
                    {
                        groupRider?.map((item,index)=>{
                            return(
                                <div key={index} className="grid grid-cols-8 gap-3 items-center text-xs border-b py-2">
                                    <div className="ml-3 col-span-2">#{item.number}</div>
                                    <div className="col-span-3">{item.name}</div>
                                    <div className="col-span-2">{item.category}</div>
                                    <button className="curspor pointer" onClick={()=>onDeleteHandler(item)}><Trash/></button>
                                </div>
                            );
                        })
                    } 
                </div>
            </div>
            <div className="flex justify-end items-center rounded-br-lg mb-2">
                <button className="text-white font-medium px-8 py-2 rounded-lg cursor-pointer bg-indigo-500 mr-2 text-xs" onClick={saveHandle}>Save</button>
            </div>
        </div> 
    </div>);
};

export default AddRider;