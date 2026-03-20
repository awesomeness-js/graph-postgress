import { createPool } from './pool.js';
import { settings } from '../config.js';

function parseTargetTable(target) {

	if (target === 'edges') return settings.tableName_edges;
	if (target === 'vertices') return settings.tableName_vertices;

	throw {
		dbError: {
			msg: 'target invalid - must be "edges" or "vertices"',
			target
		}
	};

}

function validateIndexName(indexName) {

	if (typeof indexName !== 'string' || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(indexName)) {

		throw {
			dbError: {
				msg: 'indexName invalid - must match /^[a-zA-Z_][a-zA-Z0-9_]*$/',
				indexName
			}
		};

	}

}

/**
 * Removes an index from the properties column for edges/vertices table.
 *
 * @param {Object} options
 * @param {'edges'|'vertices'} options.target - Table target by logical name.
 * @param {string} options.indexName - Existing index name.
 * @returns {Promise<{ removed: boolean, indexName: string, tableName: string }>}
 */
export default async function removeIndex({
	target,
	indexName
} = {}) {

	const graph = createPool();
	const tableName = parseTargetTable(target);

	validateIndexName(indexName);

	const normalizedIndexName = indexName.toLowerCase();

	try {

		const res = await graph.query(
			`
			SELECT 1
			FROM pg_indexes
			WHERE tablename = $1
			AND indexname = $2
			AND indexdef ILIKE '%properties%'
			LIMIT 1;
			`,
			[ tableName, normalizedIndexName ]
		);

		if (!res.rowCount) {

			throw {
				dbError: {
					msg: 'index not found for table/properties',
					tableName,
					indexName: normalizedIndexName
				}
			};

		}

		await graph.query(`DROP INDEX IF EXISTS ${normalizedIndexName};`);

		return {
			removed: true,
			indexName: normalizedIndexName,
			tableName
		};
	
	} catch (ex) {

		if (ex?.dbError) throw ex;

		throw {
			removeIndexFailed: ex.stack,
			tableName,
			indexName: normalizedIndexName
		};
	
	}

}
