/**
 * Adds multiple key-value pairs to the database.
 * 
 * @example graph.kv.addMultiple({
 *    key1: { some: 'data' },
 *    key2: 'some string'
 * });
 *
 * @param {Object} dictionary - An object containing key-value pairs to be added.
 * @param {Object} options - Options for the batch insertion.
 * @param {number} [options.batchSize=settings.defaultBatchSize] - The number of key-value pairs to insert in each batch.
 * @returns {Promise<Object>} - The original dictionary object.
 * @throws {Object} - Throws an error if a key is invalid or if the database insertion fails.
 */
import { createPool } from '../utils/pool.js';
import { settings } from '../config.js';


export default async function addKVs(dictionary, { 
    batchSize = settings.defaultBatchSize 
} = {}) {

    const graph = createPool();

    const data = Object.entries(dictionary);

    // Validate each key to ensure it’s a string and within the allowed length
    data.forEach(([key, value], i) => {
        if (typeof key !== 'string' || key.length > 420) {
            throw {
                dbError: {
                    msg: `key invalid - must be string less than 420 characters (error at index ${i})`,
                    key,
                    value
                }
            };
        }
    });

    const client = await graph.connect();
    try {
        for (let i = 0; i < data.length; i += batchSize) {
            const batch = data.slice(i, i + batchSize);

            // Prepare parameters and values for bulk insert
            const params = batch.flatMap(([key, value]) => {
               
                let v = value;
               
                let type = typeof value;
                
                // Convert to JSON if value is an string or array
                if(type === 'string') { v = JSON.stringify(value); }
                if (Array.isArray(value)) { v = JSON.stringify(value); }
              
                return [key, v]
           
            });
            
            const values = batch
                .map((_, idx) => `($${idx * 2 + 1}, $${idx * 2 + 2}::jsonb)`)
                .join(", ");

            const sql = `
                INSERT INTO ${settings.tableName_kv} (k, v)
                VALUES ${values}
                ON CONFLICT (k) DO UPDATE SET v = EXCLUDED.v;
            `;

            await client.query(sql, params);
        }
    } catch (ex) {
        throw {
            kvCreationFailed: ex.stack,
            data
        };
    } finally {
        client.release(); // Always release the client back to the pool
    }

    return dictionary;
}
