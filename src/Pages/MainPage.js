import { useState,useEffect,useRef } from "react";
import ListItem from "../components/Card/ListItem";
import { Close,Menu, AddUser,Setting, Category,Stage,Trophy, Trash} from "../components/Icons/Icons"; 
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
import Mobile from "./Device/Mobile"; 
import Select from "../UI/Select";
import CategoryPage from "./ModalMainPage/Category";
import StagesPage from "./ModalMainPage/StagesPage";
import StageController, {GetStage} from "../data/stageController";
import CategoryContrller from "../data/categoryController";
import { Link } from "react-router-dom";

const MainPage = ()=>{  
    let categoryServer = CategoryContrller();
    let stageServer = StageController();  
    const [currentCategory,setCurrentCategory] = useState([]);
    const [currentStage,setCurrentStage] = useState(); 
    const [listToast, setListToast] = useState([]);   
    const [showModal, setShowModal] = useState({
        showImport:false,
        showResult:false,
        showNavBar:false,
        showDelete:false,
        showAddRider:false,
        showCategory:false,
        showStages:false,
        showSetting:false
    });
    let idRider = useRef();
    let ridersParticipants = Riders();
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

    useEffect(() => {
        if (typeof categoryServer != "undefined") { 
            setCurrentCategory(categoryServer[0]?.id);
            console.log(categoryServer);
        }
    }, [categoryServer]);
    
    useEffect(() => {
        console.log(stageServer);
        if (typeof stageServer != "undefined") { 
            setCurrentStage(stageServer[0]);
            console.log(stageServer);
        }

    }, [stageServer]);

    const deleteToast = id => { 
        const toastListItem = listToast.findIndex(e => e.id === id); 
        listToast.splice(toastListItem, 1);
        setListToast([...listToast]);
    };

    const addRunner = async(details,status,stage)=>{ 
        console.log("=========Stage==============");
        let detailStage = await GetStage(parseInt(stage.id));
        console.log(detailStage);
        UpdateRider(details, status,detailStage);
    };

    const removeRunner = async(details,status)=>{  
        let detailStage = await GetStage(parseInt(currentStage.id));
        UpdateRider(details, status,detailStage);  
    };

    const removeRider = () => {
        DeleteRider(idRider.current);
        setShowModal({...showModal, showDelete:false});
        showToast("error","Deleted","Successfully");
    };
 
    const filterCategory = (category) =>{ 
        console.log("============CATEGORY======================");
        return ridersParticipants?.filter(item => item.category_id === parseInt(category));
    };
    
    const jsonParserStatus = (stages,status) =>{
        console.log(stages);
        let getStage = stages.filter(stage => stage.stage == currentStage?.name); 
        return getStage[0]?.status != status; 
    };
    

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
    let getStatusStage = (stages)=>{ 
        let stage = stages.filter(stage=> stage.stage == currentStage?.name);  
        return stage[0]?.status;
    };

    let getStageList = async(id)=>{
        let detailStage = await GetStage(parseInt(id));
        setCurrentStage(detailStage);
        return detailStage;
    };

    return (<> 
        <Mobile 
            currentCategory={currentCategory} 
            currentStage={currentStage} 
            setCurrentCategory={setCurrentCategory} 
            setCurrentStage={setCurrentStage} 
            setShowModal={setShowModal} 
            ridersParticipants={ridersParticipants} 
            addRunner={addRunner} 
            DeleteAllTables={DeleteAllTables}
            StatusRider={StatusRider} 
            idRider={idRider} 
            showModal={showModal} 
            stageServer={stageServer} 
            categoryServer={categoryServer}></Mobile> 
        <div className="relative h-[95vh] flex w-full mt-1">   
            {/* {!isPageWide &&<div onClick={()=>{setShowModal({...showModal, showNavBar:true});}} 
                className="absolute left-2 top-4"><Menu/></div>} */}
            {listItem}  
            {showModal.showImport && <Modal>
                <ImportModal closeModal={()=>{setShowModal({...showModal, showImport:false});}} messageToast={()=>{showToast("success","Imported Files","Successfully");}} 
                    ridersParticipants={ridersParticipants}/> 
            </Modal >}
            {showModal.showResult && <Modal withSize={true}> 
                <ResultModal ridersParticipants={ridersParticipants} stagesFinished={stagesFinished} closeModal={()=>setShowModal({...showModal, showResult:false})} categoryServer={categoryServer} stageServer={stageServer}/>
            </Modal>} 
            {showModal.showDelete && <Modal>
                <RerunMessage label="Continue" closeModal={()=>setShowModal({...showModal, showDelete:false})} confirmReRun={()=>removeRider} message="Could you please confirm that you want to delete the rider?"/>
            </Modal>} 
            {showModal.showAddRider && <Modal>
                <AddRider riders={ridersParticipants} categoryServer={categoryServer} showToast={showToast} closeModal={()=>setShowModal({...showModal, showAddRider:false})}/>
            </Modal>}  
            {showModal.showCategory && <Modal>
                <CategoryPage riders={ridersParticipants} showToast={showToast} closeModal={()=>setShowModal({...showModal, showCategory:false})}/>
            </Modal>}
            {showModal.showStages && <Modal>
                <StagesPage riders={ridersParticipants} showToast={showToast} closeModal={()=>setShowModal({...showModal, showStages:false})}/>
            </Modal>}

            <div className="border grow p-1 overflow-y-auto h-[95vh] bg-[#E4E9F2]">
                <div>  
                </div>
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-5 gap-2 mt-4">
                        {
                            ridersParticipants?.map((item,index)=>{
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
            {isPageWide && <div className="border max-w-[350px] w-full "> 
                <div className="mt-3 flex gap-3 justify-center items-center">
                    <button className="p-2 w-24 border rounded-md bg-white shadow-md cursor-pointer text-center bg-blue-500 text-white" onClick={()=>setShowModal({...showModal, showResult:true})}>RANK</button>
                    <button className="p-2 w-24 border rounded-md bg-white shadow-md cursor-pointer text-center bg-orange-400 text-white" onClick={()=>setShowModal({...showModal, showImport:true})}>IMPORT</button>   
                    <button className="p-2 w-24 border rounded-md bg-white shadow-md cursor-pointer text-center bg-red-500 text-white" onClick={()=>DeleteAllTables()}>CLEAR</button>
                </div>
                <div className="mt-5 font-bold">
                    <Select items={stageServer} label="Stages" getValue={(value)=>{getStageList(value);}} currentSelect={currentStage?.id}/> 
                </div>
                <div className="mt-5 font-bold">
                    <Select items={categoryServer} label="Category" getValue={value=>setCurrentCategory(value)} currentSelect={currentCategory}/>
                </div>
                <div className="mx-2 relative overflow-y-auto h-[70vh]">
                    {filterCategory(currentCategory)?.map((item,index)=>{
                        return(
                            <div key={index} className={!jsonParserStatus(item.status,StatusRider.FINISHED) ? "line-through w-full shadow-md text-red-500 font-bold" : "no-underline w-full font-medium shadow-md"}>
                                <div className="flex border py-1 mb-1 px-1 rounded-md justify-between">
                                    <div className="col-span-5 ml-3"> 
                                        <div className={!jsonParserStatus(item.status,StatusRider.FINISHED) ? "line-through text-red-500 font-bold" : "no-underline font-bold"}>#{item.number} {getStatusStage(item.status)}</div>
                                        <div className="text-xs">{item.name}</div>
                                    </div>
                                    <div className="flex justify-end gap-3 items-center">
                                        {/* disabled={jsonParserStatus(item.status,StatusRider.WAITING)} */}
                                        {
                                            !jsonParserStatus(item.status,StatusRider.WAITING) && 
                                            <button className="cursor-pointer" onClick={()=>addRunner(item , StatusRider.ONBOARD,currentStage)}>
                                                <ButtonIcon title="Start" Icon={<AddUser/>}></ButtonIcon>
                                            </button> 
                                        }
                                        <div className="cursor-pointer" onClick={()=>{setShowModal({...showModal, showDelete:true,showNavBar:false}); idRider.current = item.id;}}>
                                            <ButtonIcon title="Start" Icon={<Trash/>}></ButtonIcon>
                                        </div>
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
        <div className="bottom-0 fixed bg-white w-full h-[60px] grid grid-cols-10 border-2">
            <button className="col-span-2 flex justify-center items-center flex-col text-xs" onClick={()=>setShowModal({...showModal, showCategory:true})}><Category/><div>Category</div></button>
            <button className="col-span-2 flex justify-center items-center flex-col text-xs" onClick={()=>setShowModal({...showModal, showAddRider:true})}><AddUser/><div>Participants</div></button>
            <button className="col-span-2 flex justify-center items-center flex-col text-xs" onClick={()=>setShowModal({...showModal, showResult:true,showNavBar:false})}><Trophy/><div>Result</div></button>
            <button className="col-span-2 flex justify-center items-center flex-col text-xs"  onClick={()=>setShowModal({...showModal, showStages:true})}><Stage/><div>Stage</div></button>
            {isPageWide ? <Link to="/participants" className="col-span-2 flex justify-center items-center flex-col text-xs"><Setting/><div>Setting</div></Link> : 
                <button onClick={()=>setShowModal({...showModal, showNavBar:true})} className="col-span-2 flex justify-center items-center flex-col text-xs" ><Menu/><div>Menu</div></button>
            }
            
        </div>
    </>);
};

export default MainPage;
