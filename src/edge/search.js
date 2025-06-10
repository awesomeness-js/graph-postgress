import { isUUID } from '@awesomeness-js/utils';
import graph from '../utils/pool.js';
import config from '../utils/config.js';
const settings = config.settings();

export default async function searchEdges(v1s, edgeTypes, v2s, {
    returnProperties = false
} = {}) {
    let v1_is_x = false;
    let v2_is_x = false;
    let edgeType_is_x = false;


    // Convert single inputs to arrays
    if (typeof v1s === 'string') v1s = [v1s];
    if (typeof edgeTypes === 'string') edgeTypes = [edgeTypes];
    if (typeof v2s === 'string') v2s = [v2s];

    // Validate `v1s`
    if (!Array.isArray(v1s)) {
        throw {
            dbError: {
                msg: 'v1s invalid - must be "x", a uuid, or an array of uuids',
                v1s
            }
        };
    } else if (v1s.length === 1 && v1s[0] === 'x') {
        v1_is_x = true;
    } else {
        v1s.forEach((v1, i) => {
            if (!isUUID(v1)) {
                throw {
                    dbError: {
                        msg: 'v1s invalid - must be "x", a uuid, or an array of uuids',
                        v1s,
                        key: i,
                        value: v1
                    }
                };
            }
        });
    }

    // Validate `v2s`
    if (!Array.isArray(v2s)) {
        throw {
            dbError: {
                msg: 'v2s invalid - must be "x", a uuid, or array of uuids',
                v2s
            }
        };
    } else if (v2s.length === 1 && v2s[0] === 'x') {
        v2_is_x = true;
    } else {
        v2s.forEach((v2, i) => {
            if (!isUUID(v2)) {
                throw {
                    dbError: {
                        msg: 'v2s invalid - must be "x", a uuid, or array of uuids',
                        v2s,
                        key: i,
                        value: v2
                    }
                };
            }
        });
    }

    // Validate `edgeTypes`
    if (!Array.isArray(edgeTypes)) {
        throw {
            dbError: {
                msg: 'edgeTypes invalid - must be string or array of strings (min len: 2)',
                edgeTypes
            }
        };
    } else if (edgeTypes.length === 1 && edgeTypes[0] === 'x') {
        edgeType_is_x = true;
    } else {
        edgeTypes.forEach((type, i) => {
            if (typeof type !== 'string' || type.length < 2) {
                throw {
                    dbError: {
                        msg: 'edgeTypes invalid - must be string or array of strings (min len: 2)',
                        edgeTypes,
                        key: i,
                        value: type
                    }
                };
            }
        });
    }

    if (v1_is_x && edgeType_is_x && v2_is_x) {
        throw {
            dbError: {
                msg: 'all three inputs cannot be x',
                v1s,
                v2s,
                edgeTypes
            }
        };
    }

    // Build query dynamically
    let query = `
    SELECT 
        id,
        v1,
        type,
        v2
    ${ returnProperties ? ', properties' : '' }
    FROM ${settings.tableName_edges} WHERE `;
    const conditions = [];
    const params = [];

    if (!v1_is_x) {
        conditions.push(`v1 = ANY($${params.length + 1}::uuid[])`);
        params.push( v1s );
    }

    if (!edgeType_is_x) {
        conditions.push(`type = ANY($${params.length + 1}::text[])`);
        params.push( edgeTypes );
    }

    if (!v2_is_x) {
        conditions.push(`v2 = ANY($${params.length + 1}::uuid[])`);
        params.push( v2s );
    }

    query += conditions.join(' AND ');

    try {
        const res = await graph.query(query, params);
       return res.rows;
    } catch (ex) {
        throw {
            searchEdgesFailed: ex.stack,
        };
    }
}
