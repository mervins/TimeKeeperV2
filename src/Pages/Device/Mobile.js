import { ButtonIcon } from "../../components/Button";
import {  Close, AddUser,Trash } from "../../components/Icons/Icons"; 
import { motion,AnimatePresence  } from "framer-motion"; 
import Select from "../../UI/Select"; 
import Riders from "../../data/ridersController";

const backdrop = {
    visible:{opacity:1},
    hidden:{opacity:0,
        transition:{ delay: 0.4, duration: 0.4}
    }
};

const modal = {
    hidden:{
        x:"-95vw", 
        transition:{duration: 0.4}
    },
    visible:{ 
        x:"0",
        transition:{
            delay: 0.1,
            duration:0.4,}
    }
};

const childVariants = {
    hidden: {
        opacity:0,
        transition: {
            staggerChildren: 0.2,
            staggerDirection: -1
        }
    },
    visible: {
        opacity:1,
        transition: {
            staggerChildren: 0.2,
            staggerDirection: 1
        }
    }
};
const Mobile = ({currentCategory,setCurrentCategory,setCurrentStage,currentStage,setShowModal,addRunner, StatusRider,idRider,showModal,stageServer,categoryServer})=>{    
    
    let ridersTest = Riders();

    let getStatusStage = (stages)=>{ 
        let stage = stages.filter(stage=> stage.stage == currentStage.name);  
        return stage[0]?.status;
    };

    const jsonParserStatus = (stages,status) =>{ 
        let getStage = stages.filter(stage => stage.stage == currentStage.name);  
        return getStage[0]?.status != status; 
    };

    const filterCategory = (category) =>{ 
        return ridersTest?.filter(item => item.category === category);
    };
    
    return(
        <AnimatePresence>
            {showModal.showNavBar && (
                <motion.div className="w-[100vw] h-[100vh] bg-black/75 absolute top-0 z-30"
                    variants={backdrop}
                    initial="hidden"
                    animate="visible"
                    exit ="hidden"
                >
                    <motion.div variants={modal} className="z-40 border h-[100vh] bg-white relative rounded w-4/5"> 
                        <motion.div variants={childVariants}>
                            <center className="mt-2 font-bold text-lg">Tie-Mer</center>
                            <button className="absolute z-20 top-0 -right-1 rounded-full p-3 text-black cursor-pointer" onClick={()=>{setShowModal({...showModal, showNavBar:false});}}> <Close/></button>
                            <div className="mt-5">
                                <Select items={stageServer} label="Stages" getValue={(value)=>{setCurrentStage(JSON.parse(value));}} currentSelect={currentStage}/> 
                            </div>
                            <div className="mt-5">
                                <Select items={categoryServer} label="Category" getValue={value=>setCurrentCategory(JSON.parse(value))} currentSelect={currentCategory}/>
                            </div>
                            <div  className="mx-2 relative overflow-y-auto h-[75vh]">
                                {currentCategory?.name ? filterCategory(currentCategory?.name)?.map((item,index)=>{
                                    return(
                                        <div key={index} className={!jsonParserStatus(item.status,StatusRider.FINISHED) ? "line-through w-full shadow-md text-red-500 font-bold" : "no-underline w-full font-medium shadow-md"}>
                                            <div className="grid grid-cols-8 gap-2 border py-1 mb-1 px-1 rounded-md justify-center items-center">
                                                <div className="col-span-5 ml-3"> 
                                                    <div className={!jsonParserStatus(item.status,StatusRider.FINISHED) ? "line-through text-red-500 font-bold" : "no-underline"}>
                                                    #{item.number} {getStatusStage(item.status)}</div>
                                                    <div className="text-xs">Name: {item.name}</div>
                                                </div>
                                                <button className="cursor-pointer" onClick={()=>addRunner(item , StatusRider.ONBOARD,currentStage.name)} 
                                                    disabled={jsonParserStatus(item.status,StatusRider.WAITING)}>
                                                    <ButtonIcon title="Start" Icon={<AddUser/>}></ButtonIcon>
                                                </button> 
                                                <div className="cursor-pointer" onClick={()=>{setShowModal({...showModal, showDelete:true,showNavBar:false}); idRider.current = item.id;}}>
                                                    <ButtonIcon title="Start" Icon={<Trash/>}></ButtonIcon>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }) : <div>Loading</div>}
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Mobile;