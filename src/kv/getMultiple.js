import graph from '../utils/pool.js';
import { settings } from '../config.js';

export default async function searchKVs(keys) {
    
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
