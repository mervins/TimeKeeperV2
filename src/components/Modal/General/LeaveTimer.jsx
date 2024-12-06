
import Modal from "../Modal";

const GoToDashboard = ({goToDash,hide})=>{
    
    return(<Modal>
        <div className="flex flex-col justify-center items-center">
            <div className="text-lg font-medium mt-6 mb-4  p-4">Are you sure want to leave this timer? It might be not saving your progress.</div>
            <div className="flex w-full justify-between mt-8 h-16 bg-slate-200 rounded-b-lg">
                <button className="flex justify-center items-center w-full cursor-pointer text-xl font-medium" onClick={hide}>
                    Cancel
                </button>
                <button className="flex justify-center items-center w-full cursor-pointer bg-indigo-500 rounded-br-lg" onClick={goToDash}>
                    <div className="text-white font-medium text-xl" >Continue</div>
                </button>
            </div>
        </div>
    </Modal>);
};

export default GoToDashboard;