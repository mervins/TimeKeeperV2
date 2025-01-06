
import Sidebar from "../../components/Layout/Sidebar";
import React,{useState,useEffect,useContext} from "react";
import CategoryContrller from "../../data/categoryController";
import TableContainer from "../../components/Table/TableContainer";
import Table from "../../components/Table/Table";
import TableBody from "../../components/Table/TableBody";
import TableHead from "../../components/Table/TableHead";
import TableCell from "../../components/Table/TableCell";
import Riders,{timeReleaseStage} from "../../data/ridersController";
import ParticipantsModal from "../../components/Modal/Create/Participants";
import { useDialogHook } from "../../util/customehooks";
import { FaRegTrashAlt,FaPen  } from "react-icons/fa";
import Select from "../../UI/Select";
import UpdateParticipants from "../../components/Modal/Update/UpdateParticipants";
import DeleteModal from "../../components/Modal/Delete/DeleteParticipants";
import { nameCustomize } from "../../util/helper";
import { TimerContext } from "../../context/TimerContext";
import StageController from "../../data/stageController";
import { GetStage } from "../../data/stageController";
import { DateDisplay } from "../../util/helper";

const Participants = ()=>{
    let categoryServer = CategoryContrller();
    let ridersParticipants = Riders();
    const [catID, setCatID] = useState(null);  
    // eslint-disable-next-line no-unused-vars
    const [participant, setParticipant] = useState({});
    const {showToast} = useContext(TimerContext);
    let stageServer = StageController();
    const [releaseTime, setReleaseTime] = useState(""); // Initial release time (HH:mm format)
    const [interval, setIntervalTime] = useState(30);
    const [currentStage,setCurrentStage] = useState();

    const createParticipants = useDialogHook(ParticipantsModal);
    const editParticipans = useDialogHook(UpdateParticipants);
    const deleteDialog = useDialogHook(DeleteModal);
    useEffect(() => {
        if (typeof categoryServer != "undefined") { 
            setCatID(categoryServer[0]); 
            console.log(catID);
        }
    }, [categoryServer]);

    useEffect(() => {
        console.log(stageServer);
        if (typeof stageServer != "undefined") { 
            setCurrentStage(stageServer[0]);
            console.log(stageServer);
        }

    }, [stageServer]);

    const createHandle = ()=>{
        createParticipants({ riders:ridersParticipants, categoryServer }, (callback) => {
            if(callback?.success){
                showToast("success","Riders Saved","Successfully");
            }
        });
    };

    const editHandler = (item)=>{
        setParticipant(item);
        editParticipans({ riders:ridersParticipants, categoryServer,participant:item }, (callback) => {
            if(callback?.success){
                showToast("success","Participant Saved","Successfully");
            }
        });
        
    };

    const confirmDelet = (rider)=>{
        deleteDialog({rider:rider},(callback)=>{
            if(callback.success){
                showToast("success","Participant Deleted","Successfully");
            }
        });
    };

    const handleIntervalChange = (e) => {
        setIntervalTime(Number(e.target.value));
    };
    const setStartTimeRider = ()=>{
        if (!releaseTime) {
            alert("Please select a start time for the first rider.");
            return;
        }
        console.log(catID);
        timeReleaseStage(releaseTime, interval,parseInt(currentStage.id),parseInt(catID.id));
    };

    let getStageList = async(id)=>{
        let detailStage = await GetStage(parseInt(id));
        setCurrentStage(detailStage);
        return detailStage;
    };

    return (<>
        <Sidebar>
            <div>
                <div className="border-b border-slate-400">
                    <div className="p-4 font-bold text-xl text-yellow-600">
                        Participants
                    </div> 
                </div>
                <div className="bg-white rounded-md m-0 2md:m-4 h-[88vh] overflow-y-auto">
                    <div className="m-2 mx-0 sm:m-4 sm:mx-10 relative flex justify-between flex-wrap">
                        <div className="hidden md:inline flex border rounded-xl overflow-hidden bg-white border-[#d8d8d8] py-1 px-1">
                            {categoryServer && categoryServer.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setCatID(cat)}
                                    className={`px-4 py-2 font-medium transition-colors duration-200 capitalize rounded-xl text-xs font-bold ${
                                        catID?.id === cat.id
                                            ? "bg-[#deeeff] text-[#0d6ed1] "
                                            : "text-[#bababa] hover:text-[#0d6ed1]"
                                    }`}
                                >
                                    <div className="font-bold">{cat.name} </div>
                                </button>
                            ))}
                        </div>
                        <Select className="inline md:hidden" items={categoryServer} label="Category" getValue={value=>setCatID(parseInt(value))} currentSelect={catID?.id}/>
                        <div>
                            <button className="bg-[#0d6ed1] text-white py-2 px-4 p-2 border rounded-lg text-xs font-bold " onClick={createHandle}>
                                Add Participant
                            </button>
                        </div> 
                    </div>
                    <div className="flex border m-1 p-1 rounded-md gap-2 items-center flex-col sm:flex-row">
                        <div className="flex items-center gap-2">
                            <div className="hidden sm:inline">
                                Release Time
                            </div>
                            <div>
                                <input className="truncate block py-2.5 px-0 text-sm text-gray-900 bg-transparent focus:border-blue-600 border appearance-none focus:outline-none focus:ring-0 peer rounded-lg px-[15px] disabled:cursor-not-allowed"
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
                        <div className="flex gap-2">
                            <Select items={stageServer} label="Stages" getValue={(value)=>{getStageList(value);}} currentSelect={currentStage?.id}/> 

                            <button className="bg-[#0d6ed1] text-white py-2 px-4 p-2 border rounded-lg text-xs font-bold w-32" onClick={setStartTimeRider}>Set</button>
                        </div>
                    </div>
                    <div className="text-[8px] md:text-base px-1">  
                        <div className='text-gray-600'>
                            <TableContainer> 
                                <Table>
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {
                                                ["Race #","Name", "Category", "Action"].map((header,key)=>{
                                                    return(
                                                        <TableHead key={key} className="text-center">
                                                            {header}
                                                        </TableHead> 
                                                    );
                                                })
                                            }
                                            {
                                                stageServer?.map((stage,ind)=>{
                                                    return <TableHead key={ind} className="text-center">
                                                        {stage.name}
                                                    </TableHead> ;
                                                })
                                            }
                                        </tr>
                                    </thead>
                                    <TableBody> 
                                        {
                                            
                                            ridersParticipants?.filter(parti => parti.category_id === (catID?.id || catID)).map((result,key)=>{
                                                return(
                                                    <tr className='hover:bg-gray-200' key={key}> 
                                                        <TableCell className="py-2 px-2 text-[12px] text-black text-center">
                                                            {result.number}
                                                        </TableCell>  
                                                        <TableCell className="py-2 px-2 text-[12px] text-black text-center">
                                                            <span className="hidden sm:inline">
                                                                {result.name}
                                                            </span>
                                                            <span className="inline sm:hidden">
                                                                {nameCustomize(result.name)} 
                                                            </span>
                                                        </TableCell>  
                                                        <TableCell className="py-2 px-2 text-[12px] text-black text-center">
                                                            {catID?.name}
                                                        </TableCell> 
                                                        <TableCell className="py-2 px-2 text-[12px] text-black text-center flex justify-center gap-4">
                                                            <button className="text-base" onClick={()=>editHandler(result)}>
                                                                <FaPen />
                                                            </button>
                                                            <button className="text-base text-red-500" onClick={()=>confirmDelet(result)}>
                                                                <FaRegTrashAlt/>
                                                            </button>
                                                        </TableCell>
                                                        {
                                                            stageServer?.map((serverStg,ind)=>{
                                                                return <TableCell key={ind} className="py-2 px-2 text-[12px] text-center">
                                                                    {
                                                                        result?.status?.map((stage,key)=>{
                                                                            return(
                                                                                <> 
                                                                                    {
                                                                                        serverStg.id === stage.stage_id &&
                                                                                            <div key={key} className="flex gap-4 items-center justify-center">
                                                                                                {/* <NumberToTime key={key} stages={stage}/> */}
                                                                                                <div className="font-bold cursor-pointer" >{DateDisplay(stage.start_time)}</div>
                                                                                            </div>
                                                                                    }
                                                                                    
                                                                                </>
                                                                            );
                                                                        })
                                                                    }
                                                                </TableCell>;
                                                            })
                                                        }
                                                    </tr> 
                                                );
                                            })
                                        }
                                    </TableBody>
                                </Table>  
                            </TableContainer>
                        </div>
                    </div>
                </div>
            </div>
        </Sidebar>
    </>);
};

export default Participants;