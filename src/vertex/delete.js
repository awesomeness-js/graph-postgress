/**
 * Deletes a single vertex by its ID.
 *
 * @param {string|number} vertexID - The unique identifier of the vertex to delete.
 * @returns {Promise<any>} A promise that resolves when the vertex has been deleted.
 */
import deleteVertices from './deleteMultiple.js';
export default async function deleteVertex(vertexID){
	return deleteVertices([vertexID]);
}