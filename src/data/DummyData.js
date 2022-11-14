const DummyData = {
    "15-19": { 
        riders:[
            {name:"osmer - 15-19",cat:"15-19",number:"001",status:""},
            {name:"osmer - 15-19",cat:"15-19",number:"002",status:""},
            {name:"osmer - 15-19",cat:"15-19",number:"003",status:""},
        ]
    },
    "20-29": { 
        riders:[
            {name:"osmer - 20-29",cat:"20-29",number:"001",status:""},
            {name:"osmer - 20-29",cat:"20-29",number:"002",status:""},
            {name:"osmer - 20-29",cat:"20-29",number:"003",status:""},
        ]
    }, 
    "30-39": { 
        riders:[
            {name:"osmer - 30-39",cat:"30-39",number:"001",status:""},
            {name:"osmer - 30-39",cat:"30-39",number:"002",status:""},
            {name:"osmer - 30-39",cat:"30-39",number:"003",status:""},
        ]
    },
};

export const StatusRider = {
    WAITING:"WAITING",
    ONBOARD:"ONBOARD",
    RUNNING:"RUNNING",
    TOUCHDOWN:"TOUCHDOWN",
    FINISHED:"FINISHED",
    RERUN:"RERUN"
};

export const FetchCategory = (cat)=>{
    return DummyData[cat].riders;
};