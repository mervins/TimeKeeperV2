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
    return rider;
};

export const TotalTime = (riders,finished,category,stageServer) =>{  
    try{
        console.log(finished);
        let playerFilter =  riders.filter(item => item.category === category);  
        let results = playerFilter.map((infoRider) => {
            let timeResult = finished?.filter(item => item.rider_id === infoRider.number).map(count => Object.assign({rider_id:count.rider_id, totalTime: count.totalTime, stage:count.stage ,stage_id:count.stage_id ,id:count.id}));
            let overallTime = calculateTotal(timeResult,infoRider.number, infoRider.name);
            return overallTime;
        });  
        let sorted =  filterAndSortThem(results,stageServer); 
        let checkedStages = sorted.map(item => Object.assign({...item, stages:compareStages(item,stageServer)})); 
        return checkedStages;
        
    }catch(e){
        console.log(e);
    } 
};

const compareStages = (item,stageServer)=>{
    let arrayTwo = stageServer;
    let arrayOne = item.stages; 
    const results = arrayTwo.filter(({ name: id1 }) => !arrayOne.some(({ stage: id2 }) => id2 === id1)).map(result=>Object.assign({stage:result.name, time:0,stage_id:result.id}));
    let newStages = [...arrayOne, ...results];
    return newStages.sort((a,b)=> a.stage_id - b.stage_id);
};

const filterAndSortThem = (checkPerStage,stageServer) =>{  
    let mergeThem2 = []; 
    stageServer.map((stage,index)=> { 
        let newData = checkPerStage.filter(item => item.stages.length === index+1).sort((a, b) =>  b.totalAll - a.totalAll);
        mergeThem2 = [...newData,...mergeThem2];
        
    });   
    return mergeThem2;
};

const calculateTotal = (collectTime,rider_id,name)=>{
    let totalAll = 0;
    let stages = [];
    let labelStage;
    for (const n in collectTime) { 
        totalAll = totalAll + collectTime[n].totalTime;
        labelStage = collectTime[n].stage;
        stages.push({status:"FINISHED", time:collectTime[n].totalTime, "id":collectTime[n].id, stage:labelStage,stage_id:collectTime[n].stage_id});
    }
    console.log(collectTime);
    return {id:rider_id, totalAll:totalAll, stages:stages, name:name};
};

export default Stages;