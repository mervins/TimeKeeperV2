import { ButtonIcon } from "../../components/Button";
import {  Close, AddUser,Trash } from "../../components/Icons/Icons";


const Mobile = ({currentCategory,currentStage,jsonParserStatus,setShowModal,setCurrentStage,addRunner,
    setCurrentCategory,DeleteAllTables,filterCategory,
    StatusRider,idRider,showModal})=>{
    return( 
        <div className="w-full -top-0 h-full absolute" > 
            <div className="z-40 bg-white absolute right-1 h-full">
                <div className="absolute z-20 top-3 left-2 bg-red-500 rounded-full p-3 text-white cursor-pointer" onClick={()=>{setShowModal({...showModal, showNavBar:false});}}> <Close/></div>
                <div className="borde w-[100vw] rounded-l-lg"> 
                    <div className="mt-3 flex gap-1 justify-center items-center">
                        {/* <div className="p-2 w-24 border rounded-md bg-white shadow-md cursor-pointer text-center bg-blue-500 text-white" onClick={()=>setShowModal({...showModal, showResult:true,showNavBar:false})}>RANK</div> */}
                        <div className="p-2 w-24 border rounded-md bg-white shadow-md cursor-pointer text-center bg-orange-400 text-white" onClick={()=>setShowModal({...showModal, showImport:true,showNavBar:false})}>IMPORT</div>   
                        <div className="p-2 w-24 border rounded-md bg-white shadow-md cursor-pointer text-center bg-red-500 text-white" onClick={()=>DeleteAllTables()}>CLEAR</div>
                    </div>
                    <div className="relative z-0 mt-6 group border-none m-2">
                        <select value={currentStage} onChange={(e)=>{setCurrentStage(e.target.value);}} className="truncate block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent  border-ssr-blue2 border-[1.9px] appearance-none focus:outline-none focus:ring-0 peer rounded-lg px-[15px] disabled:cursor-not-allowed">
                            <option value={"Stage1"}>Stage 1</option>
                            <option value={"Stage2"}>Stage 2</option>
                            <option value={"Stage3"}>Stage 3</option>  
                        </select>
                        <label className="peer-focus:font-medium absolute text-sm text-gray-600 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6 ml-2 px-4 peer-placeholder-shown:-z-10 peer-focus:z-20 rounded-lg bg-white">Stage</label>
                    </div>
                    <div className="relative z-0 mt-6 group border-none m-2">
                        <select value={currentCategory} onChange={(e)=>{setCurrentCategory(e.target.value);}} className="truncate block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent  border-ssr-blue2 border-[1.9px] appearance-none focus:outline-none focus:ring-0 peer rounded-lg px-[15px] disabled:cursor-not-allowed">
                            <option value={"Beginner"}>Beginner</option>
                            <option value={"Advance"}>Advance</option>
                            <option value={"19 below"}>19 Below</option>
                            <option value={"20-29"}>20 - 29</option>
                            <option value={"30-39"}>30 - 39</option> 
                            <option value={"40 up"}>40 up</option>
                            <option value={"Executive"}>Executive</option>
                            <option value={"Ladies"}>Ladies</option>
                        </select>
                        <label className="peer-focus:font-medium absolute text-sm text-gray-600 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6 ml-2 px-4 peer-placeholder-shown:-z-10 peer-focus:z-20 rounded-lg bg-white">Category</label>
                    </div>
                    <div className="mx-2 relative overflow-y-auto h-[75vh]">
                        {filterCategory(currentCategory)?.map((item,index)=>{
                            return(
                                <div key={index} className={!jsonParserStatus(item.status,StatusRider.FINISHED) ? "line-through w-full shadow-md text-red-500 font-bold" : "no-underline w-full font-medium shadow-md"}>
                                    <div className="grid grid-cols-8 gap-2 border py-1 mb-1 px-1 rounded-md justify-center items-center">
                                        <div className="col-span-5 ml-3"> 
                                            <div className={!jsonParserStatus(item.status,StatusRider.FINISHED) ? "line-through text-red-500 font-bold" : "no-underline"}>
                                                #{item.number} {JSON.parse(item.status)[currentStage]}</div>
                                            <div className="text-xs">Name: {item.name}</div>
                                        </div>
                                        <button className="cursor-pointer" onClick={()=>addRunner(item , StatusRider.ONBOARD)} 
                                            disabled={jsonParserStatus(item.status,StatusRider.WAITING)}>
                                            <ButtonIcon title="Start" Icon={<AddUser/>}></ButtonIcon>
                                        </button> 
                                        <div className="cursor-pointer" onClick={()=>{setShowModal({...showModal, showDelete:true,showNavBar:false}); idRider.current = item.id;}}>
                                            <ButtonIcon title="Start" Icon={<Trash/>}></ButtonIcon>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div> 
            <div className="z-30 w-full h-full absolute -top-0 bg-black/75" onClick={()=>{setShowModal({...showModal, showNavBar:false});}}></div>
        </div> 
    );
};

export default Mobile;