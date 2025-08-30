
/**
 * Adds a single edge to the graph.
 *
 * @async
 * @param {Object} params - The parameters for the edge.
 * @param {string} params.v1 - The ID of the source vertex.
 * @param {string} params.type - The type of the edge.
 * @param {string} params.v2 - The ID of the target vertex.
 * @param {string} [params.id=uuid()] - The unique identifier for the edge. Defaults to a generated UUID.
 * @param {Object|null} [params.properties=null] - Optional properties to associate with the edge.
 * @returns {Promise<Object>} The newly added edge object.
 */
import addEdges from './addMultiple.js';
import { uuid } from '@awesomeness-js/utils';
export default async function addEdge({
    v1, 
    type,
    v2, 
    id = uuid(), 
    properties = null
}){
    let edges = await addEdges([{
        v1, 
        type, 
        v2, 
        id, 
        properties
    }]);
    return edges[0];
}