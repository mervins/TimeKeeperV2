
const RerunMessage = (props)=>{
    return(<>
        <div className="flex flex-col justify-center items-center">
            <div className="text-lg font-medium mt-6 mb-4">{props.message}</div>
            <div className="flex w-full justify-between mt-8 h-16 bg-slate-200 rounded-b-lg">
                <div className="flex justify-center items-center w-full cursor-pointer text-xl font-medium" onClick={props.closeModal}>
                    Cancel
                </div>
                <div className="flex justify-center items-center w-full cursor-pointer bg-indigo-500" onClick={props.confirmReRun()}>
                    <div className="text-white font-medium text-xl" >{props.label}</div>
                </div>
            </div>
        </div>
    </>);
};

export default RerunMessage;