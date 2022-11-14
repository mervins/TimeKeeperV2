import { Doc } from "../../components/Icons/Icons";
import { read, utils } from "xlsx";
import {useState} from "react";
import { AddMutipleRider } from "../../data/ridersController";
const ImportModal = (props) =>{

    const [rows, setRows] = useState([]);  
    
    const handleImport = ($event) => { 
        const files = $event.target.files;
        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = async (event) => {
                const wb = read(event.target.result);
                const sheets = wb.SheetNames; 
                if (sheets.length) {
                    setRows(()=>utils.sheet_to_json(wb.Sheets[sheets[0]]));
                    console.log(rows); 
                }
            };
            reader.readAsArrayBuffer(file);
        }else{
            alert("error");
        }
    };

    const saveHandle = () => {
        let difference = rows.filter((item)=> props.ridersTest.every(item2 => item2.number != item.number));
        console.log(difference);
        AddMutipleRider(difference); 
        props.messageToast();
        props.closeModal();
    };
    return (
        <> 
            <div className="flex flex-col justify-center items-center">
                <div className="text-2xl font-medium mt-6 mb-4">Import Files</div>
                <input type="file" name="file" className="custom-file-input hidden" id="inputGroupFile" required onChange={handleImport}
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/> 
                <label className="custom-file-label" htmlFor="inputGroupFile">
                    <div className="p-12 m-2 border rounded-md bg-white shadow-md cursor-pointer">
                        <Doc></Doc>
                    </div>
                </label>
                <div>Total Rideres imported {rows.length}</div>
                <div className="flex w-full justify-between mt-8 h-16 bg-slate-200 rounded-b-lg">
                    <div className="flex justify-center items-center w-full cursor-pointer text-xl font-medium" onClick={props.closeModal}>
                        Cancel
                    </div>
                    <div className="flex justify-center items-center w-full cursor-pointer bg-indigo-500" onClick={saveHandle}>
                        <div className="text-white font-medium text-xl">Save</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ImportModal;