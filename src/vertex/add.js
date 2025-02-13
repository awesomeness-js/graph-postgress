/**
 * Adds a single vertex to the graph.
 *
 * @param {Object} vertex - The vertex object to be added.
 * @param {string} vertex.type - The type of the vertex.
 * @param {string} vertex.id - The ID of the vertex. If not provided, a UUID will be generated.
 * @returns {Promise<Object>} A promise that resolves to the added vertex.
 */
import addVertices from './addMultiple.js';

export default async function addVertex( vertex ){
	const created = await addVertices([vertex]);
	return created[0];
}