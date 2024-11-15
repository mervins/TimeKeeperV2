const TableCell = (props)=>{
    return (
        <td className="px-2 text-xs font-medium text-gray-700  whitespace-nowrap" {...props}>
            {props.children}
        </td>
    );
};

export default TableCell;