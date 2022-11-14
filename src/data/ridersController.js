import { db } from "./db";
import { useLiveQuery } from "dexie-react-hooks";

let Riders = () => {
    return useLiveQuery(
        () => db.riders.toArray()
    );
};

export const AddIndividualRider = async(rider) => {
    await db.riders.add(rider);
};

export const AddMutipleRider = async (rows) => {
    await db.riders.bulkAdd(rows);
};

export const UpdateRider = async(details, status,stage) => {
    let updateStatus = await UpdateStingObjectStatus(details,status,stage);
    await db.riders.put({...details, status:updateStatus});
};

export const UpdateStingObjectStatus = async(details,status,stage) =>{
    let riderStatus =  JSON.parse(details.status); 
    return JSON.stringify({...riderStatus, [stage]:status}); 
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