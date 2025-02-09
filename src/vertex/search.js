import graph from '../utils/pool.js';
import config from '../utils/config.js';

const settings = config.settings();

export default async function searchVertexTypes(types ,{
    keyById = settings.keyById,
    groupByType = true
} = {}) {

    if(typeof types === 'string'){
        groupByType = false;
        types = [types]; 
    }

    // Validate that ids is an array
    if (!Array.isArray(types)) {
        throw {
            dbError: {
                msg: 'ids invalid - must be an array of strings',
                types
            }
        };
    }

    // Validate each ID in the array
    types.forEach((type) => {
        if (typeof type !== 'string' || type.length > 420) {
            throw {
                dbError: {
                    msg: `type invalid - must be a string less than 420 characters (error at index ${i})`,
                    index: i,
                    type
                }
            };
        }
    });


    try {

        // Execute query with parameterized ids array
        const res = await graph.query('SELECT id, type, properties FROM vertices WHERE type = ANY($1)', [types]);

        if(groupByType){

            // Transform result rows into an object with type as the key
            const result = res.rows.reduce((acc, row) => { 
                
                if(!acc[row.type]){  acc[row.type] = []; }

                keyById ? acc[row.type][row.id] = row.properties : acc[row.type].push(row.properties);

                return acc;
 
            }, {});
            return result;

        } else {

            // Transform result rows into an object with id as the key
            const result = res.rows.reduce((acc, row) => { 
                
                keyById ? acc[row.id] = row.properties : acc.push(row.properties);

                return acc;
 
            }, keyById ? {} : []);
            return result;

        }

    } catch (ex) {
        throw {
            searchVertexTypesFailed: ex.stack,
            ids
        };
    }

}
