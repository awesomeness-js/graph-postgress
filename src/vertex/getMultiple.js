/**
 * Searches for multiple vertices in the database by their UUIDs.
 *
 * @param {string[]} ids - An array of UUID strings representing the vertex IDs to search for.
 * @param {Object} [options] - Optional configuration object.
 * @param {boolean} [options.keyById=settings.keyById] - If true, returns an object keyed by vertex ID; otherwise, returns an array of properties.
 * @returns {Promise<Object<string, any>|any[]>} - A promise that resolves to either an object keyed by vertex ID or an array of vertex properties.
 * @throws {Object} Throws an error if `ids` is not an array, if any ID is not a valid UUID, or if the database query fails.
 */
import { isUUID } from '@awesomeness-js/utils';
import { createPool } from '../utils/pool.js';
import { settings } from '../config.js';

export default async function searchVertices(ids,{
    keyById = settings.keyById,
} = {}) {

    const graph = createPool();

    // Validate that ids is an array
    if (!Array.isArray(ids)) {
        throw {
            dbError: {
                msg: 'ids invalid - must be an array of UUIDs',
                ids
            }
        };
    }

    // Validate each ID in the array
    ids.forEach((id, i) => {
        if (!isUUID(id)) {
            throw {
                dbError: {
                    msg: `id invalid - must be a UUID (error at index ${i})`,
                    ids,
                    key: i,
                    value: id
                }
            };
        }
    });


    try {

        // Execute query with parameterized ids array
        const res = await graph.query(`SELECT id, properties FROM ${settings.tableName_vertices} WHERE id = ANY($1)`, [ids]);

        const result = res.rows.reduce((acc, row) => { 
            keyById ? acc[row.id] = row.properties : acc.push(row.properties); return acc;
        }, keyById ? {} : []);
        return result;


    } catch (ex) {
        throw {
            searchVertexTypesFailed: ex.stack,
            ids
        };
    }

}
