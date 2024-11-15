
import Sidebar from "../../components/Layout/Sidebar";
import React,{useState,useEffect} from "react";
import CategoryContrller from "../../data/categoryController";
import TableContainer from "../../components/Table/TableContainer";
import Table from "../../components/Table/Table";
import TableBody from "../../components/Table/TableBody";
import TableHead from "../../components/Table/TableHead";
import TableCell from "../../components/Table/TableCell";
import Riders from "../../data/ridersController";
import ParticipantsModal from "../../components/Modal/Create/Participants";
import { useDialogHook } from "../../util/customehooks";
import Toast, {toastProperties} from "../../components/Toast/Toast";
import { FaRegTrashAlt,FaPen  } from "react-icons/fa";
import Select from "../../UI/Select";
import UpdateParticipants from "../../components/Modal/Update/UpdateParticipants";


const Participants = ()=>{
    let categoryServer = CategoryContrller();
    let ridersParticipants = Riders();
    const [catID, setCatID] = useState(null);
    const [listToast, setListToast] = useState([]);   
    // eslint-disable-next-line no-unused-vars
    const [participant, setParticipant] = useState({});

    const createParticipants = useDialogHook(ParticipantsModal);
    const editParticipans = useDialogHook(UpdateParticipants);
    const showToast = (type,message,title)=>{ 
        let toast = toastProperties(type,message,title);  
        setListToast([...listToast, toast]);   
    };
    useEffect(() => {
        if (typeof categoryServer != "undefined") { 
            setCatID(categoryServer[0]); 
            console.log(catID);
        }
    }, [categoryServer]);

    const createHandle = ()=>{
        createParticipants({ riders:ridersParticipants, categoryServer }, (callback) => {
            if(callback?.success){
                showToast("success","Riders Saved","Successfully");
            }
        });
    };

    const editHandler = (item)=>{
        setParticipant(item);
        editParticipans({ riders:ridersParticipants, categoryServer,participant:item }, (callback) => {
            if(callback?.success){
                showToast("success","Participant Saved","Successfully");
            }
        });
        
    };
    const listItem = listToast.map((toast, i) =>    {
        return (
            <Toast key={i} toast={toast} position="top-left"></Toast>
        );
    }        
    );
    return (<>
        <Sidebar>
            {listItem}
            <div>
                <div className="border-b border-slate-400">
                    <div className="p-4 font-bold text-xl text-yellow-600">
                        Participants
                    </div> 
                </div>
                <div className="bg-white rounded-md m-0 2md:m-4 h-[88vh] overflow-y-auto">
                    <div className="m-2 relative flex justify-between flex-wrap">
                        <div className="hidden md:inline flex border rounded-xl overflow-hidden bg-white border-[#d8d8d8] py-1 px-1">
                            {categoryServer && categoryServer.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setCatID(cat)}
                                    className={`px-4 py-2 font-medium transition-colors duration-200 capitalize rounded-xl text-xs font-bold ${
                                        catID?.id === cat.id
                                            ? "bg-[#deeeff] text-[#0d6ed1] "
                                            : "text-[#bababa] hover:text-[#0d6ed1]"
                                    }`}
                                >
                                    <div className="font-bold">{cat.name} </div>
                                </button>
                            ))}
                        </div>
                        <Select className="inline md:hidden" items={categoryServer} label="Category" getValue={value=>setCatID(parseInt(value))} currentSelect={catID?.id}/>
                        <div>
                            <button className="bg-[#0d6ed1] text-white py-2 px-4 p-2 border rounded-lg text-xs font-bold" onClick={createHandle}>
                                Add Participant
                            </button>
                        </div>
                    </div>
                    <div className="text-[8px] md:text-base px-1">  
                        <div className='text-gray-600'>
                            <TableContainer> 
                                <Table>
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {
                                                ["Race #","Name", "Category", "Action"].map((header,key)=>{
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
                                            
                                            ridersParticipants?.filter(parti => parti.category_id === (catID?.id || catID)).map((result,key)=>{
                                                return(
                                                    <tr className='hover:bg-gray-200' key={key}> 
                                                        <TableCell className="py-2 px-2 text-[12px] text-black text-center">
                                                            {result.number}
                                                        </TableCell>  
                                                        <TableCell className="py-2 px-2 text-[12px] text-black text-center">
                                                            {result.name}
                                                        </TableCell>  
                                                        <TableCell className="py-2 px-2 text-[12px] text-black text-center">
                                                            {catID?.name}
                                                        </TableCell>
                                                        <TableCell className="py-2 px-2 text-[12px] text-black text-center flex justify-center gap-4">
                                                            <button className="text-base" onClick={()=>editHandler(result)}>
                                                                <FaPen />
                                                            </button>
                                                            <button className="text-base text-red-500">
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

export default Participants;