
/**
 * Adds multiple edges to the graph database in chunks, with validation and upsert logic.
 *
 * @param {Array<Object>} data - Array of edge objects to add. Each object should have:
 *   @param {string} data[].v1 - UUID of the source vertex.
 *   @param {string} data[].type - Type of the edge (string, max length 420).
 *   @param {string} data[].v2 - UUID of the target vertex.
 *   @param {string} [data[].id] - Optional UUID for the edge. If not provided, a new UUID is generated.
 *   @param {Object|null} [data[].properties] - Optional properties object for the edge.
 * @param {Object} [options] - Optional configuration object.
 * @param {number} [options.chunkSize=5000] - Number of edges to insert per batch.
 * @returns {Promise<Array<Object>>} The array of edge objects (with generated IDs if not provided).
 * @throws {Object} Throws an error object with `dbError` or `multipleEdgeCreationFailed` on validation or query failure.
 */
import { uuid, isUUID } from "@awesomeness-js/utils";
import { createPool } from '../utils/pool.js';
import { settings } from '../config.js';

export default async function addEdges(data, {
	chunkSize = 5000
} = {}) {

    const graph = createPool();
    
    // Data validation function to reduce redundancy
    data.forEach((entry, i) => {

        const { 
            v1, 
            type, 
            v2, 
            id, 
            properties 
        } = entry;

        if (!isUUID(v1) || !isUUID(v2)) {
            throw {
                dbError: {
                    msg: `edge ids invalid - must be array of uuids (${!isUUID(v1) ? 'v1' : 'v2'} issue)`,
                    data,
                    key: i,
                    value: entry,
                }
            };
        }

        if(id){
            if(!isUUID(id)){
                throw {
                    dbError: {
                        msg: `edge id invalid - must be uuid`,
                        data,
                        key: i,
                        value: entry,
                    }
                };
            }
        } else {
           entry.id = uuid();
        }

        if (typeof type !== 'string' || type.length > 420) {
            throw {
                dbError: {
                    msg: `edge type invalid - ${typeof type !== 'string' ? 'must be string' : 'max length 420'}`,
                    type
                }
            };
        }

        if(properties){
            if(typeof properties !== 'object'){
                throw {
                    dbError: {
                        msg: `edge properties invalid - must be object`,
                        properties
                    }
                };
            }
        } else {
            entry.properties = null;
        }

    });


    for (let i = 0; i < data.length; i += chunkSize) {

        const chunk = data.slice(i, i + chunkSize);
        
		const params = [];
        
		const values = chunk.map((
            {
                v1, 
                type, 
                v2, 
                id,
                properties
            } = d, idx) => {
            const offset = idx * 5;
            params.push(v1, type, v2, id, properties);
            return `(
                $${offset + 1}, 
                $${offset + 2}, 
                $${offset + 3}, 
                $${offset + 4},
                $${offset + 5}
            )`;
        }).join(", ");

        const sql = `
            INSERT INTO ${settings.tableName_edges} (v1, type, v2, id, properties) 
            VALUES ${values}
            ON CONFLICT (id) DO UPDATE SET
                v1 = EXCLUDED.v1,
                type = EXCLUDED.type,
                v2 = EXCLUDED.v2,
                properties = EXCLUDED.properties;
        `;

        try {
            await graph.query(sql, params);
        } catch (ex) {
            throw {
                multipleEdgeCreationFailed: ex.stack,
            };
        }

    }

    return data;
}
