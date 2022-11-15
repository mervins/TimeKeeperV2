
export const ButtonIcon = (props)=>{
    const {Icon} = props;
    return(<div className="relative rounded-full cursor-pointer shadow-md group"> 
        <div className="flex">
            <div className="border border-gray-500 rounded-full bg-white p-1 shadow-lg">{Icon}</div>
        </div>   
    </div>);
};

const Button = ()=>{
    return(<>

    </>);
};

export default Button;