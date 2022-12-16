import {useState,useMemo,useRef} from "react";
import { TotalTime,AddMutipleRiderFinished } from "../../data/stagesController"; 
import NumberToTime from "../../components/NumberToTime";
import { utils, writeFile,read } from "xlsx";
import { Edit } from "../../components/Icons/Icons";
import Modal from "../../components/Modal/Modal"; 
const ResultModal = (props)=>{

    const {ridersTest,stagesFinished} = props;
    const [currentCategory,setCurrentCategory] = useState("Beginner"); 
    const [summary, setSumamry] = useState(false);
    const riderDetails = useRef({
        name:"",
        stages:[],
        number:null
    });
    console.time("filter array");
    const filteringCagtegory = useMemo(() => TotalTime(ridersTest,stagesFinished,currentCategory), [currentCategory]); 
    console.log(filteringCagtegory);
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
        <div className="overflow-y-auto h-[90vh]"> 
            <div className="flex flex-row-reverse gap-2 mr-2 mt-2"> 
                <button className="cursor-pointer p-2 border rounded-md bg-white shadow-md bg-red-500 text-white" onClick={props.closeModal}>Close</button>
                <button className="p-2 border rounded-md bg-white shadow-md cursor-pointer bg-slate-500 text-white" onClick={handleExport}>Export</button>
                <div>
                    <input type="file" name="file" className="custom-file-input hidden" id="inputGroupFile" required onChange={handleImport}
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/> 
                    <label className="custom-file-label" htmlFor="inputGroupFile">
                        <div className="p-2 border rounded-md bg-white shadow-md cursor-pointer bg-orange-400 text-white">
                            Import
                        </div>
                    </label>
                </div>
                <button className="p-2 border rounded-md bg-white shadow-md cursor-pointer bg-blue-500 text-white" onClick={handlerResult}>Results</button>
            </div>
            <div className="relative z-0 mt-6 group border-none m-2">
                <select onChange={(e)=>{setCurrentCategory(e.target.value);}} className="truncate block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent  border-ssr-blue2 border-[1.9px] appearance-none focus:outline-none focus:ring-0 peer rounded-lg px-[15px] disabled:cursor-not-allowed">
                    <option value={"Beginner"}>Beginner</option>
                    <option value={"Advance"}>Advance</option>
                    <option value={"19 below"}>19 Below</option>
                    <option value={"20-29"}>20 - 29</option>
                    <option value={"30-39"}>30 - 39</option> 
                    <option value={"40 up"}>40 up</option>
                    <option value={"Executive"}>Executive</option>
                    <option value={"Ladies"}>Ladies</option>
                </select>
                <label className="peer-focus:font-medium absolute text-sm text-gray-600 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6 ml-2 px-4 peer-placeholder-shown:-z-10 peer-focus:z-20 rounded-lg bg-white">Category</label>
            </div> 
            <div className="m-2 text-[8px] md:text-base"> 
                {/* <div className="grid grid-cols-8 border">
                    <div>Rank</div>
                    <div>Number</div>
                    <div className="col-span-2">Name</div>
                    <div>Stage 1</div> 
                    <div>Stage 2</div> 
                    <div>Total Time</div>
                </div> */}
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
                                        <div className="grid grid-cols-4 pt-1">   
                                            <div><div className="text-[.6rem]">Stage 1</div> {<NumberToTime stages={item?.stages} desc="Stage1"/>}</div> 
                                            <div><div className="text-[.6rem]">Stage 2</div> {<NumberToTime stages={item?.stages} desc="Stage2"/>}</div> 
                                            <div><div className="text-[.6rem]">Stage 3</div> {<NumberToTime stages={item?.stages} desc="Stage3"/>}</div> 
                                            <div><div className="text-[.6rem]">Total Time</div>{<NumberToTime stages={[{"time":item.totalAll, "totalTime":"FINISHED"}]} desc="totalTime"/>}</div> 
                                        </div>
                                    </div> 
                                    <div className="cursor-pointer mr-1 items-center" onClick={async()=>{ 
                                        riderDetails.current.name = item.name; 
                                        riderDetails.current.stages = item?.stages;
                                        riderDetails.current.number = item.id;
                                        setSumamry(true); }}> 
                                        <span><Edit/></span></div>
                                </div>  
                            </div>
                            // <div key={index} className="grid grid-cols-8 border ">
                            //     <div>{index+1}</div>
                            //     <div>{item.id}</div>
                            //     <div className="col-span-2">{item.name}</div>
                            //     <div>{<NumberToTime stages={item?.stages} desc="Stage1"/>}</div> 
                            //     <div>{<NumberToTime stages={item?.stages} desc="Stage2"/>}</div> 
                            //     {/* <div>{<NumberToTime stages={item?.stages} desc="Stage3"/>}</div>    */}
                            //     <div className="cursor-pointer ml-1 flex gap-1 items-center" onClick={async()=>{ 
                            //         riderDetails.current.name = item.name; 
                            //         riderDetails.current.stages = item?.stages;
                            //         riderDetails.current.number = item.id;
                            //         setSumamry(true); }}>
                            //         <div>{<NumberToTime stages={[{"time":item.totalAll, "totalTime":"FINISHED"}]} desc="totalTime"/>}</div> 
                            //         <span><Edit/></span></div>
                            // </div>
                        
                        );
                    })
                }
            </div>
        </div>
    </>);
};
export default ResultModal;