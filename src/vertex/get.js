/**
 * Retrieves a single vertex by its ID.
 *
 * @async
 * @function
 * @param {string|number} id - The unique identifier of the vertex to fetch.
 * @returns {Promise<Object|undefined>} A promise that resolves to the fetched vertex object, or undefined if not found.
 */
import getMultiple from './getMultiple.js';
export default async function getVertex(id){
    const fetched = await getMultiple([id],{ keyById: false  });
    return fetched[0];
}