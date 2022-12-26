
import Input from "../../UI/Input";
import { Category, Trash,Close } from "../../components/Icons/Icons"; 
import CategoryController, { AddMutipleCategory } from "../../data/categoryController";
import { useRef,useState } from "react"; 
const CategoryPage = ({closeModal,showToast}) =>{ 
    const [groupCategory,setgroupCategory] = useState([]);  
    const category = useRef("");     
    let categoryInServer = CategoryController();
    const onDeleteHandler = (item)=>{
        console.log(item);
        setgroupCategory((prev)=> prev.filter(itemCat => itemCat != item));
    } ;
    const saveHandle = async()=>{
        console.log(groupCategory);
        if(groupCategory.length){
            await AddMutipleCategory(groupCategory);
            showToast("success","Categories Saved","Successfully");
            closeModal();
        }else{
            alert("Empty");
        }
    };
    const setSpacesAndLowerCase = (text)=>{
        return text.toLowerCase().trim().replace(/\s+/g, "");
    };
    return(<div className="relative">
        <button className="text-lg absolute right-2 -top-1" onClick={closeModal}>
            <Close/>
        </button> 
        <div className="border-b mb-2">
            <div className="font-bold text-md ml-4 mt-2">Add Category</div>
        </div>
        <div className="m-auto md:w-[80%] sm:w-[100%] xs:w-[100%] lg:w-[80%] mt-3">   
            <div className="grid grid-cols-8 items-center"> 
                <div className="col-span-7">
                    <Input label="Category Name" type="text" value={category}/>
                </div> 
                <button className="col-span-1 cursor-pointer" onClick={()=>{  
                    if(category.current.value.trim().length){
                        let duplicate = groupCategory.some(item => setSpacesAndLowerCase(item.name) === setSpacesAndLowerCase(category.current.value));
                        let duplicateServer = categoryInServer.some(item => setSpacesAndLowerCase(item.name) === setSpacesAndLowerCase(category.current.value)); //check in server 
                        if(duplicate || duplicateServer)
                            alert("Category are in the list"); 
                        else{ 
                            const newCat = category.current.value;
                            setgroupCategory(()=>[...groupCategory,{name:newCat.trim()}]);   
                            category.current.value = "";   
                        }
                            
                    }else{
                        alert("Empty List");
                    } 
                }}><Category/></button> 
            </div>
            <div className="mx-2">
                <div className="grid grid-cols-8 gap-3 items-center text-xs pt-2 font-bold">
                    <div className="ml-3 col-span-6">Category Name</div>
                    <div className="col-span-2">Action</div>  
                </div>
                <div className="relative overflow-y-auto max-h-[30vh] border rounded-md shadow-lg">
                    {
                        groupCategory?.map((item,index)=>{
                            return(
                                <div key={index} className="grid grid-cols-8 gap-3 items-center text-xs border-b py-3">
                                    <div className="ml-3 col-span-7 font-bold">{item.name}</div> 
                                    <button className="curspor pointer" onClick={()=>onDeleteHandler(item)}><Trash/></button>
                                </div>
                            );
                        })
                    } 
                </div>
            </div>
            <div className="flex justify-end items-center rounded-br-lg my-2">
                <button className="text-white font-medium px-8 py-2 rounded-lg cursor-pointer bg-indigo-500 mr-2 text-xs" onClick={saveHandle}>Save</button>
            </div>
        </div> 
    </div>);
};

export default CategoryPage;