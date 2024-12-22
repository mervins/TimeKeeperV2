import { db } from "./db";
import { useLiveQuery } from "dexie-react-hooks";

let Settings = () => {
    return useLiveQuery(
        () => db.settings.toArray()
    );
};

export const updateSetting = async(settings) => {
    try {
        await db.transaction("rw", db.settings, async () => {
            // Fetch the single record
            const existingSetting = await db.settings.get(1); // Assuming `id` is always 1 for a single record

            if (existingSetting) {
                // Update the single record
                await db.settings.update(1, settings);
                console.log("Setting updated");
            } else {
                // Add the single record
                await db.settings.add({ id: 1, ...settings});
                console.log("Setting added");
            }
        });
    } catch (error) {
        console.error("Error during upsert:", error);
        alert("Error Please contact the IT support");
    }
};

export default Settings;