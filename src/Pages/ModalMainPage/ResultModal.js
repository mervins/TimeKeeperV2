import {useState,useMemo,useRef} from "react";
import { TotalTime,AddMutipleRiderFinished } from "../../data/stagesController"; 
import NumberToTime from "../../components/NumberToTime";
import { utils, writeFile,read } from "xlsx";
import { Edit,Close } from "../../components/Icons/Icons";
import Modal from "../../components/Modal/Modal"; 
import Select from "../../UI/Select";
const ResultModal = (props)=>{

    const {ridersTest,stagesFinished,categoryServer,stageServer} = props;
    const [currentCategory,setCurrentCategory] = useState("Beginner"); 
    const [summary, setSumamry] = useState(false);
    const riderDetails = useRef({
        name:"",
        stages:[],
        number:null
    });
    console.time("filter array");
    const filteringCagtegory = useMemo(() => TotalTime(ridersTest,stagesFinished,currentCategory,stageServer), [currentCategory]);  
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
            let arrangeExportData = TotalTime(ridersTest,stagesFinished,item).map((count,index) => Object.assign(
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

    const compareStages = (item)=>{
        let temp = item;
        console.log(stageServer);
        // let test = stageServer.map((server) =>{ 
        //     return item?.stages.filter(result => server.name == result.stage);
        // });
        const uniqueValues = new Set([...temp.stages].filter(x => !stageServer.has(x.stage)));
        console.log(uniqueValues);
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
            <div className="m-2">
                <Select items={categoryServer} label="Category" getValue={(value)=>{setCurrentCategory(value);}}/> 
            </div> 
            <div className="flex justify-center items-center">
                {filteringCagtegory.length == 0 && <div>No riders on this category.</div> }
            </div>
            <div className="m-2 text-[8px] md:text-base">  
                { 
                    filteringCagtegory?.map((item,index)=>{
                        return (
                            <div className="relative py-1" key={index}>   
                                <div className="border py-1 text-black font-bold shadow-md flex items-center rounded-lg gap-4">  
                                    <div className="pl-1">
                                        <div className="flex gap-1 items-center">
                                            <div className="text-[.5rem]">Top</div>
                                            <div className="text-xl text-yellow-500">{index+1}</div>
                                        </div>
                                    </div> 
                                    <div className="w-full">
                                        <div className="text-xs">#{item.id} {item.name}</div> 
                                        <div className="grid grid-cols-4 pt-1 gap-3">   
                                            {
                                                item?.stages.map((stage,index)=>{
                                                    return(
                                                        <div key={index}><div className="text-[.6rem]">{stage.stage}</div> {<NumberToTime stages={stage}/>}</div>
                                                    ); 
                                                })
                                            }
                                            {/* <div><div className="text-[.6rem]">Stage 1</div> {<NumberToTime stages={item?.stages} desc="Stage1"/>}</div> 
                                            <div><div className="text-[.6rem]">Stage 2</div> {<NumberToTime stages={item?.stages} desc="Stage2"/>}</div> 
                                            <div><div className="text-[.6rem]">Stage 3</div> {<NumberToTime stages={item?.stages} desc="Stage3"/>}</div>  */}
                                            <div><div className="text-[.6rem]">Total Time</div>{<NumberToTime stages={{"time":item.totalAll}} desc="totalTime"/>}</div> 
                                        </div>
                                    </div> 
                                    <button onClick={()=>compareStages(item)}>Test button</button>
                                    <div className="cursor-pointer mr-1 items-center" onClick={async()=>{ 
                                        riderDetails.current.name = item.name; 
                                        riderDetails.current.stages = item?.stages;
                                        riderDetails.current.number = item.id;
                                        setSumamry(true); }}> 
                                        <span><Edit/></span></div>
                                </div>  
                            </div>
                        );
                    })
                }
            </div>
        </div>
    </>);
};
export default ResultModal;