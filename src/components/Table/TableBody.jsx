const TableBody = (props)=>{
    return (
        <tbody className="bg-white divide-y divide-gray-200"  {...props}>
            {props.children}
        </tbody>
    );
};

export default TableBody;