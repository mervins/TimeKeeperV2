import Dexie from "dexie";

export const db = new Dexie("myDatabase");
db.version(1).stores({
    riders: "++id, name, category, status, number",
    category: "++id, name",
    stageGroup:"++id, name",
    stages: "++id,stage_id, stage, startTime, finishedTime, totalTime"
});