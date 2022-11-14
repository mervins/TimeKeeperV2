import { db } from "./db";
import { useLiveQuery } from "dexie-react-hooks";

let Stages = () => {
    return useLiveQuery(
        () => db.stages.toArray()
    );
};

export const AddIndividualRiderFinished = async(riderResult) => {
    await db.stages.add(riderResult);
};

export const AddMutipleRiderFinished = async (rows) => {
    await db.stages.bulkAdd(rows);
};

export const UpdateRiderFinished = async(details, status) => {
    await db.stages.put({...details,  status:status});
};

export const DeleteAllStages = async() => {
    await db.stages.clear();
};

export const DeleteRiderFinished = async(id) => {
    await db.stages.delete(id);
    return true;
};

export const FilterPerStage = ()=>{
    // let rider = Riders.filter(item => item);
    // console.log(rider);
};

export const getRider = async(riderID)=>{
    const rider = await db.stages
        .where("rider_id").equals(riderID)
        .toArray();
    // console.log("======================");
    // console.log(rider); 
    return rider;
};

export const TotalTime = (riders,finished,category) =>{  
    try{
        let playerFilter =  riders.filter(item => item.category === category);  
        let results = playerFilter.map((infoRider) => {
            let timeResult = finished?.filter(item => item.rider_id === infoRider.number).map(count => Object.assign({rider_id:count.rider_id, totalTime: count.totalTime, stage:count.stage ,id:count.id}));
            let overallTime = calculateTotal(timeResult,infoRider.number, infoRider.name);
            return overallTime;
        }); 
        return filterAndSortThem(results);
    }catch(e){
        console.log(e);
    }
     
};

const filterAndSortThem = (checkPerStage) =>{
    let mergeThem = [];
    let checkStage1to3 = checkPerStage.filter(item => item.stages.length === 3).sort((a, b) =>  a.totalAll - b.totalAll);
    let checkStage1to2 = checkPerStage.filter(item => item.stages.length === 2).sort((a, b) =>  a.totalAll - b.totalAll);
    let checkStage1 = checkPerStage.filter(item => item.stages.length === 1).sort((a, b) =>  a.totalAll - b.totalAll);
    let checkStageNothing = checkPerStage.filter(item => item.stages.length === 0).sort((a, b) =>  a.totalAll - b.totalAll);
    mergeThem = [...checkStage1to3, ...checkStage1to2, ...checkStage1, ...checkStageNothing];
    return mergeThem;
};

const calculateTotal = (collectTime,rider_id,name)=>{
    let totalAll = 0;
    let stages = [];
    let labelStage;
    for (const n in collectTime) { 
        totalAll = totalAll + collectTime[n].totalTime;
        labelStage = collectTime[n].stage;
        stages.push({[labelStage]:"FINISHED", time:collectTime[n].totalTime, "id":collectTime[n].id});
    }
    // console.log(stages);
    return {id:rider_id, totalAll:totalAll, stages:stages, name:name};
};

export default Stages;