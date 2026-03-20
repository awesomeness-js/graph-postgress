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

function validatePropertyKey(propertyKey) {

	if (typeof propertyKey !== 'string' || !propertyKey.trim().length) {

		throw {
			dbError: {
				msg: 'propertyKey invalid - must be a non-empty string',
				propertyKey
			}
		};

	}

}

function parsePropertyPath(propertyKey) {

	validatePropertyKey(propertyKey);

	const propertyPath = propertyKey
		.split('.')
		.map((part) => part.trim())
		.filter(Boolean);

	if (!propertyPath.length) {

		throw {
			dbError: {
				msg: 'propertyKey invalid - must contain at least one path segment',
				propertyKey
			}
		};

	}

	return propertyPath;

}

function escapeSqlString(v) {

	return String(v).replace(/'/g, "''");

}

function normalizeNamePart(v) {

	return String(v).replace(/[^a-zA-Z0-9_]/g, '_');

}

/**
 * Creates an expression index on a properties key path for edges/vertices table.
 *
 * @param {Object} [options]
 * @param {'edges'|'vertices'} [options.target='edges'] - Table target by logical name.
 * @param {string|null} [options.indexName=null] - Optional index name.
 * @param {string} options.propertyKey - Required properties key path (supports dot notation, e.g. "createdBy" or "something.deeper").
 * @returns {Promise<{ created: boolean, indexName: string, tableName: string }>}
 */
export default async function createIndex({
	target = 'edges',
	indexName = null,
	propertyKey
} = {}) {

	const graph = createPool();
	const tableName = parseTargetTable(target);
	const propertyPath = parsePropertyPath(propertyKey);

	const finalIndexName = (indexName || `${tableName}_properties_${normalizeNamePart(propertyPath.join('_'))}_idx`).toLowerCase();

	validateIndexName(finalIndexName);

	const sqlPath = propertyPath.map((part) => `'${escapeSqlString(part)}'`).join(',');

	const sql = `
		CREATE INDEX IF NOT EXISTS ${finalIndexName}
		ON ${tableName} ((properties #>> ARRAY[${sqlPath}]));
	`;

	try {

		await graph.query(sql);

		return {
			created: true,
			indexName: finalIndexName,
			tableName
		};
	
	} catch (ex) {

		throw {
			createIndexFailed: ex.stack,
			tableName,
			indexName: finalIndexName
		};
	
	}

}
