/**
 * Searches for multiple key-value pairs in the database by their keys.
 *
 * @async
 * @function searchKVs
 * @param {string[]} keys - An array of string keys to search for. Each key must be a string with a maximum length of 420 characters.
 * @returns {Promise<Object>} A promise that resolves to an object mapping each found key to its corresponding value.
 * @throws {Object} Throws an error object if the input is invalid or if the database query fails.
 *   - If `keys` is not an array, throws an error with a `dbError` property.
 *   - If any key is not a string or exceeds 420 characters, throws an error with a `dbError` property.
 *   - If the database query fails, throws an error with a `searchKVsFailed` property containing the stack trace.
 */
import { createPool } from '../utils/pool.js';
import { settings } from '../config.js';

export default async function searchKVs(keys) {

    const graph = createPool();
    
    // Validate that keys is an array
    if (!Array.isArray(keys)) {
        throw {
            dbError: {
                msg: 'keys invalid - must be an array of strings',
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

    // Prepare SQL query with parameterized placeholders
    const placeholders = keys.map((_, idx) => `$${idx + 1}`).join(", ");
    const sql = `SELECT * FROM ${settings.tableName_kv} WHERE k IN (${placeholders})`;

    try {
        // Execute query with parameterized keys array
        const res = await graph.query(sql, keys);
        
		// key by k
		const result = {};
		res.rows.forEach(row => {
			result[row.k] = row.v;
		});

        return result;
		
    } catch (ex) {
        throw {
            searchKVsFailed: ex.stack,
            keys
        };
    }
}
