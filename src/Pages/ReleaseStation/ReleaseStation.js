import { useState,useEffect,useRef,useContext } from "react";
// import ReleaseItem from "../../components/Card/ReleaseItem";
import { Close, AddUser, Trash } from "../../components/Icons/Icons";
import { StatusRider } from "../../data/DummyData";
import Riders, { UpdateRider, onboardDisplay,updateTimeRelease } from "../../data/ridersController";
import { useMediaQuery } from "../../Hooks/useMediaQuery";
import { ButtonIcon } from "../../components/Button";
import Mobile from "../Device/Mobile";
import Select from "../../UI/Select";
import StageController, {GetStage} from "../../data/stageController";
import CategoryContrller from "../../data/categoryController";
// import { Link } from "react-router-dom";
import { TimerContext } from "../../context/TimerContext";
import { useDialogHook } from "../../util/customehooks";
import GoToDashboard from "../../components/Modal/General/LeaveTimer";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
// import mainLogo from "../assets/logo.png";
import { FcSelfServiceKiosk } from "react-icons/fc";
import ReleaseItem from "../../components/Card/ReleaseItem";
import Clock from "react-live-clock"; 
import { DateDisplay } from "../../util/helper";
import { Setting,Menu } from "../../components/Icons/Icons";

const ReleaseStation = ()=>{  
    let categoryServer = CategoryContrller();
    let stageServer = StageController();  
    let dashboardDialog = useDialogHook(GoToDashboard);
    let {showToast,prepareToStop,toggleCard,positionId} = useContext(TimerContext);
    const [currentCategory,setCurrentCategory] = useState([]);
    const [currentStage,setCurrentStage] = useState();
    const [display,setDisplay] = useState([]);
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
    const [releaseTime, setReleaseTime] = useState(""); // Initial release time (HH:mm format)
    const [interval, setIntervalTime] = useState(30);
    // const [isRunning, setIsRunning] = useState(false);
    let idRider = useRef();
    const closeThreshold = 10;
    let ridersParticipants = Riders();
    let onboardRiderDisplay = onboardDisplay();
    let isPageWide = useMediaQuery("(min-width: 900px)"); 

    const history = useHistory();
    const goToDashClick = () => {
        history.push("/participants");
    };

    const setStartTimeRider = ()=>{
        if (!releaseTime) {
            alert("Please select a start time for the first rider.");
            return;
        }
        updateTimeRelease(releaseTime, interval);
    };
    
    // let statusDis = [StatusRider.ONBOARD, StatusRider.RERUN,StatusRider.TOUCHDOWN,StatusRider.RUNNING];
    useEffect(()=>{
        if(ridersParticipants){
            const onboardIndices = onboardRiderDisplay?.map(item => item.index); 
            console.log("DISPLAY");
            let onboradRider = ridersParticipants?.filter(item => onboardIndices?.includes(item.id)) // Filter riders
                .map((item) => ({
                    ...item,
                    // start_time: onboardRiderDisplay[index]?.startTime // Add start_time
                    start_time: item?.status.find(stage => stage.stage_id === parseInt(currentStage?.id))?.start_time || null // Add start_time

                }));
            console.log(onboradRider);
            
            onboradRider.sort((a, b) => {
                const indexA = onboardIndices.indexOf(a.id);
                const indexB = onboardIndices.indexOf(b.id);
                return indexA - indexB;
            });
            setDisplay(onboradRider);
        }
    },[ridersParticipants,onboardRiderDisplay]);

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
    

    const addRunner = async(details,status,stage)=>{ 
        // console.log("=========Stage==============");
        let detailStage = await GetStage(parseInt(stage.id));
        // console.log(detailStage);
        UpdateRider(details, status,detailStage);
    };

    const removeRunner = async(details,status)=>{  
        let detailStage = await GetStage(parseInt(currentStage.id));
        UpdateRider(details, status,detailStage);  
    };
 
    const filterCategory = (category) =>{ 
        // console.log("============CATEGORY======================");
        return ridersParticipants?.filter(item => item.category_id === parseInt(category));
    };
    
    const jsonParserStatus = (stages,status) =>{
        // console.log(stages);
        let getStage = stages.filter(stage => stage.stage == currentStage?.name); 
        return getStage[0]?.status != status; 
    };

    // const DeleteAllTables = ()=>{
    //     let text = "Click OK to delete all datas?";
    //     if (confirm(text) == true) {
    //         text = "You pressed OK!"; 
    //         DeleteAllRiders();
    //         DeleteAllStages();
    //     } else {
    //         text = "You canceled!";
    //     }
    // };

    let getStatusStage = (stages)=>{ 
        let stage = stages.filter(stage=> stage.stage == currentStage?.name);  
        return stage[0]?.status;
    };

    let getStageList = async(id)=>{
        let detailStage = await GetStage(parseInt(id));
        setCurrentStage(detailStage);
        return detailStage;
    };

    const goToDash = ()=>{
        dashboardDialog({goToDash:goToDashClick}).then(callback =>{
            if(callback.success){
                showToast("Redirect");
            }
        });
    };

    const handleIntervalChange = (e) => {
        setIntervalTime(Number(e.target.value));
    };
    return (<div className="w-full flex flex-col"> 
        <div className="bg-white flex justify-center sm:justify-between">
            <div className="relative w-32 p-4 hidden sm:inline">
                {/* <img src={mainLogo}/> */}
            </div>
            <div className="flex border m-1 p-1 rounded-md gap-2 items-center flex-col sm:flex-row">
                <div className="flex items-center gap-2">
                    <div className="hidden sm:inline">
                        Release Time
                    </div>
                    <div>
                        <input className="truncate block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent focus:border-blue-600 border appearance-none focus:outline-none focus:ring-0 peer rounded-lg px-[15px] disabled:cursor-not-allowed"
                            type="datetime-local" value={releaseTime} onChange={(e) => setReleaseTime(e.target.value)}/>
                    </div>
                    <div>
                        <label>
                            <div className="hidden sm:inline">Interval</div>
                            <select value={interval} onChange={handleIntervalChange}>
                                <option value={30}>30 sec</option>
                                <option value={60}>1 min</option>
                                <option value={90}>1 min 30 sec</option>
                                <option value={150}>2 min 30 sec</option>
                            </select>
                        </label>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="bg-[#0d6ed1] text-white py-2 px-4 p-2 border rounded-lg text-xs font-bold w-32" onClick={setStartTimeRider}>Set</button>
                    <h1 className='font-bold py-2'><Clock format="h:mm:ss A" ticking={true} timezone="Asia/Manila" /></h1>

                </div>
            </div>
            <div className="bg-white h-[60px] hidden sm:flex space-x-8 text-black pr-8 font-semibold ">
                {isPageWide ? <div className="col-span-2 flex justify-center items-center flex-col cursor-pointer" onClick={goToDash}><div>Dashboard</div></div> : 
                    <button onClick={()=>setShowModal({...showModal, showNavBar:true})} className="col-span-2 flex justify-center items-center flex-col text-xs" ><div>Menu</div></button>
                }
                
            </div>
        </div>
        <Mobile 
            currentCategory={currentCategory} 
            currentStage={currentStage} 
            setCurrentCategory={setCurrentCategory} 
            setCurrentStage={setCurrentStage} 
            setShowModal={setShowModal} 
            ridersParticipants={ridersParticipants} 
            addRunner={addRunner} 
            // DeleteAllTables={DeleteAllTables}
            StatusRider={StatusRider} 
            idRider={idRider} 
            showModal={showModal} 
            stageServer={stageServer} 
            categoryServer={categoryServer}></Mobile> 
        <div className="relative h-[95vh] flex w-full mt-1">   
          

            <div className="border grow p-1 overflow-y-auto h-[95vh] bg-[#E4E9F2]">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap gap-4 mt-4">
                        {
                            display?.map((item)=>{
                                // const isClose = item.remainingTime <= closeThreshold && item.remainingTime > 0;
                                return(
                                    <div key={item.id} className={(jsonParserStatus(item.status,StatusRider.WAITING) && jsonParserStatus(item.status,StatusRider.FINISHED)) ? "relative w-full sm:w-auto" : "relative w-full sm:w-auto"}>
                                        <button className="absolute z-20 -top-1 -left-2 bg-red-500 rounded-full text-white cursor-pointer" onClick={()=>removeRunner(item,StatusRider.WAITING)}> <Close/></button>
                                      
                                        {
                                            !jsonParserStatus(item.status,StatusRider.RUNNING) &&
                                            <button className="absolute z-20 top-3 right-[62%] rounded-full text-white cursor-pointer text-2xl flex items-center gap-1"
                                                onClick={()=>toggleCard(item.id)}> <FcSelfServiceKiosk /> <span className="text-rose-500 text-sm font-bold">{positionId(item.id)}</span></button>
                                        }
                                        <div className={`
                                            ${(jsonParserStatus(item.status,StatusRider.RUNNING)) ? "" : "shadow-xl shadow-lg shadow-indigo-500/50 border-2 border-blue-500 rounded-md"}
                                            ${prepareToStop.includes(item.id) && (!jsonParserStatus(item.status,StatusRider.RUNNING)) ? "border-2 border-rose-500 rounded-md" : ""}`}> 
                                            <ReleaseItem prepareToStop={prepareToStop} 
                                                toggleCard={toggleCard}
                                                item={{...item,stage:currentStage}} 
                                                showWarning={()=>setShowModal({...showModal, showRerun:true})} 
                                                messageToast={()=>{showToast("success","The record of the rider has been saved","Successfully");}}
                                                closeThreshold={closeThreshold}
                                            ></ReleaseItem>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div> 
                </div>
            </div>
            {isPageWide && <div className="border max-w-[350px] w-full "> 
                <div className="mt-3 flex gap-3 justify-center items-center">
                </div>
                <div className="mt-5 font-bold">
                    <Select items={stageServer} label="Stages" getValue={(value)=>{getStageList(value);}} currentSelect={currentStage?.id}/> 
                </div>
                <div className="mt-5 font-bold">
                    <Select items={categoryServer} label="Category" getValue={value=>setCurrentCategory(value)} currentSelect={currentCategory}/>
                </div>
                <div className="mx-2 relative overflow-y-auto h-[70vh]">
                    {filterCategory(currentCategory)?.map((item)=>{
                        const dateDis = DateDisplay(item.status.find(stage => stage.stage_id === parseInt(currentStage?.id))?.start_time || null);
                        
                        return(
                            <div key={item.id} className={!jsonParserStatus(item.status,StatusRider.FINISHED) ? "line-through w-full shadow-md text-red-500 font-bold" : "no-underline w-full font-medium shadow-md"}>
                                <div className="flex border py-1 mb-1 px-1 rounded-md justify-between">
                                    <div className="col-span-5 ml-3"> 
                                        <div className={!jsonParserStatus(item.status,StatusRider.FINISHED) ? "line-through text-red-500 font-bold" : "no-underline font-bold"}>#{item.number} {getStatusStage(item.status)}</div>
                                        <div className="text-xs flex gap-2">
                                            <div>{item.name}</div>
                                            <div>Start Time: {dateDis}</div>
                                        </div>
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
        <div className="bottom-0 fixed bg-white w-full h-[60px] grid sm:hidden grid-cols-10 border-2">
            {isPageWide ? <div className="col-span-2 flex justify-center items-center flex-col text-xs cursor-pointer" onClick={goToDash}><Setting/><div>Dashboard</div></div> : 
                <button onClick={()=>setShowModal({...showModal, showNavBar:true})} className="col-span-2 flex justify-center items-center flex-col text-xs" ><Menu/><div>Menu</div></button>
            }
            
        </div>
    </div>);
};

export default ReleaseStation;
