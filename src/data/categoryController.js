import { db } from "./db";
import { useLiveQuery } from "dexie-react-hooks";

let CategoryContrller = () => {
    return useLiveQuery(
        () => db.category.toArray()
    );
};

export const AddIndividualCategory = async(Category) => {
    await db.category.add(Category);
};

export const AddMutipleCategory = async (rows) => {
    await db.category.bulkAdd(rows);
};

export const UpdateCategory = async(id,detail) => {
    // await db.category.put({category:category});
    await db.category
        .where("id")
        .equals(id)
        .modify(category => {
            Object.assign(category, detail);
        }); 
};


export const DeleteAllCategory = async() => {
    await db.category.clear();
};

export const DeleteCategory = async(id) => {
    await db.category.delete(id);
};

export default CategoryContrller;