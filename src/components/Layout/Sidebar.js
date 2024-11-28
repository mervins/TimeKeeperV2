import { FcAlarmClock,FcSportsMode ,FcLandscape,FcMindMap, FcServices,FcHome  } from "react-icons/fc";
import { NavLink } from "react-router-dom";
import { motion,AnimatePresence  } from "framer-motion"; 
import React from "react";
import {  Close } from "../../components/Icons/Icons";
import { FaBars } from "react-icons/fa";

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

const Sidebar = ({children})=>{
    const [showModal,setShowModal] =React.useState(false);
    const lists = [
        {
            icon:<FcSportsMode className="text-2xl"/>,
            label: "Participants",
            path: "/participants"
        },
        {
            icon:<FcMindMap className="text-2xl"/>,
            label: "Category",
            path: "/category"
        },
        {
            icon:<FcLandscape className="text-2xl"/>,
            label: "Stages",
            path: "/stages"
        },
        {
            icon:<FcLandscape className="text-2xl"/>,
            label: "Results",
            path: "/results"
        },
        {
            icon:<FcAlarmClock className="text-2xl"/>,
            label: "Tie-Mer",
            path: "/timer"
        },
        {
            icon:<FcHome className="text-2xl"/>,
            label: "Home Page",
            path: "/"
        },
        {
            icon:<FcServices className="text-2xl"/>,
            label: "Settings",
            path: "/setting"
        }
    ];

    return (<>
        <div className="relative h-[100vh] flex w-full">   
            <button className=" text-2xl absolute top-4 right-4 inline lg:hidden" onClick={()=>{setShowModal(true);}}>
                <FaBars/>
            </button>
            <div className="border  max-w-[300px] w-full hidden lg:inline"> 
                <div className="relative overflow-y-auto h-screen">
                    <div className="h-screen bg-gray-50 border-r border-gray-200 flex flex-col justify-between">
                        {/* Logo and Top Section */}
                        <div>
                            <div className="flex items-center px-6 py-3 gap-2">
                                {/* <img src="logo.png" alt="Zendenta Logo" className="h-8 w-8 mr-2" /> */}
                                <FcAlarmClock className="h-8 w-8 text-white" />
                                <span className="text-xl font-bold text-yellow-500 text-center">Dashboard</span>
                            </div>
                            <nav className="mt-2">
                                <ul>
                                    {
                                        lists.map((item,index)=>{
                                            return (
                                                <li className="my-3 mx-4" key={index}>
                                                    <NavLink 
                                                        to={item.path} 
                                                        exact
                                                        className="flex items-center space-x-3 px-6 py-2 text-gray-600 hover:text-blue-500"
                                                        activeClassName="text-slate-100 rounded-md bg-yellow-500 text-white font-semibold hover:text-slate-200"
                                                    >
                                                        <div className=" flex items-center space-x-2">
                                                            {item.icon}
                                                            <span>{item.label}</span>
                                                        </div>
                                                    </NavLink>
                                                </li>
                                            );
                                        })
                                    }
                                   
                                    
                                </ul>
                            </nav>
                        </div>

                        {/* Bottom Section */}
                        {/* <div className="px-6 py-4">
                            <div className="flex items-center space-x-4">
                                <img src="https://via.placeholder.com/40" alt="Profile" className="h-10 w-10 rounded-full" />
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Drg. Adam H.</p>
                                    <p className="text-xs text-gray-500">Dentist</p>
                                </div>
                            </div>
                        </div> */}
                    </div>  
                </div>
            </div>
            <div className="border grow overflow-y-auto h-[100vh] bg-[#E4E9F2]">
                <div>  
                    {children}
                </div>
            </div> 
            <div>
            </div>  
        </div>
        <AnimatePresence>
            {showModal && (
                <motion.div className="w-[100vw] h-[100vh] bg-black/75 absolute top-0 z-30"
                    variants={backdrop}
                    initial="hidden"
                    animate="visible"
                    exit ="hidden"
                >
                    <motion.div variants={modal} className="z-40 border h-[100vh] bg-white relative rounded w-4/5"> 
                        <motion.div variants={childVariants}>
                            <div>
                                <div className="flex items-center px-6 py-3 gap-2 justify-between">
                                    {/* <img src="logo.png" alt="Zendenta Logo" className="h-8 w-8 mr-2" /> */}
                                    <div className="flex gap-2 items-center">
                                        <FcAlarmClock className="h-6 w-6 md:h-8 md:w-8 text-white" />
                                        <span className="text-xl font-bold text-yellow-500 text-center">Dashboard</span>
                                    </div>
                                    <button onClick={()=>{setShowModal(false);}}>
                                        <Close/>
                                    </button>
                                </div>
                                <nav className="mt-2">
                                    <ul>
                                        {
                                            lists.map((item,index)=>{
                                                return (
                                                    <li className="my-3 mx-4" key={index}>
                                                        <NavLink 
                                                            to={item.path} 
                                                            exact
                                                            className="flex items-center space-x-3 px-6 py-2 text-gray-600 hover:text-blue-500"
                                                            activeClassName="text-slate-100 rounded-md bg-yellow-500 text-white font-semibold hover:text-slate-200"
                                                        >
                                                            <div className=" flex items-center space-x-2">
                                                                {item.icon}
                                                                <span>{item.label}</span>
                                                            </div>
                                                        </NavLink>
                                                    </li>
                                                );
                                            })
                                        }
                                    
                                        
                                    </ul>
                                </nav>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    </>);
};

export default Sidebar;