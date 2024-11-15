const TableHead = (props)=>{
    return (
        <th scope="col" className="py-3.5 px-4 text-xs font-normal text-left rtl:text-right text-gray-500" {...props}>
            {props.children}
        </th>
    );
};

export default TableHead;