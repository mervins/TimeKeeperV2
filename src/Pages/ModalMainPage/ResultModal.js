import React, {useState,useMemo,useRef} from "react";
import { TotalTime,AddMutipleRiderFinished } from "../../data/stagesController"; 
import NumberToTime from "../../components/NumberToTime";
import { utils, writeFile,read } from "xlsx";
import { Close } from "../../components/Icons/Icons";
import Modal from "../../components/Modal/Modal"; 
import Select from "../../UI/Select";
import CategoryContrller from "../../data/categoryController";
import { GetStage } from "../../data/stageController";
import TableContainer from "../../components/Table/TableContainer";
import Table from "../../components/Table/Table";
import TableBody from "../../components/Table/TableBody";
import TableHead from "../../components/Table/TableHead";
import TableCell from "../../components/Table/TableCell";

const ResultModal = (props)=>{
    
    let categoryServer = CategoryContrller();
    const {ridersParticipants,stagesFinished,stageServer} = props;
    const [currentCategory,setCurrentCategory] = useState(null); 
    const [summary, setSumamry] = useState(false);
    const [currentStage,setCurrentStage] = useState(null); 
    const [catDetails,setCatDetails] = useState(null); 
    const riderDetails = useRef({
        name:"",
        stages:[],
        number:null
    });
    const header = ["Top","Race #","Name","Category"];
    React.useEffect(() => {
        if (typeof categoryServer != "undefined") { 
            setCurrentCategory(categoryServer[0]?.id);
            setCatDetails(categoryServer[0]);
        }
    }, [categoryServer]);

    React.useEffect(() => {
        if (typeof stageServer != "undefined") { 
            setCurrentStage(stageServer[0]?.id);
            console.log(stageServer);
        }
    }, [stageServer]);

    console.time("filter array");
    const filteringCagtegory = useMemo(() => currentCategory ? 
        TotalTime(ridersParticipants,stagesFinished,currentCategory,stageServer,currentStage) 
        : [],
    [currentCategory,currentStage]);  
    console.timeEnd("filter array");
    
    const handleExport = () => {
        const headings = [[
            "rider_id",
            "stage",
            "startTime", 
            "finishedTime", 
            "totalTime", 
        ]];
        let arrangeExportData = stagesFinished.map(count => Object.assign(
            {   rider_id:count.rider_id, 
                stage:count.stage, 
                startTime:count.startTime,
                finishedTime:count.finishedTime,  
                totalTime: count.totalTime, 
            }));
        const wb = utils.book_new();
        const ws = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws, headings);
        utils.sheet_add_json(ws, arrangeExportData, { origin: "A2", skipHeader: true });
        utils.book_append_sheet(wb, ws, "Riders");
        writeFile(wb, "Riders.xlsx");
    };

    const handlerResult = ()=>{
        const headings = [[
            "Rank",
            "Number", 
            "Name",
            "Stage 1", 
            "Stage 2", 
            "Stage 3",
            "Total Time" 
        ]];
        
        const wb = utils.book_new();
        let cat = ["19 below","20-29","30-39","40 up","Executive","Ladies"]; 
        let check = cat.map((item,index)=>{
            let arrangeExportData = TotalTime(ridersParticipants,stagesFinished,item).map((count,index) => Object.assign(
                {   Rank:index+1, 
                    Number:count.id, 
                    Name:count.name,
                    Stage_1:handlerNumberToTime(count?.stages,"Stage1"),  
                    Stage_2: handlerNumberToTime(count?.stages,"Stage2"),
                    Stage_3: handlerNumberToTime(count?.stages,"Stage3"), 
                    Total_time: handlerNumberToTime([{"time":count.totalAll, "totalTime":"FINISHED"}],"totalTime"),  
                }));
            let test = "test" + index;
            test = utils.json_to_sheet([]);
            utils.sheet_add_aoa(test, headings);
            utils.sheet_add_json(test, arrangeExportData, { origin: "A2", skipHeader: true });
            utils.book_append_sheet(wb, test, item);
            return wb;
        });
        console.log(check);
        writeFile(wb, "Enduro Results.xlsx");
    };

    const handlerNumberToTime = (stages,desc)=>{ 
        let hasKey = stages.filter((item)=> Object.keys(item).some(key => key === desc));
        const milli = new Date();
        milli.setMilliseconds(hasKey[0]?.time);
        const minutes = ("0" + Math.floor((hasKey[0]?.time  / 60000) % 60)).slice(-2);
        const seconds = (":0" + Math.floor((hasKey[0]?.time  / 1000) % 60)).slice(-2);
        return hasKey.length ? `${minutes}:${seconds}:${milli.getMilliseconds()}` : "00:00:00";
    };

    const handleImport = ($event) => {
        const files = $event.target.files; 
        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = async (event) => {
                const wb = read(event.target.result);
                const sheets = wb.SheetNames; 
                if (sheets.length) { 
                    let importFinished = utils.sheet_to_json(wb.Sheets[sheets[0]]); 
                    let difference = importFinished.filter((item)=> stagesFinished.every(item2 => item2.rider_id != item.rider_id));  
                    console.log(stagesFinished);
                    console.log(importFinished);
                    AddMutipleRiderFinished(difference); 
                }
            };
            reader.readAsArrayBuffer(file);
        }else{
            alert("error");
        }
    };

    let getStageList = async(id)=>{
        let detailStage = await GetStage(parseInt(id));
        setCurrentStage(id);
        return detailStage;
    };

    return(<> 
        {
            summary && <div>
                <div className="relative z-50 bg-black w-full h-full">
                    <Modal>
                        <div>
                            <div className="text-xl mt-4 mb-2"><center>Summary Rider</center></div>
                            <div><center>{riderDetails.current.name}</center></div>
                            <div className="text-xl font-bold"><center>STAGES</center></div>  
                            <div className=" flex flex-col">
                                <div className="flex justify-center item-center gap-2 font-bold">
                                    <div>STAGE 1: </div>
                                    <div><NumberToTime stages={riderDetails.current.stages} number={riderDetails.current.number} desc="Stage1" showDel={true} close={()=>setSumamry(false)}/></div> 
                                </div>
                                <div className="font-bold flex justify-center item-center gap-2">
                                    <div>STAGE 2: </div>
                                    <div><NumberToTime stages={riderDetails.current.stages} number={riderDetails.current.number} desc="Stage2" showDel={true} close={()=>setSumamry(false)}/></div> 
                                </div>
                                <div className="font-bold flex justify-center item-center gap-2">
                                    <div>STAGE 3: </div>
                                    <div><NumberToTime stages={riderDetails.current.stages} number={riderDetails.current.number} desc="Stage3" showDel={true} close={()=>setSumamry(false)}/></div> 
                                </div>
                            </div>
                            <div className="flex w-full justify-between mt-8 h-16 bg-slate-200 rounded-b-lg">
                                <div className="flex justify-center items-center w-full cursor-pointer font-medium" onClick={()=>setSumamry(false)}>
                                    Close
                                </div> 
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        }
        <div className="border-b flex justify-between items-center">
            <div className="py-2 ml-4 font-bold ">
                Results
            </div>
            <div className="pr-4 pt-2">
                <button  onClick={props.closeModal}><Close/></button>
            </div>
        </div>
        <div className="overflow-y-auto h-[86vh]"> 
            <div className="flex flex-row-reverse gap-2 mr-2 mt-2">  
                <button className="border rounded-md bg-white shadow-md cursor-pointer bg-slate-500 text-white text-xs px-2 py-1" onClick={handleExport}>Export</button>
                <div>
                    <input type="file" name="file" className="custom-file-input hidden" id="inputGroupFile" required onChange={handleImport}
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/> 
                    <label className="custom-file-label" htmlFor="inputGroupFile">
                        <div className="p-2 border rounded-md bg-white shadow-md cursor-pointer bg-orange-400 text-white text-xs">
                            Import
                        </div>
                    </label>
                </div>
                <button className="p-2 border rounded-md bg-white shadow-md cursor-pointer bg-blue-500 text-white text-xs" onClick={handlerResult}>Results</button>
            </div>
            <div className="flex md:gap-4 gap-1 mt-2 md:px-6 px-1">
                <div className="flex w-full">
                    <Select items={categoryServer} label="Category" getValue={value=>{
                        setCurrentCategory(value);
                        let cat = categoryServer.find(cat => cat.id === parseInt(value));
                        setCatDetails(cat);
                    }} currentSelect={currentCategory}/> 
                </div>
                <div className="flex w-full">
                    <Select items={stageServer} label="Ranking" getValue={(value)=>{getStageList(value);}} currentSelect={currentStage}/> 
                </div>
            </div> 
            <div className="flex justify-center items-center">
                {(filteringCagtegory.length <= 0) && <div>No riders on this category.</div> }
            </div>
            <div className="m-2 text-[8px] md:text-base md:px-6 px-1">  
                <div className='gap-2'>
                    <TableContainer> 
                        <Table>
                            <thead className="bg-gray-50">
                                <tr>
                                    {
                                        header.map((header,key)=>{
                                            return(
                                                <TableHead key={key} className="text-center">
                                                    {header}
                                                </TableHead> 
                                            );
                                        })
                                    }
                                    {
                                        stageServer.map((stage,key)=>{
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
                                    filteringCagtegory.map((result,key)=>{
                                        return(
                                            <tr className='hover:bg-gray-200' key={key}>
                                                <TableCell className={`py-2 px-2 text-[16px] text-center  ${key < 11 ? "text-orange-400" : "text-black"}`}>
                                                    {key+1}
                                                </TableCell>  
                                                <TableCell className="py-2 px-2 text-[12px] text-black text-center">
                                                    {result.number}
                                                </TableCell>  
                                                <TableCell className="py-2 px-2 text-[12px] text-black text-center">
                                                    {result.name}
                                                </TableCell>  
                                                <TableCell className="py-2 px-2 text-[12px] text-black text-center">
                                                    {catDetails?.name || ""}
                                                </TableCell> 
                                                {
                                                    stageServer.map((serverStg,ind)=>{
                                                        return <TableCell key={ind} className="py-2 px-2 text-[12px] text-center">
                                                            {
                                                                result?.stages.map((stage,key)=>{
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
    </>);
};
export default ResultModal;