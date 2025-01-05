import { db } from "./db";
import { useLiveQuery } from "dexie-react-hooks";
import { StatusRider } from "./DummyData";

let Riders = () => {
    return useLiveQuery(
        () => db.riders.toArray()
    );
};

export const onboardDisplay = () => {
    return useLiveQuery(
        () => db.onboard.toArray()
    );
};

export const AddIndividualRider = async(rider) => {
    let stage = await db.stageGroup.toArray();
    let status = stage.map(item => Object.assign({stage:item.name,status:StatusRider.WAITING, stage_id: item.id}));
    console.log(status);
    console.log(rider);
    // await db.riders.add(rider);
};

export const AddMutipleRider = async (rows) => {
    let stage = await db.stageGroup.toArray();
    let statusRider = stage.map(item =>Object.assign({stage:item.name,status:StatusRider.WAITING,stage_id: item.id,rank:null}));
    let riders = rows.map(rider => Object.assign(rider,{status:statusRider}));
    console.log(riders);
    await db.riders.bulkAdd(riders);
};

export const UpdateRider = async(details, status,stage) => {
    console.log(stage);
    let statusRider = [StatusRider.ONBOARD, StatusRider.RUNNING, StatusRider.TOUCHDOWN,StatusRider.RERUN];
    
    const onboard = await db.onboard.where("index").equals(parseInt(details.id)).first();
    
    if(statusRider.includes(status)){
        if(!onboard){
            await db.onboard.add({index:details.id,startTime:null});
        }
    }else{
        if(onboard){
            await db.onboard.delete(onboard.id);
        } 
    }
    let updateStatus = await UpdateStingObjectStatus(details,status,stage);
    console.log({...details, status:updateStatus});
    await db.riders.put({...details, status:updateStatus});
};

export const updateTimeRelease = async (firstRiderStartTime, interval)=>{
    console.log("==========Set TIME==============");
    console.log(firstRiderStartTime);
    console.log(interval);
    let onboardRider = await db.onboard.toArray();

    if (!onboardRider.length) return;
    const intervalMs = interval * 1000;
  
    // Update riders list in memory
    const updatedRiders = onboardRider.map((rider, index) => {
        const startTime = new Date(firstRiderStartTime).getTime() + index * intervalMs;
        return { ...rider, startTime: new Date(startTime).toISOString() };
    });
    // Update Dexie.js in bulk
    await db.transaction("rw", db.onboard, async () => {
        for (const rider of updatedRiders) {
            await db.onboard.update(rider.id, { startTime: rider.startTime });
        }
    });
};

export const timeReleaseStage = async (firstRiderStartTime, interval,stageId,catId)=>{
    console.log("==========Set TIME==============");
    console.log(firstRiderStartTime);
    console.log(interval);
    console.log(stageId);
    console.log(catId);
    let riders = await db.riders.toArray();

    if (!riders.length) return;
    const intervalMs = interval * 1000;
  
    // Update riders list in memory
    const updatedRiders = riders
        .filter((rider) => rider.category_id === parseInt(catId))
        .map((rider, index) => {
            const startTime = new Date(firstRiderStartTime).getTime() + index * intervalMs;
            const updatedStages = rider.status.map((stage) => {
                if (stage.stage_id === stageId) {
                    return { ...stage, start_time: new Date(startTime).toISOString() };
                }
                return stage;
            });
            return {
                ...rider, 
                status: updatedStages,
            };
        });
    // Update Dexie.js in bulk
    await db.transaction("rw", db.riders, async () => {
        for (const rider of updatedRiders) {
            await db.riders.update(rider.id, { status: rider.status });
        }
    });
};

export const UpdateStingObjectStatus = async(details,statusUpdate,stage) =>{ 
    console.log("==========Stage Cotroller==============");
    console.log(stage);
    const riderStatus = details?.status.findIndex(item => item?.stage_id === stage.id);
    if (riderStatus !== -1) {
        // If it exists, update the stage
        const updatedPlayList = [...details.status];
        updatedPlayList[riderStatus].status = statusUpdate;
        return updatedPlayList;
    } else {
        // If it doesn't exist, add a new object
        const newStatus = {
            status: statusUpdate,
            stage: stage.name,
            rank:null
        };
        details.status.push(newStatus);
        return details.status;
    } 
};

export const DeleteAllRiders = async() => {
    await db.riders.clear();
};

export const DeleteRider = async(id) => {
    await db.riders.delete(id);
};

export const UpdateStatus = async (number,stage,status) => { 
    await db.riders
        .where("number")
        .equals(number)
        .modify(rider => {
            let riderStatus =  JSON.parse(rider.status); 
            rider.status = JSON.stringify({...riderStatus, [stage]:status});
        });
};

export const UpdateInfo = async (id,details) => { 
    await db.riders
        .where("id")
        .equals(id)
        .modify(rider => {
            Object.assign(rider, details);
        }); 
};

export default Riders;