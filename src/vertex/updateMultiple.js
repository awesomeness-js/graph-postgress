/**
 * Alias of addMultiple. Updates multiple vertices in the database.
 * 
 * @example graph.vertices.updateMultiple([
 *    { id: 'this uuid will be used', type: 'Person', name: 'Alice' },
 *    { type: 'City', name: 'Wonderland' } // id will be generated
 * ]);
 *
 * @param {Array<Object>} vertices - An array of vertex objects to be updated.
 * @param {Object} options - Options for the batch update.
 * @param {number} [options.batchSize=settings.defaultBatchSize] - The number of vertices to update in each batch.
 * @returns {Promise<Array>} - An array of updated vertices with all properties.
 * @throws {Object} - Throws an error if a vertex type is invalid or if the database insertion fails.
 */
import addVertices from './addMultiple.js';

export default async function updateVertices( vertices, options ){
	const updated = await addVertices(vertices, options);
	return updated;
}