
import Sidebar from "../../components/Layout/Sidebar";
import CategoryContrller from "../../data/categoryController";
import TableContainer from "../../components/Table/TableContainer";
import Table from "../../components/Table/Table";
import TableBody from "../../components/Table/TableBody";
import TableHead from "../../components/Table/TableHead";
import TableCell from "../../components/Table/TableCell";
import React,{useContext} from "react";
import { useDialogHook } from "../../util/customehooks";
import { FaRegTrashAlt,FaPen  } from "react-icons/fa";
import CategoryModal from "../../components/Modal/Create/Category";
import UpdateCategoryModal from "../../components/Modal/Update/UpdateCategory";
import DeleteCategoryModal from "../../components/Modal/Delete/DeleteCategory";
import { TimerContext } from "../../context/TimerContext";


const Category = ()=>{
    
    let categoryServer = CategoryContrller();
    const createCategories = useDialogHook(CategoryModal);
    const editCategory = useDialogHook(UpdateCategoryModal);
    const deleteDialog = useDialogHook(DeleteCategoryModal);
    const {showToast} = useContext(TimerContext);
    const createHandle = ()=>{
        createCategories({}, (callback) => {
            if(callback?.success){
                showToast("success","Category Saved","Successfully");
            }
        });
    };
    const editHandler = (item)=>{
        editCategory({ category:item }, (callback) => {
            if(callback?.success){
                showToast("success","Category Saved","Successfully");
            }
        });
        
    };

    const confirmDelete = (item)=>{
        deleteDialog({category:item},(callback)=>{
            if(callback.success){
                showToast("success","Category Deleted","Successfully");
            }
        });
    };
    return (<>
        <Sidebar>
            <div>
                <div className="border-b border-slate-400">
                    <div className="p-4 font-bold text-xl text-yellow-600">
                        Category
                    </div>
                </div> 
                <div className="bg-white rounded-md m-0 2md:m-4 h-[88vh] overflow-y-auto">
                    <div className="m-2 mx-2 sm:m-4 sm:mx-10 relative flex justify-end">
                        <div>
                            <button className="bg-[#0d6ed1] text-white py-2 px-4 p-2 border rounded-lg text-xs font-bold" onClick={createHandle}>
                                Add Category
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
                                                ["ID","Name","Action"].map((header,key)=>{
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
                                            
                                            categoryServer?.map((result,key)=>{
                                                return(
                                                    <tr className='hover:bg-gray-200' key={key}> 
                                                        <TableCell className="py-2 px-2 text-[12px] text-black text-center">
                                                            {result.id}
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

export default Category;