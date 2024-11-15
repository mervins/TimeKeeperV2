const Table = (props)=>{
    return (
        <table className="min-w-full divide-y divide-gray-200 bg-gray-50" {...props}>
            {props.children}
        </table>
    );
};
export default Table;
