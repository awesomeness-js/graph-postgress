/**
 * Deletes a key-value pair from the store.
 *
 * @param {string} key - The key to delete from the store.
 * @returns {Promise<*>} A promise that resolves with the result of the deletion operation.
 */
import deleteMultiple from "./deleteMultiple.js";
export default async function deleteKV(key){
	return await deleteMultiple([key]);
}