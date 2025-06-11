import graph from '../utils/pool.js';
import { settings } from '../config.js';
import { isUUID } from '@awesomeness-js/utils';

export default async function deleteVertices(ids, { 
    batchSize = settings.defaultBatchSize 
} = {}) {

    // Validate that ids is an array
    if (!Array.isArray(ids)) {
        throw {
            dbError: {
                msg: 'ids invalid - must be an array of UUIDs or strings',
                ids
            }
        };
    }

    // Validate each id in the array
    ids.forEach((id, i) => {
        if (!isUUID(id)) {
            throw {
                dbError: {
                    msg: `id invalid - must be a uuid4`,
                    index: i,
                    value: id
                }
            };
        }
    });

    const client = await graph.connect();
    try {
        await client.query('BEGIN'); // Start transaction

        for (let i = 0; i < ids.length; i += batchSize) {
            const batch = ids.slice(i, i + batchSize);
            const placeholders = batch.map((_, idx) => `$${idx + 1}`).join(", ");
            const sql = `DELETE FROM ${settings.tableName_vertices} WHERE id IN (${placeholders})`;

            await client.query(sql, batch);
        }

        await client.query('COMMIT'); // Commit transaction if all batches succeed
    } catch (ex) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        throw {
            verticesDeleteFailed: ex.stack,
            ids
        };
    } finally {
        client.release(); // Always release the client back to the pool
    }

    return true;
}
