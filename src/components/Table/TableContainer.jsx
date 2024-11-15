
const TableContainer = ({children,addClass})=>{
    return(
        <section className={`container px-4 mx-auto ${addClass}`}>
            <div className="flex flex-col">
                <div className="-mx-6 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-5">
                        <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                            {children}
                        </div>
                    </div>
                </div>
            </div> 
        </section>
    );
};
export default TableContainer;
