import Dexie from "dexie";

export const db = new Dexie("myDatabase");
db.version(1).stores({
    riders: "++id, name, category_id, status, number",
    category: "++id, name",
    stageGroup:"++id, name",
    stages: "++id,stage_id,riders_id,riders_number,status, stage, startTime, finishedTime, totalTime",
    settings:"++id,race_type,sensor,ranking,sort_stage, sort_rank,api_server", //sort_stage applicable for DH and sort_rank for fastes to slowest vice versa
    onboard:"++id,index,startTime, interval"
}); 