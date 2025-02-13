/**
 * Adds multiple vertices to the database.
 * 
 * @example graph.vertices.addMultiple([
 *    { id: 'this uuid will be used', type: 'Person', name: 'Alice' },
 *    { type: 'City', name: 'Wonderland' } // id will be generated
 * ]);
 *
 * @param {Array<Object>} vertices - An array of vertex objects to be added.
 * @param {Object} options - Options for the batch insertion.
 * @param {number} [options.batchSize=settings.defaultBatchSize] - The number of vertices to insert in each batch.
 * @returns {Promise<Array>} - An array of inserted vertex IDs.
 * @throws {Object} - Throws an error if a vertex type is invalid or if the database insertion fails.
 */

import graph from '../utils/pool.js';
import { uuid, isUUID } from "@awesomeness-js/utils";
import config from '../utils/config.js';

const settings = config.settings();

export default async function addVertices(vertices, { 
    batchSize = settings.defaultBatchSize 
} = {}) {

    // Validate and prepare vertices
    const data = vertices.map((vertex, i) => {
        if (typeof vertex.type !== 'string' || vertex.type.length > 420) {
            throw {
                dbError: {
                    msg: `vertex type (vertex.type) invalid - must be string less than 420 characters (error at index ${i})`,
                    index: i,
                    vertex
                }
            };
        }

        if (!isUUID(vertex.id)) {
            vertex.id = uuid();
        }

        return [vertex.id, vertex.type, vertex];
    });

    const client = await graph.connect();
    try {
        for (let i = 0; i < data.length; i += batchSize) {
            const batch = data.slice(i, i + batchSize);

            // Prepare parameters and values for bulk insert
            const params = batch.flat();
            const values = batch
                .map((_, idx) => `($${idx * 3 + 1}, $${idx * 3 + 2}, $${idx * 3 + 3}::jsonb)`)
                .join(", ");

            const sql = `
                INSERT INTO vertices (id, type, properties)
                VALUES ${values}
                ON CONFLICT (id) DO UPDATE SET 
                    type = EXCLUDED.type,
                    properties = EXCLUDED.properties;
            `;

            await client.query(sql, params);
        }
    } catch (ex) {
        throw {
            verticesCreationFailed: ex.stack,
            data
        };
    } finally {
        client.release(); // Always release the client back to the pool
    }

    return vertices;
}
