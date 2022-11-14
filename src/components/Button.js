
export const ButtonIcon = (props)=>{
    const {Icon} = props;
    return(<div className="relative rounded-full cursor-pointer shadow-md group"> 
        <div className="flex">
            <div className="border border-gray-500 rounded-full bg-slate-200 p-1">{Icon}</div>
        </div>   
    </div>);
};

const Button = ()=>{
    return(<>

    </>);
};

export default Button;