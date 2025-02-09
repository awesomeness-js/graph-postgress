import { isUUID } from '@awesomeness-js/utils';
import graph from '../utils/pool.js';

export default async function deleteEdges(edgeIDs) {
    // Validate edgeIDs is an array
    if (!Array.isArray(edgeIDs)) {
        throw {
            dbError: {
                msg: 'edge ids invalid - must be array of UUIDs',
                edgeIDs
            }
        };
    }

    // Validate each edgeID in the array
    edgeIDs.forEach((id, i) => {
        if (!isUUID(id)) {
            throw {
                dbError: {
                    msg: `edge id invalid - must be a UUID (error at index ${i})`,
                    edgeIDs,
                    key: i,
                    value: id
                }
            };
        }
    });

    // Prepare SQL queries with parameterized placeholders
    const placeholders = edgeIDs.map((_, idx) => `$${idx + 1}`).join(", ");
    const sql = `DELETE FROM edges WHERE id IN (${placeholders})`;

    try {
        // Execute both delete queries using parameterized edgeIDs array
        await graph.query(sql, edgeIDs);
    } catch (ex) {
        throw {
            multipleEdgeDeleteFailed: ex.stack,
            edgeIDs
        };
    }

    return true;
}
