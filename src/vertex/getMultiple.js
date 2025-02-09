import { isUUID } from '@awesomeness-js/utils';
import graph from '../utils/pool.js';
import config from '../utils/config.js';

const settings = config.settings();

export default async function searchVertices(ids,{
    keyById = settings.keyById,
} = {}) {

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
        const res = await graph.query('SELECT id, properties FROM vertices WHERE id = ANY($1)', [ids]);

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
