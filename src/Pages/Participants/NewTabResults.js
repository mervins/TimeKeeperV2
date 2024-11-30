
import React,{useState,useEffect,useMemo} from "react";
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

const NewTabResults = ()=>{
    let categoryServer = CategoryContrller();
    let ridersParticipants = Riders();
    let stageServer = StageController();
    const [catID, setCatID] = useState(null);
    let stagesFinished = Stages(); 
    let headers = ["Top","Race #","Name"];
    const [currentStage,setCurrentStage] = useState(null); 

    
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


    const filteringCagtegory = useMemo(() => categoryServer ? 
        TotalTime(ridersParticipants,stagesFinished,catID?.id,currentStage) 
        : [],
    [catID?.id,currentStage,stagesFinished]);  
    return (<>
        <div>
            <div className="border-b border-slate-400">
                <div className="p-4 font-bold text-xl text-yellow-600">
                    Live Results
                </div> 
            </div>
            <div className="bg-white rounded-md m-0 2md:m-4 h-[88vh] overflow-y-auto">
                <div className="container mx-auto">
                    <div className=" my-4 relative flex justify-between flex-wrap items-center ">
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
                                                    <TableCell className="py-2 px-2 text-[12px] text-black text-center hidden sm:inline">
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
                                                                                        <NumberToTime key={key} stages={stage}/>
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
    </>);
};

export default NewTabResults;