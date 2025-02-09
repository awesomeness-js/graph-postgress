import deleteMultiple from "./deleteMultiple.js";
export default async function deleteKV(key){
	return await deleteMultiple([key]);
}