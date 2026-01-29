
/**
 * Deletes a single edge by its ID.
 *
 * @param {uuid} edgeID - The unique identifier of the edge to delete.
 * @returns {Promise<*>} A promise that resolves with the result of the deletion operation.
 */
import deleteMultiple from './deleteMultiple.js';
export default async function deleteEdge(edgeID){
	return await deleteMultiple([edgeID]);
}