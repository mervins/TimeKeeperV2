
import Sidebar from "../../components/Layout/Sidebar";
import React,{useState,useEffect,useMemo,useContext} from "react";
import CategoryContrller from "../../data/categoryController";
import TableContainer from "../../components/Table/TableContainer";
import Table from "../../components/Table/Table";
import TableBody from "../../components/Table/TableBody";
import TableHead from "../../components/Table/TableHead";
import TableCell from "../../components/Table/TableCell";
import Riders from "../../data/ridersController";
import Select from "../../UI/Select";
import { nameCustomize } from "../../util/helper";
import StageController from "../../data/stageController";
import { TotalTime } from "../../data/stagesController";
import Stages from "../../data/stagesController";
import NumberToTime from "../../components/NumberToTime";
import { ButtonIcon } from "../../components/Button";
import { Cycle } from "../../components/Icons/Icons";
import { useDialogHook } from "../../util/customehooks";
import DeleteStageRun from "../../components/Modal/Delete/DeleteStageRun";
import { TimerContext } from "../../context/TimerContext";
import PenaltyRider from "../../components/Modal/General/PenaltyRider";

const Results = ()=>{
    let categoryServer = CategoryContrller();
    let ridersParticipants = Riders();
    let stageServer = StageController();
    const [catID, setCatID] = useState(null);
    let stagesFinished = Stages(); 
    let headers = ["Top","Race #","Name"];
    const [currentStage,setCurrentStage] = useState(null); 
    const reRun = useDialogHook(DeleteStageRun);
    const penaltyDialog = useDialogHook(PenaltyRider);
    const {showToast} = useContext(TimerContext);

    const reRunHandler = (stage) => {
        reRun({stage:stage},(callback)=>{
            if(callback.success){
                showToast("success","Participant Run Again","Successfully");
            }
            
        });
    };
    
    useEffect(() => {
        if (typeof categoryServer != "undefined") { 
            setCatID(categoryServer[0]); 
            console.log(catID);
        }
    }, [categoryServer]);
    React.useEffect(() => {
        if (typeof stageServer != "undefined") { 
            setCurrentStage(stageServer[0]?.id);
            console.log(stageServer);
        }
    }, [stageServer]);

    const penaltyHandler = (item)=>{
        console.log(item);
        penaltyDialog({stageServer:item.stages},(callback)=>{
            if(callback.success){
                showToast("success","Participant Penalty","Successfully");
            }
        });
    };


    const filteringCagtegory = useMemo(() => categoryServer ? 
        TotalTime(ridersParticipants,stagesFinished,catID?.id,currentStage) 
        : [],
    [catID?.id,currentStage,stagesFinished]);  
    return (<>
        <Sidebar>
            <div>
                <div className="border-b border-slate-400">
                    <div className="p-4 font-bold text-xl text-yellow-600">
                        Results
                    </div> 
                </div>
                <div className="bg-white rounded-md m-0 2md:m-4 h-[88vh] overflow-y-auto">
                    <div className="m-2 mx-0 sm:m-4 sm:mx-10 relative flex justify-between flex-wrap items-center">
                        <div>
                            <div className="hidden md:inline flex border rounded-xl overflow-hidden bg-white border-[#d8d8d8] items-center py-3 px-1">
                                {categoryServer && categoryServer?.map((cat) => (
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
                        </div>
                        <Select className="inline md:hidden" items={categoryServer} label="Category" getValue={value=>setCatID(parseInt(value))} currentSelect={catID?.id}/>
                        <div className="w-full sm:w-64">
                            <Select items={stageServer} label="Ranking" getValue={(value)=>{setCurrentStage(value);}} currentSelect={currentStage}/> 

                        </div>
                    </div>
                    <div className="text-[8px] md:text-base px-1">  
                        <div className='text-gray-600'>
                            <TableContainer> 
                                <Table>
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {
                                                headers?.map((header,key)=>{
                                                    return(
                                                        <TableHead key={key} className="text-center">
                                                            {header}
                                                        </TableHead> 
                                                    );
                                                })
                                            }
                                            <TableHead className="text-center hidden sm:inline">
                                                Category
                                            </TableHead> 
                                            {
                                                stageServer?.map((stage,key)=>{
                                                    return(
                                                        <TableHead key={key} className="text-center">
                                                            {stage.name}
                                                        </TableHead> 
                                                    );
                                                })
                                            }
                                            <TableHead className="text-center hidden sm:inline">
                                                Action
                                            </TableHead> 
                                        </tr>
                                    </thead>
                                    <TableBody> 
                                        {
                                            filteringCagtegory?.map((result,key)=>{
                                                return(
                                                    <tr className='hover:bg-gray-200' key={key}>
                                                        <TableCell className={`py-2 px-2 text-[16px] text-center  ${key < 11 ? "text-orange-400" : "text-black"}`}>
                                                            {key+1}
                                                        </TableCell>  
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
                                                        <TableCell className="py-2 px-2 text-[12px] text-black text-center hidden sm:flex items-center">
                                                            {catID?.name || ""}
                                                        </TableCell> 
                                                        {
                                                            stageServer?.map((serverStg,ind)=>{
                                                                return <TableCell key={ind} className="py-2 px-2 text-[12px] text-center">
                                                                    {
                                                                        result?.stages?.map((stage,key)=>{
                                                                            return(
                                                                                <> 
                                                                                    {
                                                                                        serverStg.id === stage.stage_id &&
                                                                                            <div className="flex gap-4 items-center justify-center">
                                                                                                <NumberToTime key={key} stages={stage}/>
                                                                                                <div className="text-red-500 cursor-pointer" onClick={()=>reRunHandler(stage)}><ButtonIcon title="End" Icon={<Cycle/>}></ButtonIcon></div>
                                                                                            </div>
                                                                                    }
                                                                                    
                                                                                </>
                                                                            );
                                                                        })
                                                                    }
                                                                </TableCell>;
                                                            })
                                                        }

                                                        <TableCell className="py-2 px-2 text-[12px] text-black text-center hidden sm:inline">
                                                            <button className="p-2 border rounded-md shadow-md cursor-pointer bg-red-500 text-white text-xs" onClick={()=>penaltyHandler(result)}>
                                                                Penalty
                                                            </button>
                                                        </TableCell> 
                                                
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

export default Results;