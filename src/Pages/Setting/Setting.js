
import Sidebar from "../../components/Layout/Sidebar";
const Setting = ()=>{
    return (<>
        <Sidebar>
            <div>
                <div className="border-b border-slate-400">
                    <div className="p-4 font-bold text-xl text-blue-600">
                        Settings
                    </div>
                </div> 
                <div className="bg-white rounded-md m-0 2md:m-4 h-[88vh] overflow-y-auto">
                    <div className="m-2 relative flex">
                        <div className="flex border rounded-xl overflow-hidden bg-white border-[#d8d8d8] py-1 px-1">
                            
                        </div>
                    </div>
                </div> 
            </div>
        </Sidebar>
    </>);
};

export default Setting;