import { settings } from '../config.js';
import { createPool } from './pool.js';

export default async function createDB() {

	const graph = createPool();

	const sql = `

	CREATE TABLE IF NOT EXISTS ${settings.tableName_vertices} (
		id UUID NOT NULL PRIMARY KEY,
		type VARCHAR(420) NOT NULL,
		properties JSONB,
		UNIQUE (id)
	);

	CREATE TABLE IF NOT EXISTS ${settings.tableName_edges} (
		id UUID NOT NULL PRIMARY KEY,
		v1 UUID NOT NULL,
		type VARCHAR(420) NOT NULL,
		v2 UUID NOT NULL,
		properties JSONB,
		UNIQUE (id)
	);

	CREATE TABLE IF NOT EXISTS ${settings.tableName_kv} (
		k VARCHAR(420) NOT NULL PRIMARY KEY,
		v JSONB,
		UNIQUE (k)
	);

	DO $$ BEGIN

		IF NOT EXISTS (
			SELECT 1 FROM pg_indexes 
			WHERE tablename = '${settings.tableName_edges}' 
			AND indexname = '${settings.tableName_edges}_edge_v1_and_type'
		) 
		THEN
			CREATE INDEX ${settings.tableName_edges}_edge_v1_and_type 
			ON ${settings.tableName_edges} (v1, type);
		END IF;

		IF NOT EXISTS (
			SELECT 1 FROM pg_indexes 
			WHERE tablename = '${settings.tableName_edges}' 
			AND indexname = '${settings.tableName_edges}_edge_v1_and_v2'
		) 
		THEN
			CREATE INDEX ${settings.tableName_edges}_edge_v1_and_v2 
			ON ${settings.tableName_edges} (v1, v2);
		END IF;

		IF NOT EXISTS (
			SELECT 1 FROM pg_indexes 
			WHERE tablename = '${settings.tableName_vertices}' 
			AND indexname = '${settings.tableName_vertices}_vertices_type'
		) 
		THEN
			CREATE INDEX ${settings.tableName_vertices}_vertices_type 
			ON ${settings.tableName_vertices} (type);
		END IF;

	END $$;
	`;

	let created = false;

	try {
		await graph.query(sql);
		created = true;
	} catch (err) {
		throw({
			reason: 'Error creating database',
			message: err.message,
			error: err
		});
	}

	return { created };
}
