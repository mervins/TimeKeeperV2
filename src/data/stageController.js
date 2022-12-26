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
    await db.stageGroup.bulkAdd(rows);
};

export const UpdateStage = async(Stage) => {
    await db.stageGroup.put({Stage:Stage});
};


export const DeleteAllStage = async() => {
    await db.stageGroup.clear();
};

export const DeleteStage = async(id) => {
    await db.stageGroup.delete(id);
};

export default StageController;