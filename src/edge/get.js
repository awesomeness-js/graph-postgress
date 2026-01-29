/**
 * Retrieves a single edge by its ID.
 *
 * @param {string|number} id - The unique identifier of the edge to retrieve.
 * @param {Object} [options={}] - Optional parameters.
 * @param {boolean} [options.returnProperties=false] - Whether to include edge properties in the result.
 * @returns {Promise<Object|undefined>} A promise that resolves to the edge object if found, or undefined if not found.
 */
import getMultiple from './getMultiple.js';
export default async function getEdge(id, {
    returnProperties = false
} = {}) {
	
	let edges = await getMultiple([id], {
		returnProperties
	});

	return edges[0];

}