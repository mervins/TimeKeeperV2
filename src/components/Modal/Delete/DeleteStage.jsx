
import { DeleteStageIn } from "../../../data/stageController";
import Modal from "../Modal";

const DeleteStage = ({stage,hide})=>{
    const removeRider = () => {
        DeleteStageIn(stage.id);
        hide({sucess:true});
    };
    return(<Modal>
        <div className="flex flex-col justify-center items-center">
            <div className="text-lg font-medium mt-6 mb-4  p-4">Could you please confirm that you want to delete the stage ({stage.name})?
                <div className="rounded-md border flex justify-center p-4 mt-2">
                    <div className="text-red-500">
                        This also delete the all history record of the rider in this stage.
                    </div>
                </div>
            </div>
            <div className="flex w-full justify-between mt-8 h-16 bg-slate-200 rounded-b-lg">
                <button className="flex justify-center items-center w-full cursor-pointer text-xl font-medium" onClick={hide}>
                    Cancel
                </button>
                <button className="flex justify-center items-center w-full cursor-pointer bg-indigo-500 rounded-br-lg" onClick={removeRider}>
                    <div className="text-white font-medium text-xl" >Continue</div>
                </button>
            </div>
        </div>
    </Modal>);
};

export default DeleteStage;