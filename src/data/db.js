import Dexie from "dexie";

export const db = new Dexie("myDatabase");
db.version(1).stores({
    riders: "++id, name, category_id, status, number",
    category: "++id, name",
    stageGroup:"++id, name",
    stages: "++id,stage_id,riders_id,riders_number,status, stage, startTime, finishedTime, totalTime"
}); 