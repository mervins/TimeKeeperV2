
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
import PastilNiBabo from "../../assets/pastilNiBabo.png";
import Adlai from "../../assets/adlai.png";
import RunningBikee from "../../assets/runningBike.gif";
import { FaMedal,FaTrophy  } from "react-icons/fa";
// import Misty from "../../assets/misty.png";
import "./newTabResult.css";

const NewTabResults = ()=>{
    let categoryServer = CategoryContrller();
    let ridersParticipants = Riders();
    let stageServer = StageController();
    const [catID, setCatID] = useState(null);
    let stagesFinished = Stages(); 
    let headers = ["Top","Race #","Name"];
    const [currentStage,setCurrentStage] = useState(null); 

    const sponsored = [1,2,3,4];
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
        <div className="bg-[#ebefea]">
            <div className="relative border-b border-slate-400 flex items-center marquee-container">
                <div className=" flex items-center marquee">
                    <img className="w-40" src={RunningBikee} />
                    <div className="p-4 font-bold text-xl text-yellow-600">
                        Live Results
                    </div>
                    <div className="font-bold text-xl">
                        Powered by:
                    </div> 
                    {
                        sponsored.map((item,indx)=>{
                            return <div key={indx} className="relative flex items-center gap-1 bg-white">
                                
                                <div>
                                    <img className="w-full" src={Adlai}/>
                                </div> 
                                <dv className="flex">
                                    <img className="h-10/12" src={PastilNiBabo}/>
                                </dv>
                            </div>;
                        })
                    }
                    <div className="p-4 font-bold text-xl text-yellow-600">
                        Live Results
                    </div> 
                    <img className="w-40" src={RunningBikee} />
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
                                        className={`px-4 py-2 font-medium transition-colors duration-200 capitalize rounded-xl text-xs font-bold text-[20px] ${
                                            catID?.id === cat.id
                                                ? "bg-[#103754] text-white "
                                                : "text-[#5f5f5f] hover:text-[#103754]"
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
                                        <TableHead className="text-center hidden sm:inline">
                                            Time Diff
                                        </TableHead> 
                                    </tr>
                                </thead>
                                <TableBody> 
                                    {
                                        filteringCagtegory?.map((result,key)=>{
                                            return(
                                                <tr className='hover:bg-gray-200' key={key}>
                                                    <TableCell className={`py-2 px-2 text-[16px] text-center  ${key < 10 ? "bg-[#103754] font-bold text-white" : "text-black"}`}>
                                                       
                                                        <div className="flex gap-2 items-center">
                                                            {
                                                                (key > 2 && key < 10) && 
                                                                <FaMedal/>
                                                            }
                                                            {
                                                                (key >= 0 && key < 3) && 
                                                                <div className={
                                                                    key === 0 ? "text-[#ffcc11]" :
                                                                        key === 1 ? "text-[#a5b8b6]" : "text-[#cb8758]"
                                                                }>
                                                                    <FaTrophy/>
                                                                </div>
                                                            }
                                                            <div>{key+1}</div>
                                                            
                                                        </div>
                                                    </TableCell>  
                                                    <TableCell className={`py-2 px-2 text-[16px] text-black text-center ${key < 10 ? "bg-[#103754] font-bold text-white" : "text-black"}`}>
                                                        {result.number}
                                                    </TableCell>  
                                                    <TableCell className={`py-2 px-2 text-[16px] text-black text-center ${key < 10 ? "bg-[#103754] font-bold text-white" : "text-black"}`}>
                                                        <span className="hidden sm:inline">
                                                            {result.name}
                                                        </span>
                                                        <span className="inline sm:hidden">
                                                            {nameCustomize(result.name)} 
                                                        </span>
                                                    </TableCell>  
                                                    <TableCell className={` py-2 px-2 text-[16px] text-black text-center hidden sm:flex items-center ${key < 10 ? "bg-[#103754] font-bold text-white" : "text-black"}`}>
                                                        {catID?.name || ""}
                                                    </TableCell> 
                                                    {
                                                        stageServer?.map((serverStg,ind)=>{
                                                            return <TableCell key={ind} className={`py-2 px-2 text-[16px] text-center ${key < 10 ? "bg-[#103754] font-bold text-[#FB7E00]" : "text-black"}`}>
                                                                {
                                                                    result?.stages?.map((stage,keyTage)=>{
                                                                        return(
                                                                            <> 
                                                                                {
                                                                                    serverStg.id === stage.stage_id &&
                                                                                        <NumberToTime key={keyTage} stages={stage}/>
                                                                                }
                                                                                
                                                                            </>
                                                                        );
                                                                    })
                                                                }
                                                            </TableCell>;
                                                        })
                                                    }

                                                    <TableCell className={`py-2 px-2 text-[16px] text-center ${key < 10 ? "bg-[#103754] font-bold text-[#FB7E00]" : "text-black"}`}>
                                                        {
                                                            result?.stages?.map((stage,keyTage)=>{
                                                                return(
                                                                    <> 
                                                                        {
                                                                            stage.stage_id === parseInt(currentStage) &&
                                                                                <div className="flex items-center gap-1">
                                                                                    {   key > 0 &&
                                                                                        <div key={keyTage} className={` text-xs font-semibold ${key < 10 ? "bg-[#103754] font-bold text-white" : "text-black"}`}>
                                                                                            <NumberToTime key={keyTage} stages={{
                                                                                                totalTime: Math.abs(filteringCagtegory[key-1]?.stages[keyTage]?.totalTime - filteringCagtegory[key]?.stages[keyTage]?.totalTime)
                                                                                            } }/>
                                                                                            {
                                                                                                console.log(`${filteringCagtegory[key-1]?.stages[keyTage]?.totalTime} - ${filteringCagtegory[key]?.stages[keyTage]?.totalTime}`)
                                                                                            }
                                                                                        </div>
                                                                                    }
                                                                                </div>
                                                                        }
                                                                        
                                                                    </>
                                                                );
                                                            })
                                                        }
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
    </>);
};

export default NewTabResults;