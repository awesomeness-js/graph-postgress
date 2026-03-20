import { createPool } from './pool.js';
import { settings } from '../config.js';

/**
 * Lists indexes on the properties column for edge/vertex tables.
 *
 * @returns {Promise<Array<{ tableName: string, indexName: string, indexDefinition: string }>>}
 */
export default async function listIndexes() {

	const graph = createPool();

	try {

		const res = await graph.query(
			`
			SELECT
				tablename AS "tableName",
				indexname AS "indexName",
				indexdef AS "indexDefinition"
			FROM pg_indexes
			WHERE tablename = ANY($1::text[])
			AND indexdef ILIKE '%properties%'
			ORDER BY tablename, indexname;
			`,
			[ [ settings.tableName_edges, settings.tableName_vertices ] ]
		);

		return res.rows;
	
	} catch (ex) {

		throw {
			listIndexesFailed: ex.stack,
		};
	
	}

}
