import { useState,useEffect,useRef } from "react";
import ListItem from "../components/Card/ListItem";
import { Close,Menu, AddUser,Trash} from "../components/Icons/Icons"; 
import { StatusRider } from "../data/DummyData";
import Riders, { UpdateRider,DeleteRider,DeleteAllRiders } from "../data/ridersController";
import Stages, {DeleteAllStages} from "../data/stagesController";
import Modal from "../components/Modal/Modal";
import ImportModal from "./ModalMainPage/ImportModal";
import ResultModal from "./ModalMainPage/ResultModal";
import Toast from "../components/Toast/Toast";
import {toastProperties} from "../components/Toast/Toast";
import { useMediaQuery } from "../Hooks/useMediaQuery"; 
import RerunMessage from "./ModalMainPage/RerunMessage";
import { ButtonIcon } from "../components/Button";
import AddRider from "./ModalMainPage/AddRider";

const MainPage = ()=>{   
    const [currentCategory,setCurrentCategory] = useState("19 below");
    const [currentStage,setCurrentStage] = useState("Stage1"); 
    const [listToast, setListToast] = useState([]);   
    const [showModal, setShowModal] = useState({
        showImport:false,
        showResult:false,
        showNavBar:false,
        showDelete:false,
        showAddRider:false
    });
    let idRider = useRef();
    let ridersTest = Riders();
    let stagesFinished = Stages(); 
    let isPageWide = useMediaQuery("(min-width: 900px)"); 

    useEffect(() => {
        const interval = setInterval(() => {
            if ( listToast.length) {
                deleteToast(listToast[0].id);
            }
        }, 1000);
        
        return () => {
            clearInterval(interval);
        }; 
    }, [listToast]);

    const deleteToast = id => { 
        const toastListItem = listToast.findIndex(e => e.id === id); 
        listToast.splice(toastListItem, 1);
        setListToast([...listToast]);
    };

    const addRunner = (details,status)=>{ 
        UpdateRider(details, status,currentStage);
    };

    const removeRunner = async(details,status)=>{  
        UpdateRider(details, status,currentStage);  
    };

    const removeRider = () => {
        DeleteRider(idRider.current);
        setShowModal({...showModal, showDelete:false});
        showToast("error","Deleted","Successfully");
    };
 
    const filterCategory = (category) =>{ 
        return ridersTest?.filter(item => item.category === category);
    };
    
    const jsonParserStatus = (value,status) => JSON.parse(value)[currentStage] != status;

    const showToast = (type,message,title)=>{ 
        let toast = toastProperties(type,message,title);  
        setListToast([...listToast, toast]);   
    };

    const DeleteAllTables = ()=>{
        let text = "Click OK to delete all datas?";
        if (confirm(text) == true) {
            text = "You pressed OK!"; 
            DeleteAllRiders();
            DeleteAllStages();
        } else {
            text = "You canceled!";
        }
    };

    const listItem = listToast.map((toast, i) =>    {
        return (
            <Toast key={i} toast={toast} position="top-left"></Toast>
        );
    }        
    );

    return (<> 
        {showModal.showNavBar && <div className="w-full -top-0 h-full absolute" >
            <div className="z-40 bg-white absolute right-1 h-full">
                <div className="absolute z-20 top-[3px] -left-6 bg-red-500 rounded-full p-3 text-white cursor-pointer" onClick={()=>{setShowModal({...showModal, showNavBar:false});}}> <Close/></div>
                <div className="borde w-[340px] w-full rounded-l-lg"> 
                    <div className="mt-3 flex gap-1 justify-center items-center font-bold">
                        <div className="p-2 w-24 border rounded-md bg-white shadow-md cursor-pointer text-center" onClick={()=>setShowModal({...showModal, showResult:true,showNavBar:false})}>RANK</div>
                        <div className="p-2 w-24 border rounded-md bg-white shadow-md cursor-pointer text-center" onClick={()=>setShowModal({...showModal, showImport:true,showNavBar:false})}>IMPORT</div>   
                        <div className="p-2 w-24 border rounded-md bg-white shadow-md cursor-pointer text-center" onClick={()=>DeleteAllTables()}>CLEAR</div>
                    </div>
                    <div className="relative z-0 mt-6 group border-none m-2">
                        <select value={currentStage} onChange={(e)=>{console.log(e.target.value);setCurrentStage(e.target.value);}} className="truncate block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent  border-ssr-blue2 border-[1.9px] appearance-none focus:outline-none focus:ring-0 peer rounded-lg px-[15px] disabled:cursor-not-allowed">
                            <option value={"Stage1"}>Stage 1</option>
                            <option value={"Stage2"}>Stage 2</option>
                            <option value={"Stage3"}>Stage 3</option>  
                        </select>
                        <label className="peer-focus:font-medium absolute text-sm text-gray-600 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6 ml-2 px-4 peer-placeholder-shown:-z-10 peer-focus:z-20 rounded-lg bg-white">Stage</label>
                    </div>
                    <div className="relative z-0 mt-6 group border-none m-2">
                        <select value={currentCategory} onChange={(e)=>{console.log(e.target.value);setCurrentCategory(e.target.value);}} className="truncate block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent  border-ssr-blue2 border-[1.9px] appearance-none focus:outline-none focus:ring-0 peer rounded-lg px-[15px] disabled:cursor-not-allowed">
                            <option value={"19 below"}>19 Below</option>
                            <option value={"20-29"}>20 - 29</option>
                            <option value={"30-39"}>30 - 39</option> 
                            <option value={"40 up"}>40 up</option>
                            <option value={"Executive"}>Executive</option>
                            <option value={"Ladies"}>Ladies</option>
                        </select>
                        <label className="peer-focus:font-medium absolute text-sm text-gray-600 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6 ml-2 px-4 peer-placeholder-shown:-z-10 peer-focus:z-20 rounded-lg bg-white">Category</label>
                    </div>
                    <div className="mx-2 relative overflow-y-auto h-[75vh]">
                        {filterCategory(currentCategory)?.map((item,index)=>{
                            return(
                                <div key={index} className="w-full shadow-md">
                                    <div className="grid grid-cols-8 gap-2 border-indigo-600 border py-1 mb-1 px-1 rounded-md justify-center items-center">
                                        <div className="col-span-5 ml-3"> 
                                            <div className={!jsonParserStatus(item.status,StatusRider.FINISHED) ? "line-through text-red-500 font-bold" : "no-underline font-bold"}>
                                                #{item.number} {JSON.parse(item.status)[currentStage]}</div>
                                            <div className="text-xs">{item.name}</div>
                                        </div>
                                        <button className="cursor-pointer" onClick={()=>addRunner(item , StatusRider.ONBOARD)} 
                                            disabled={jsonParserStatus(item.status,StatusRider.WAITING)}>
                                            <ButtonIcon title="Start" Icon={<AddUser/>}></ButtonIcon>
                                        </button> 
                                        <div className="cursor-pointer" onClick={()=>{setShowModal({...showModal, showDelete:true,showNavBar:false}); idRider.current = item.id;}}>
                                            <ButtonIcon title="Start" Icon={<Trash/>}></ButtonIcon>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div> 
            <div className="z-30 w-full h-full absolute -top-0 bg-black/75" onClick={()=>{setShowModal({...showModal, showNavBar:false});}}></div>
        </div>}
        <div className="absolute left-3 top-1 w-28 py-1 border rounded-md bg-white shadow-md cursor-pointer text-center font-bold" onClick={()=>setShowModal({...showModal, showAddRider:true})}>ADD RIDER</div>
        <div className="relative h-[95vh] flex w-full mt-1">   
            {!isPageWide &&<div onClick={()=>{setShowModal({...showModal, showNavBar:true});}} className="absolute right-6 -top-8"><Menu/></div>}
            {listItem}  
            {showModal.showImport && <Modal>
                <ImportModal closeModal={()=>{
                    setShowModal({...showModal, showImport:false}); 
                }}
                messageToast={()=>{showToast("success","Imported Files","Successfully");}} 
                ridersTest={ridersTest}/> 
            </Modal >}
            {showModal.showResult && <Modal withSize={true}> 
                <ResultModal ridersTest={ridersTest} stagesFinished={stagesFinished} closeModal={()=>setShowModal({...showModal, showResult:false})}/>
            </Modal>} 
            {showModal.showDelete && <Modal>
                <RerunMessage label="Continue" closeModal={()=>setShowModal({...showModal, showDelete:false})} confirmReRun={()=>removeRider} message="Could you please confirm that you want to delete the rider?"/>
            </Modal>} 
            {showModal.showAddRider && <Modal withSize={true}>
                <AddRider riders={ridersTest} closeModal={()=>setShowModal({...showModal, showAddRider:false})}/>
            </Modal>}

            <div className="border-2 grow p-2 mx-2 rounded-lg overflow-y-auto h-[95vh]">
                <div className="flex bg-violet-500 px-3 py-2 justify-between font-bold text-white">
                    <div>Cat: {currentCategory}</div> 
                    <div>{currentStage}</div>
                </div>
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-5 gap-2 mt-4">
                        {
                            ridersTest?.map((item,index)=>{
                                return(
                                    <div key={index} className={(jsonParserStatus(item.status,StatusRider.WAITING) && jsonParserStatus(item.status,StatusRider.FINISHED)) ? "relative" : "hidden"}>
                                        <div className="absolute z-20 -top-1 -left-2 bg-red-500 rounded-full text-white cursor-pointer" onClick={()=>removeRunner(item,StatusRider.WAITING)}> <Close/></div>
                                        <ListItem item={{...item,stage:currentStage}} showWarning={()=>setShowModal({...showModal, showRerun:true})} messageToast={()=>{showToast("success","The record of the rider has been saved","Successfully");}} ></ListItem>
                                    </div>
                                );
                            })
                        }
                    </div> 
                </div>
            </div>
            {isPageWide && <div className="border max-w-[350px] w-full rounded-l-lg"> 
                <div className="mt-3 flex gap-3 justify-center items-center font-bold">
                    <button className="p-2 w-24 border rounded-md bg-white shadow-md cursor-pointer text-center" onClick={()=>setShowModal({...showModal, showResult:true})}>RANK</button>
                    <button className="p-2 w-24 border rounded-md bg-white shadow-md cursor-pointer text-center" onClick={()=>setShowModal({...showModal, showImport:true})}>IMPORT</button>   
                    <button className="p-2 w-24 border rounded-md bg-white shadow-md cursor-pointer text-center" onClick={()=>DeleteAllTables()}>CLEAR</button>
                </div>
                <div className="relative z-0 mt-6 group border-none m-2">
                    <select onChange={(e)=>{setCurrentStage(e.target.value);}} className="truncate block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent  border-ssr-blue2 border-[1.9px] appearance-none focus:outline-none focus:ring-0 peer rounded-lg px-[15px] disabled:cursor-not-allowed">
                        <option value={"Stage1"}>Stage 1</option>
                        <option value={"Stage2"}>Stage 2</option>
                        <option value={"Stage3"}>Stage 3</option>  
                    </select>
                    <label className="peer-focus:font-medium absolute text-sm text-gray-600 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6 ml-2 px-4 peer-placeholder-shown:-z-10 peer-focus:z-20 rounded-lg bg-white">Stage</label>
                </div>
                <div className="relative z-0 mt-6 group border-none m-2">
                    <select onChange={(e)=>{setCurrentCategory(e.target.value);}} className="truncate block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent  border-ssr-blue2 border-[1.9px] appearance-none focus:outline-none focus:ring-0 peer rounded-lg px-[15px] disabled:cursor-not-allowed">
                        <option value={"19 below"}>19 Below</option>
                        <option value={"20-29"}>20 - 29</option>
                        <option value={"30-39"}>30 - 39</option> 
                        <option value={"40 up"}>40 up</option>
                        <option value={"Executive"}>Executive</option>
                        <option value={"Ladies"}>Ladies</option>
                    </select>
                    <label className="peer-focus:font-medium absolute text-sm text-gray-600 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6 ml-2 px-4 peer-placeholder-shown:-z-10 peer-focus:z-20 rounded-lg bg-white">Category</label>
                </div>
                <div className="mx-2 relative overflow-y-auto h-[70vh]">
                    {filterCategory(currentCategory)?.map((item,index)=>{
                        return(
                            <div key={index} className={!jsonParserStatus(item.status,StatusRider.FINISHED) ? "line-through w-full shadow-md text-red-500 font-bold" : "no-underline w-full font-medium shadow-md"}>
                                <div className="grid grid-cols-8 gap-4  border-indigo-600 border py-1 mb-1 px-1 rounded-md">
                                    <div className="col-span-5 ml-3"> 
                                        <div className={!jsonParserStatus(item.status,StatusRider.FINISHED) ? "line-through text-red-500 font-bold" : "no-underline font-bold"}>#{item.number} {JSON.parse(item.status)[currentStage]}</div>
                                        <div className="text-xs">{item.name}</div>
                                    </div>
                                    <button className="cursor-pointer" onClick={()=>addRunner(item , StatusRider.ONBOARD)} disabled={jsonParserStatus(item.status,StatusRider.WAITING)}>
                                        <ButtonIcon title="Start" Icon={<AddUser/>}></ButtonIcon>
                                    </button> 
                                    <div className="cursor-pointer" onClick={()=>{setShowModal({...showModal, showDelete:true,showNavBar:false}); idRider.current = item.id;}}>
                                        <ButtonIcon title="Start" Icon={<Trash/>}></ButtonIcon>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>}
            <div>
            </div>  
        </div>
    </>);
};

export default MainPage;
