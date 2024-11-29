
import Sidebar from "../../components/Layout/Sidebar";
import TableContainer from "../../components/Table/TableContainer";
import Table from "../../components/Table/Table";
import TableBody from "../../components/Table/TableBody";
import TableHead from "../../components/Table/TableHead";
import TableCell from "../../components/Table/TableCell";
import StageController from "../../data/stageController";
import { FaRegTrashAlt,FaPen  } from "react-icons/fa";
import StagesModal from "../../components/Modal/Create/Stage";
import DeleteStage from "../../components/Modal/Delete/DeleteStage";
import EditStage from "../../components/Modal/Update/UpdateStage";
import { useDialogHook } from "../../util/customehooks";
import React from "react";
import { TimerContext } from "../../context/TimerContext";



const Stage = ()=>{
    const stageServer = StageController();  
    const {showToast} = React.useContext(TimerContext);

    
    const createCategories = useDialogHook(StagesModal);
    const editStage = useDialogHook(EditStage);
    const deleteDialog = useDialogHook(DeleteStage);

    const createHandle = ()=>{
        createCategories({}, (callback) => {
            if(callback?.success){
                showToast("success","Stage Saved","Successfully");
            }
        });
    };
    const editHandler = (item)=>{
        editStage({ data:item }, (callback) => {
            if(callback?.success){
                showToast("success","Stage Saved","Successfully");
            }
        });
        
    };

    const confirmDelete = (item)=>{
        deleteDialog({stage:item},(callback)=>{
            if(callback.success){
                showToast("success","Stage Deleted","Successfully");
            }
        });
    };
    return (<>
        <Sidebar>
            <div>
                <div className="border-b border-slate-400">
                    <div className="p-4 font-bold text-xl text-blue-600">
                        Stages
                    </div>
                </div> 
                <div className="bg-white rounded-md m-0 2md:m-4 h-[88vh] overflow-y-auto">
                    <div className="m-2 mx-2 sm:m-4 sm:mx-10 relative flex justify-end">
                        <div>
                            <button className="bg-[#0d6ed1] text-white py-2 px-4 p-2 border rounded-lg text-xs font-bold" onClick={createHandle}>
                                Add Stage
                            </button>
                        </div>
                    </div>
                    <div className="text-[8px] md:text-base px-1">  
                        <div className=' text-gray-600'>
                            <TableContainer> 
                                <Table>
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {
                                                ["No","Name","Action"].map((header,key)=>{
                                                    return(
                                                        <TableHead key={key} className="text-center">
                                                            {header}
                                                        </TableHead> 
                                                    );
                                                })
                                            }
                                        </tr>
                                    </thead>
                                    <TableBody> 
                                        {
                                            
                                            stageServer?.map((result,key)=>{
                                                return(
                                                    <tr className='hover:bg-gray-200' key={key}> 
                                                        <TableCell className="py-2 px-2 text-[12px] text-black text-center">
                                                            {key + 1}
                                                        </TableCell>  
                                                        <TableCell className="py-2 px-2 text-[12px] text-black text-center">
                                                            {result.name}
                                                        </TableCell>  
                                                        <TableCell className="py-2 px-2 text-[12px] text-black text-center flex justify-center gap-4">
                                                            <button className="text-base" onClick={()=>editHandler(result)}>
                                                                <FaPen />
                                                            </button>
                                                            <button className="text-base text-red-500" onClick={()=>confirmDelete(result)}>
                                                                <FaRegTrashAlt/>
                                                            </button>
                                                        </TableCell>
                                                    </tr> 
                                                );
                                            })
                                        }
                                    </TableBody>
                                </Table>  
                            </TableContainer>
                        </div>
                    </div>
                </div> 
            </div>
        </Sidebar>
    </>);
};

export default Stage;