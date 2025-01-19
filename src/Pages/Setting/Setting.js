
import Sidebar from "../../components/Layout/Sidebar";
import Select from "../../UI/Select";
import React, { useEffect, useState } from "react";
import ImportModal from "../../components/Modal/Export-Import/ImportRider";
import { useDialogHook } from "../../util/customehooks";
import { utils, writeFile } from "xlsx";
import { DeleteAllRiders } from "../../data/ridersController";
import Stages from "../../data/stagesController";
import CategoryContrller from "../../data/categoryController";
import { TotalTime } from "../../data/stagesController";
import Riders from "../../data/ridersController";
import StageController from "../../data/stageController";
import Settings,{updateSetting} from "../../data/settingController";


const raceType = [
    { value: 1, name: "Downhill Race" },
    { value: 2, name: "Eduro Race" },
];

const Setting = ()=>{
    const settings = Settings();
    let stagesFinished = Stages(); 
    let ridersParticipants = Riders();
    let categories = CategoryContrller();
    let stages = StageController();
    const [mode, setMode] = React.useState(1);
    const [currentStage, setCurrentStage] = React.useState(0);
    const importDialog = useDialogHook(ImportModal);
    const [state, setState] = useState({
        api_server:null,
        sort_rank:null,
        sort_stage:null,
        ranking:null,
        sensor:null,
        race_type:null,
    });

    useEffect(()=>{
        if(settings){
            setState((prev)=>{
                return {...prev, ...settings[0]};
            });
            localStorage.setItem("api_server",settings[0]?.api_server);
        }
    },[settings]);

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

    const onChangeHandler = (event) => {
        const {name, value} = event.target;
        setState({...state, [name]: value});
    };

    const updateSettingHandler = async()=>{
        await updateSetting(state);
        alert("Saved");
        localStorage.setItem("api_server",state.api_server);
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
                    <div className="my-2 sm:mx-10 relative flex justify-end">
                        <div>
                            <button className="bg-[#0d6ed1] text-white py-2 px-4 p-2 border rounded-lg text-xs font-bold" 
                                onClick={updateSettingHandler}
                            >
                                Save Settings
                            </button>
                        </div>
                    </div>
                    <div className="m-2 relative flex flex-col md:flex-row gap-2">
                        <div className="mx-4 flex flex-col sm gap-2 border rounded-xl overflow-hidden bg-white border-[#d8d8d8] py-1 px-1 w-full">
                            <div className="flex gap-2 flex-wrap">
                                <div className="w-64 ">
                                    <label className="p-4 mb-2 font-semibold">Race Mode</label>
                                    <Select
                                        items={raceType} 
                                        label="Type" 
                                        getValue={value=>setMode(value)} 
                                        currentSelect={mode}
                                    />
                                </div>
                                <div className="w-64">
                                    <label className="p-4 mb-2 font-semibold">Ranking</label>
                                    <Select
                                        items={stages} 
                                        label="Sort by" 
                                        getValue={value=>setCurrentStage(value)} 
                                        currentSelect={currentStage}
                                    />
                                </div>
                                <div className="w-64 ">
                                    <label className="p-4 mb-2 font-semibold">Timer</label>
                                    <Select
                                        items={stages} 
                                        label="Setup" 
                                        getValue={value=>setCurrentStage(value)} 
                                        currentSelect={currentStage}
                                    />
                                </div>
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
                        <div className="mx-4 px-10 flex flex-col gap-2 border rounded-xl overflow-hidden bg-white border-[#d8d8d8] py-1 px-1 w-full">
                            <p className="p-4 mb-2 font-semibold border-b-2">Sensor</p>
                            <div className="flex gap-2 items-center font-semibold">
                                <label>Server Address</label>
                                <input
                                    className="truncate block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent focus:border-blue-600 border appearance-none focus:outline-none focus:ring-0 peer rounded-lg px-[15px] disabled:cursor-not-allowed"
                                    onChange={onChangeHandler} name="api_server" type="text" value={state.api_server} placeholder="http://192.168.1.100:3000"/>
                            </div>
                            <div className="flex gap-2 items-center font-semibold">
                                <label>Connection:</label>
                                <p>ON / OFF</p>
                            </div>
                            <div className="flex gap-2 items-center font-semibold">
                                <label>Bluetooth:</label>
                                <p>ON / OFF</p>
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
        </Sidebar>
    </>);
};

export default Setting;