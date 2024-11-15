
import Sidebar from "../../components/Layout/Sidebar";
import CategoryContrller from "../../data/categoryController";
import TableContainer from "../../components/Table/TableContainer";
import Table from "../../components/Table/Table";
import TableBody from "../../components/Table/TableBody";
import TableHead from "../../components/Table/TableHead";
import TableCell from "../../components/Table/TableCell";
import React from "react";

const Category = ()=>{
    
    let categoryServer = CategoryContrller();
    return (<>
        <Sidebar>
            <div>
                <div className="border-b border-slate-400">
                    <div className="p-4 font-bold text-xl text-yellow-600">
                        Category
                    </div>
                </div> 
                <div className="bg-white rounded-md m-0 2md:m-4 h-[88vh] overflow-y-auto">
                    <div className="m-2 relative flex justify-end">
                        <div>
                            <button className="bg-[#0d6ed1] text-white py-2 px-4 p-2 border rounded-lg text-xs font-bold">
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
                                                ["No","Name"].map((header,key)=>{
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
                                                            {key + 1}
                                                        </TableCell>  
                                                        <TableCell className="py-2 px-2 text-[12px] text-black text-center">
                                                            {result.name}
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