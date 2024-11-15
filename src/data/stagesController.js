/* eslint-disable no-unused-vars */
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

export const TotalTime = (riders,stagesFinished,category,stageServer,currentStage) =>{  
    try{
        console.log("============Total Time=============");
        console.log(category);

        let riderFilterCat =  riders.filter(item => item.category_id === parseInt(category));  
        let results = riderFilterCat.map((infoRider) => {
            let timeSummaryRider = stagesFinished?.filter(finish => finish.rider_id === infoRider.id)
                .map(info => 
                    Object.assign({
                        rider_id:info.rider_id,
                        totalTime: info.totalTime,
                        stage:info.stage,
                        stage_id:info.stage_id,
                        id:info.id,
                        rider_number:info.rider_number,
                    }));
           
            return {...infoRider, stages: timeSummaryRider};
        }).sort((a, b) => {
            // Find the stages for the selected `currentStage`
            const aStage = a.stages.find((stage) => stage.stage_id === parseInt(currentStage));
            const bStage = b.stages.find((stage) => stage.stage_id === parseInt(currentStage));
    
            // If the stage is not found, set their totalTime to Infinity (they'll be sorted last)
            const aTotalTime = aStage ? aStage.totalTime : Infinity;
            const bTotalTime = bStage ? bStage.totalTime : Infinity;
    
            // Sort based on the totalTime
            return aTotalTime - bTotalTime;
        });
        // let overallTime = calculateTotal(timeSummaryRider,infoRider.number, infoRider.name);
        // return overallTime;
        // let sorted =  filterAndSortThem(results,stageServer); 
        // let checkedStages = sorted.map(item => Object.assign({...item, stages:compareStages(item,stageServer)})); 
        // return checkedStages;
        console.log(results);
        console.log("============Total Time=============");
        return results;
        
    }catch(e){
        console.log(e);
    } 
};

const overallTime = (riders,stagesFinished,category,stageServer,currentStage)=>{
    let riderFilterCat =  riders.filter(item => item.category_id === parseInt(category));
    let results = riderFilterCat
        .map((infoRider) => {
            let timeSummaryRider = stagesFinished
                ?.filter((finish) => finish.rider_id === infoRider.id)
                .map((info) =>
                    Object.assign({
                        rider_id: info.rider_id,
                        totalTime: info.totalTime,
                        stage: info.stage,
                        stage_id: info.stage_id,
                        id: info.id,
                        rider_number: info.rider_number,
                        totalAll: info.totalTime
                    })
                );

            // Calculate the total time for all stages
            const totalTimeAllStages = timeSummaryRider?.reduce((total, stage) => total + stage.totalTime, 0) || 0;

            return { ...infoRider, stages: timeSummaryRider, totalTimeAllStages };
        })
        .sort((a, b) => {
            // Compare totalTimeAllStages across all stages
            return a.totalTimeAllStages - b.totalTimeAllStages;
        });

    console.log(results);
    return results;

};

const compareStages = (item,stageServer)=>{
    console.log("=============compare Stage==============");
    console.log(item);
    console.log(stageServer);
    let arrayTwo = stageServer;
    let arrayOne = item.stages; 
    const results = arrayTwo.filter(({ name: id1 }) => !arrayOne.some(({ stage: id2 }) => id2 === id1))
        .map(result=>Object.assign({stage:result.name, time:0,stage_id:result.id}));
    let newStages = [...arrayOne, ...results];
    return newStages.sort((a,b)=> a.stage_id - b.stage_id);
};

const filterAndSortThem = (checkPerStage,stageServer) =>{ 
    console.log("=============Filter and Sort==============");
    console.log(checkPerStage); 
    console.log(stageServer);
    let mergeThem2 = []; 
    stageServer.map((stage,index)=> { 
        let newData = checkPerStage.filter(item => item.stages.length === index+1)
            .sort((a, b) =>  b.totalAll - a.totalAll);
        mergeThem2 = [...newData,...mergeThem2];
        
    });   
    return mergeThem2;
};

const calculateTotal = (collectTime,rider_id,name)=>{
    console.log("=========Calculate Total==============");
    console.log(collectTime);
    let totalAll = 0;
    let stages = [];
    let labelStage;
    for (const n in collectTime) { 
        totalAll = totalAll + collectTime[n].totalTime;
        labelStage = collectTime[n].stage;
        stages.push({
            status:"FINISHED",
            time:collectTime[n].totalTime,
            "id":collectTime[n].id, stage:labelStage,
            stage_id:collectTime[n].stage_id
        });
    }
    return {
        id:rider_id,
        totalAll:totalAll,
        stages:stages,
        name:name
    };
};

export default Stages;