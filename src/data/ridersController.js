import { db } from "./db";
import { useLiveQuery } from "dexie-react-hooks";

let Riders = () => {
    return useLiveQuery(
        () => db.riders.toArray()
    );
};

export const AddIndividualRider = async(rider) => {
    let stage = await db.stageGroup.toArray();
    let status = stage.map(item => Object.assign({stage:item.name,status:"WAITING"}));
    console.log(status);
    console.log(rider);
    // await db.riders.add(rider);
};

export const AddMutipleRider = async (rows) => {
    let stage = await db.stageGroup.toArray();
    let statusRider = stage.map(item =>Object.assign({stage:item.name,status:"WAITING"}));
    let riders = rows.map(rider => Object.assign(rider,{status:statusRider}));
    console.log(riders);
    await db.riders.bulkAdd(riders);
};

export const UpdateRider = async(details, status,stage) => {
    console.log(stage);
    let updateStatus = await UpdateStingObjectStatus(details,status,stage);
    console.log({...details, status:updateStatus});
    await db.riders.put({...details, status:updateStatus});
};

export const UpdateStingObjectStatus = async(details,statusUpdate,stage) =>{ 
    let riderStatus =  details?.status.map((status) => { 
        if(status.stage === stage){
            status.status = statusUpdate; 
        }
        return status;
    });   
    return riderStatus; 
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

export default Riders;