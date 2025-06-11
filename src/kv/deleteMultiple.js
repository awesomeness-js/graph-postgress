import graph from '../utils/pool.js';
import { settings } from '../config.js';

export default async function deleteKVs(keys, { 
    batchSize = settings.defaultBatchSize 
} = {}) {

    // Validate that keys is an array
    if (!Array.isArray(keys)) {
        throw {
            dbError: {
                msg: 'keys invalid - must be an array of UUIDs or strings',
                keys
            }
        };
    }

    // Validate each key in the array
    keys.forEach((key, i) => {
        if (typeof key !== 'string' || key.length > 420) {
            throw {
                dbError: {
                    msg: `key invalid - must be a string less than 420 characters (error at index ${i})`,
                    keys,
                    key: i,
                    value: key
                }
            };
        }
    });

    const client = await graph.connect();
    try {
        await client.query('BEGIN'); // Start transaction

        for (let i = 0; i < keys.length; i += batchSize) {
            const batch = keys.slice(i, i + batchSize);
            const placeholders = batch.map((_, idx) => `$${idx + 1}`).join(", ");
            const sql = `DELETE FROM ${settings.tableName_kv} WHERE k IN (${placeholders})`;

            await client.query(sql, batch);
        }

        await client.query('COMMIT'); // Commit transaction if all batches succeed
    } catch (ex) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        throw {
            kvDeleteFailed: ex.stack,
            keys
        };
    } finally {
        client.release(); // Always release the client back to the pool
    }

    return true;
}
