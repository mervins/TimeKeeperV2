import { db } from "./db";
import { useLiveQuery } from "dexie-react-hooks";

let StageController = () => {
    return useLiveQuery(
        () => db.stageGroup.toArray()
    );
};

export const AddIndividualStage = async(Stage) => {
    await db.stageGroup.add(Stage);
};

export const AddMutipleStage = async (rows) => {
    try {
        const insertedIds = [];
        for (const row of rows) {
            const id = await db.stageGroup.add(row); // Insert individually
            insertedIds.push(id);
        }
        console.log("============add new stage");
        console.log(insertedIds);
        console.log("============add new stage");
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const id = insertedIds[i]; // The auto-generated `stage_id` for each stage
            const stage_name = row.name;   // Stage name from the row
    
            // Update the tasks with the new stage information
            await db.riders.toCollection().modify(task => {
                task.status.push({
                    stage: stage_name, // The name of the new stage
                    status: "WAITING",  // Default status
                    stage_id: id  // Use the auto-generated stage_id
                });
            });
        }
    
        console.log("Stages added and tasks updated successfully.");
    } catch (error) {
        console.error("Error adding stages and updating tasks:", error);
    }
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

export const UpdateStage = async(stage,id) => {
    // await db.stageGroup.put({Stage:Stage});
    await db.stageGroup
        .where("id")
        .equals(id)
        .modify(item => {
            Object.assign(item, stage);
        }); 
};

export const GetStage = async(id) => {
    return await db.stageGroup.where("id").equals(id).first();
};

export const DeleteAllStage = async() => {
    await db.stageGroup.clear();
};

export const DeleteStageIn = async(id) => {
    await db.stageGroup.delete(id);
};

export default StageController;