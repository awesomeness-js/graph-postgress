import graph from './pool.js';

export default async function createDB() {
	
	const sql = `

	CREATE TABLE IF NOT EXISTS vertices (
		id UUID NOT NULL PRIMARY KEY,
		type VARCHAR(420) NOT NULL,
		properties JSONB,
		UNIQUE (id)
	);

	CREATE TABLE IF NOT EXISTS edges (
		id UUID NOT NULL PRIMARY KEY,
		v1 UUID NOT NULL,
		type VARCHAR(420) NOT NULL,
		v2 UUID NOT NULL,
		properties JSONB,
		UNIQUE (id)
	);

	CREATE TABLE IF NOT EXISTS kv (
		k VARCHAR(420) NOT NULL PRIMARY KEY,
		v JSONB,
		UNIQUE (k)
	);

	DO $$ BEGIN
		IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'edges' AND indexname = 'edge_v1_and_type') THEN
			CREATE INDEX edge_v1_and_type ON edges (v1, type);
		END IF;
		IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'edges' AND indexname = 'edge_v1_and_v2') THEN
			CREATE INDEX edge_v1_and_v2 ON edges (v1, v2);
		END IF;
		IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'vertices' AND indexname = 'vertices_type') THEN
			CREATE INDEX vertices_type ON vertices (type);
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
