/**
 * Searches for vertex types in the database and returns their properties.
 *
 * @param {string|string[]} types - The vertex type(s) to search for. Can be a single string or an array of strings.
 * @param {Object} [options] - Optional configuration object.
 * @param {boolean} [options.keyById=settings.keyById] - If true, results are keyed by vertex ID.
 * @param {boolean} [options.groupByType=true] - If true, results are grouped by type.
 * @returns {Promise<Object|Array>} - Returns a Promise that resolves to an object or array containing the vertex properties, grouped and/or keyed according to the options.
 * @throws {Object} Throws an error object if input validation fails or if the database query fails.
 */
import { createPool } from '../utils/pool.js';
import { settings } from '../config.js';

export default async function searchVertexTypes(types ,{
    keyById = settings.keyById,
    groupByType = true
} = {}) {

    const graph = createPool();

    if(typeof types === 'string'){
        groupByType = false;
        types = [types]; 
    }

    // Validate that ids is an array
    if (!Array.isArray(types)) {
        throw {
            dbError: {
                msg: 'ids invalid - must be an array of strings',
                types
            }
        };
    }

    // Validate each ID in the array
    types.forEach((type) => {
        if (typeof type !== 'string' || type.length > 420) {
            throw {
                dbError: {
                    msg: `type invalid - must be a string less than 420 characters (error at index ${i})`,
                    index: i,
                    type
                }
            };
        }
    });


    try {

        // Execute query with parameterized ids array
        const res = await graph.query(`SELECT id, type, properties FROM ${settings.tableName_vertices} WHERE type = ANY($1)`, [types]);

        if(groupByType){

            // Transform result rows into an object with type as the key
            const result = res.rows.reduce((acc, row) => { 
                
                if(!acc[row.type]){  acc[row.type] = []; }

                keyById ? acc[row.type][row.id] = row.properties : acc[row.type].push(row.properties);

                return acc;
 
            }, {});
            return result;

        } else {

            // Transform result rows into an object with id as the key
            const result = res.rows.reduce((acc, row) => { 
                
                keyById ? acc[row.id] = row.properties : acc.push(row.properties);

                return acc;
 
            }, keyById ? {} : []);
            return result;

        }

    } catch (ex) {
        throw {
            searchVertexTypesFailed: ex.stack,
            ids
        };
    }

}
