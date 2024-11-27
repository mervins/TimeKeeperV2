
import { Close } from "../../Icons/Icons";
import CategoryController, { UpdateCategory } from "../../../data/categoryController";
import { useState } from "react"; 
import Modal from "../Modal";

const UpdateCategoryModal = ({category, hide}) =>{ 
    const [categoryItem,setCategory] = useState(category);  
    let categoryInServer = CategoryController();

    const setSpacesAndLowerCase = (text)=>{
        return text.toLowerCase().trim().replace(/\s+/g, "");
    };

    const saveHandler = async() =>{
        if(categoryItem.name.trim().length){
            let duplicateServer = categoryInServer.filter(item => item.id != category.id).some(item => setSpacesAndLowerCase(item.name) === setSpacesAndLowerCase(categoryItem.name)); //check in server 
            if(duplicateServer)
                alert("Category are in the list"); 
            else{ 
                await UpdateCategory(parseInt(categoryItem.id),categoryItem);
                hide({success:true});
            }
                
        }else{
            alert("Empty List");
        } 
    };
    return(
        <Modal>
            <div className="relative">
                <button className="text-lg absolute right-2 -top-1" onClick={hide}>
                    <Close/>
                </button> 
                <div className="border-b mb-2">
                    <div className="font-bold text-md ml-4 mt-2">Update Category</div>
                </div>
                <div className="m-auto md:w-[80%] sm:w-[100%] xs:w-[100%] lg:w-[80%] mt-3">   
                    <div className="my-4 mt-5"> 
                        <div className="relative z-0 group border-none m-1">
                            <input label="Name" type="text" name="name" value={categoryItem.name} onChange={(e)=>{
                                setCategory((prev)=> {return {...prev, name:e.target.value};});}}
                            className="truncate block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent focus:border-blue-600 border appearance-none focus:outline-none focus:ring-0 peer rounded-lg px-[15px] disabled:cursor-not-allowed"></input> 
                            <label htmlFor="UserInput" className="peer-focus:font-medium absolute text-sm text-gray-600 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-85 peer-focus:-translate-y-6 ml-2 px-4 peer-placeholder-shown:-z-10 peer-focus:z-20 rounded-lg bg-white">Name</label>
                        
                        </div> 
                    </div>
                    <div className="flex justify-end items-center rounded-br-lg my-2">
                        <button className="text-white font-medium px-8 py-2 rounded-lg cursor-pointer bg-indigo-500 mr-2 text-xs" onClick={saveHandler}>Save</button>
                    </div>
                </div> 
            </div>
        </Modal>
    );
};

export default UpdateCategoryModal;