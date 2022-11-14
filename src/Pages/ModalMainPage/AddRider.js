
import Input from "../../UI/Input";
import { AddUser, Trash } from "../../components/Icons/Icons";
import { ButtonIcon } from "../../components/Button";
import { AddMutipleRider } from "../../data/ridersController";
import { useRef,useState } from "react";
const AddRider = ({riders,closeModal}) =>{
    const [groupRider,setGroupRider] = useState([]);
    const category = useRef("19 below");
    const userInfo = useRef({
        name:"",
        number:null,
        category:"",
        status: JSON.stringify({
            Stage1:"WAITING",
            Stage2:"WAITING",
            Stage3:"WAITING"
        })
    });

    const onChageInputNumber = (value) =>{ 
        userInfo.current.number = Number(value);
        console.log( userInfo.current.number);
    };  
    const onChageInputName = (value) =>{ 
        userInfo.current.name = value;
        console.log(userInfo);
    };  
    const onDeleteHandler = (item)=>{
        console.log(item);
        setGroupRider((prev)=> prev.filter(itemRider => itemRider.number != item.number));
    } ;
    const saveHandle = async()=>{
        if(groupRider.length){
            await AddMutipleRider(groupRider);
            closeModal();
        }else{
            alert("Empty");
        }
    };

    return(<div className="relative">
        <div className="relative z-0 mt-6 group border-none m-2">
            <select onChange={(e)=>{category.current = e.target.value;}}
                className="truncate block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent  border-ssr-blue2 border-[1.9px] appearance-none focus:outline-none focus:ring-0 peer rounded-lg px-[15px] disabled:cursor-not-allowed">
                <option value={"19 below"}>19 Below</option>
                <option value={"20-29"}>20 - 29</option>
                <option value={"30-39"}>30 - 39</option> 
                <option value={"40 up"}>40 up</option>
                <option value={"Executive"}>Executive</option>
                <option value={"Ladies"}>Ladies</option>
            </select>
            <label className="peer-focus:font-medium absolute text-sm text-gray-600 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6 ml-2 px-4 peer-placeholder-shown:-z-10 peer-focus:z-20 rounded-lg bg-white">Category</label>
        </div>
        <div className="m-4 flex gap-1 justify-center items-center pl-2">
            <Input label="Number" type="number" value="" onChangeHandler = {onChageInputNumber} width="100px"/>
            <Input label="Name" type="text" value="" onChangeHandler = {onChageInputName}/>
            <div onClick={()=>{
                let dataRider = JSON.parse(JSON.stringify(userInfo.current));
                if(userInfo.current.number && userInfo.current.name.trim().length){
                    let duplicate = groupRider.some(item => item.number === userInfo.current.number);
                    let duplicateServer = riders.some(item => item.number === userInfo.current.number); 
                    console.log(groupRider);
                    if(duplicate || duplicateServer)
                        alert("Try another number"); 
                    else
                        setGroupRider(()=>[...groupRider,Object.assign(dataRider,{category:category.current})]);  
                }else{
                    alert("Try Again");
                } 
            }}><ButtonIcon Icon={<AddUser/>}/></div> 
        </div>
        {
            groupRider?.map((item,index)=>{
                return(
                    <div key={index} className="grid grid-cols-8 gap-3 items-center text-xs border-b mb-1">
                        <div className="ml-3 col-span-2">#{item.number}</div>
                        <div className="col-span-2">{item.name}</div>
                        <div className="col-span-2">{item.category}</div>
                        <div className="curspor pointer" onClick={()=>onDeleteHandler(item)}><ButtonIcon Icon={<Trash/>}/></div>
                    </div>
                );
            })
        }
        <div className="flex w-full justify-between mt-8 h-16 bg-slate-200 rounded-b-lg">
            <div className="flex justify-center items-center w-full cursor-pointer text-xl font-medium" onClick={closeModal}>
                Cancel
            </div>
            <div className="flex justify-center items-center w-full cursor-pointer bg-indigo-500" onClick={saveHandle}>
                <div className="text-white font-medium text-xl">Save</div>
            </div>
        </div>
    </div>);
};

export default AddRider;