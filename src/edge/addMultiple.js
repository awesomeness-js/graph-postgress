import { uuid, isUUID } from "@awesomeness-js/utils";
import graph from '../utils/pool.js';
import { settings } from '../config.js';

export default async function addEdges(data, {
	chunkSize = 5000
} = {}) {

    // Data validation function to reduce redundancy
    data.forEach((entry, i) => {

        const [ v1, type, v2, id, properties ] = entry;

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
            entry[3] = uuid();
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
            entry[4] = null;
        }

    });


    for (let i = 0; i < data.length; i += chunkSize) {

        const chunk = data.slice(i, i + chunkSize);
        
		const params = [];
        
		const values = chunk.map(([v1, type, v2, id, properties], idx) => {
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

    return data.reduce((acc, [ v1, type, v2, id, properties ]) => {
        acc.push({ 
            id,
            v1, 
            type, 
            v2,
            properties
        });
        return acc;
    }, []);
}
