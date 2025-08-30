/**
 * Retrieves multiple edges from the database by their UUIDs.
 *
 * @param {string[]} edgeIDs - An array of edge UUIDs to retrieve.
 * @param {Object} [options] - Optional parameters.
 * @param {boolean} [options.returnProperties=false] - Whether to include the 'properties' field in the result.
 * @returns {Promise<Object[]>} A promise that resolves to an array of edge objects.
 * @throws {Object} Throws an error object if validation fails or if the database query fails.
 */
import { isUUID } from '@awesomeness-js/utils';
import { createPool } from '../utils/pool.js';
import { settings } from '../config.js';

export default async function getMultiple(edgeIDs, {
    returnProperties = false
} = {}) {

    const graph = createPool();
    
    // Validate that edgeIDs is an array
    if (!Array.isArray(edgeIDs)) {
        throw {
            dbError: {
                msg: 'edgeIDs invalid - must be an array of UUIDs',
                edgeIDs
            }
        };
    }

    // Validate each edgeID in the array
    edgeIDs.forEach((id, i) => {
        if (!isUUID(id)) {
            throw {
                dbError: {
                    msg: `edgeID invalid - must be a UUID (error at index ${i})`,
                    edgeIDs,
                    key: i,
                    value: id
                }
            };
        }
    });

    // Prepare SQL query with parameterized placeholders
    const placeholders = edgeIDs.map((_, idx) => `$${idx + 1}`).join(", ");
    const sql = `
    SELECT 
        id,
        v1,
        type,
        v2
    ${ returnProperties ? ', properties' : '' }
    FROM 
        ${settings.tableName_edges} 
    WHERE 
        id 
    IN (${placeholders})`;

    try {

        // Execute query with parameterized edgeIDs array
        const res = await graph.query(sql, edgeIDs);
        return res.rows;
    
    } catch (ex) {

        throw {
            edge_getMultiple: ex.stack,
            edgeIDs
        };

    }
}
