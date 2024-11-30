
import Sidebar from "../../components/Layout/Sidebar";
import Select from "../../UI/Select";
import React from "react";
import ImportModal from "../../components/Modal/Export-Import/ImportRider";
import { useDialogHook } from "../../util/customehooks";
import { utils, writeFile } from "xlsx";
import { DeleteAllRiders } from "../../data/ridersController";
import Stages from "../../data/stagesController";
import CategoryContrller from "../../data/categoryController";
import { TotalTime } from "../../data/stagesController";
import Riders from "../../data/ridersController";
import StageController from "../../data/stageController";


const raceType = [
    { value: 1, name: "Downhill Race" },
    { value: 2, name: "Eduro Race" },
];

const Setting = ()=>{
    
    let stagesFinished = Stages(); 
    let ridersParticipants = Riders();
    let categories = CategoryContrller();
    let stages = StageController();
    const [mode, setMode] = React.useState(1);
    const [currentStage, setCurrentStage] = React.useState(0);
    const importDialog = useDialogHook(ImportModal);

    React.useEffect(()=>{
        if(stages){
            setCurrentStage(stages[0]?.id);
        }
    },[stages]);

    const importHandler = ()=>{
        importDialog({ridersTest:ridersParticipants}, (callback) => {
            if(callback?.success){
                // showToast("success","Riders Saved","Successfully");
            }
        });
    };
    const DeleteAllTables = ()=>{
        let text = "Click OK to delete all datas?";
        if (confirm(text) == true) {
            text = "You pressed OK!"; 
            DeleteAllRiders();
            // DeleteAllStages();
        } else {
            text = "You canceled!";
        }
    };
    const handleExport = () => {
        const headings = [[
            "rider_id",
            "rider_number",
            "stage",
            "startTime", 
            "finishedTime", 
            "totalTime", 
        ]];
        let arrangeExportData = stagesFinished?.map(count => Object.assign(
            {   rider_id:count.rider_id, 
                rider_number:count.rider_number,
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
        const stageName = stages.map(item => item.name);
        const headings = [
            ["Rank",
                "Plate", 
                "Name",
                ...stageName]];
        
        const wb = utils.book_new();
        let check = categories?.map((cat,index)=>{
            let arrangeExportData = TotalTime(ridersParticipants,stagesFinished,cat.id,parseInt(currentStage)).map((rider, riderIndex) => {
                // Dynamically add stages
                let stagesData = stages.reduce((acc, stage) => {
                    let name = stage.name;
                    acc[name] = handlerNumberToTime(rider?.stages, stage.id);
                    return acc;
                }, {});

                return {
                    Rank: riderIndex + 1,
                    Plate: rider.number,
                    Name: rider.name,
                    ...stagesData
                };
            });
            let test = "test" + index;
            test = utils.json_to_sheet([]);
            utils.sheet_add_aoa(test, headings);
            utils.sheet_add_json(test, arrangeExportData, { origin: "A2", skipHeader: true });
            utils.book_append_sheet(wb, test, cat.name);
            return wb;
        });
        console.log(check);
        writeFile(wb, "Enduro Results.xlsx");
    };
    const handlerNumberToTime = (stages,stage_id)=>{ 
        let hasKey = stages.filter((item)=> item.stage_id === stage_id);
        const milli = new Date();
        milli.setMilliseconds(hasKey[0]?.totalTime);
        const minutes = ("0" + Math.floor((hasKey[0]?.totalTime  / 60000) % 60)).slice(-2);
        const seconds = (":0" + Math.floor((hasKey[0]?.totalTime  / 1000) % 60)).slice(-2);
        return hasKey.length ? `${minutes}:${seconds}:${milli.getMilliseconds()}` : "00:00:00";
    };

    return (<>
        <Sidebar>
            <div>
                <div className="border-b border-slate-400">
                    <div className="p-4 font-bold text-xl text-blue-600">
                        Settings
                    </div>
                </div> 
                <div className="bg-white rounded-md m-0 2md:m-4 h-[88vh] overflow-y-auto">
                    <div className="m-2 sm:mx-10 relative flex justify-start">
                        <div>
                            <button className="bg-[#0d6ed1] text-white py-2 px-4 p-2 border rounded-lg text-xs font-bold">
                                Save Settings
                            </button>
                        </div>
                    </div>
                    <div className="m-2 relative flex">
                        <div className="mx-4 flex flex-col gap-2 border rounded-xl overflow-hidden bg-white border-[#d8d8d8] py-1 px-1">
                            <div className="w-64 border-b">
                                <label className="p-4 mb-2 font-semibold">Race Mode</label>
                                <Select
                                    items={raceType} 
                                    label="Type" 
                                    getValue={value=>setMode(value)} 
                                    currentSelect={mode}
                                />
                            </div>
                            <div className="w-64 border-b">
                                <label className="p-4 mb-2 font-semibold">Ranking</label>
                                <Select
                                    items={stages} 
                                    label="Sort by" 
                                    getValue={value=>setCurrentStage(value)} 
                                    currentSelect={currentStage}
                                />
                            </div>
                            <div className="flex gap-4 items-center px-4 border-b pb-2">
                                <label className="font-semibold">Participants</label>
                                <button 
                                    onClick={importHandler}
                                    className="p-2 w-24 border rounded-md bg-white shadow-md cursor-pointer text-center bg-orange-400 text-white ">Import</button>  
                            </div>
                            <div className="flex gap-4 items-center px-4 border-b pb-2">
                                <label className="font-semibold">Participants</label>
                                <button 
                                    onClick={handleExport}
                                    className="p-2 w-24 border rounded-md bg-white shadow-md cursor-pointer text-center bg-orange-400 text-white">Export</button>  
                            </div>
                            <div className="flex gap-4 items-center px-4 pb-2 border-b">
                                <label className="font-semibold">Participants</label>
                                <button 
                                    onClick={handlerResult}
                                    className="p-2 w-24 border rounded-md bg-white shadow-md cursor-pointer text-center bg-orange-400 text-white">Result</button>  
                            </div>

                            <div className="flex gap-4 items-center px-4 pb-2">
                                <label className="font-semibold">Participants</label>
                                <button 
                                    onClick={DeleteAllTables}
                                    className="p-2 w-24 border rounded-md bg-white shadow-md cursor-pointer text-center bg-orange-400 text-white">Remove</button>  
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
        </Sidebar>
    </>);
};

export default Setting;