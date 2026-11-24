const settings = {

	// postgres pool settings
	host: process.env.AWESOMENESS_GRAPH_POSTGRES_HOST ?? 'localhost',
	user: process.env.AWESOMENESS_GRAPH_POSTGRES_USER ?? 'postgres',
	port: Number(process.env.AWESOMENESS_GRAPH_POSTGRES_PORT) || 5432,
	password: process.env.AWESOMENESS_GRAPH_POSTGRES_PASSWORD ?? 'your-password-here',
	database: process.env.AWESOMENESS_GRAPH_POSTGRES_DB ?? 'awesomeness_graph',
	max: 10,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
	ssl: process.env.NODE_ENV === 'production' ? {
		rejectUnauthorized: false
	} : null,

	// custom settings
	defaultBatchSize: 2500,
	keyById: true,

	tableName_kv: process.env.AWESOMENESS_GRAPH_TABLE_NAME_KV ?? 'awesomeness__kv',
	tableName_vertices: process.env.AWESOMENESS_GRAPH_TABLE_NAME_VERTICES ??  'awesomeness__vertices',
	tableName_edges: process.env.AWESOMENESS_GRAPH_TABLE_NAME_EDGES ?? 'awesomeness__edges',
    

};

let onChange = null;

/**
 * Compare two setting values, including plain objects such as ssl.
 *
 * @param {*} a
 * @param {*} b
 * @returns {boolean}
 */
function valuesEqual(a, b) {

	if (Object.is(a, b)) return true;

	if (a && b && typeof a === 'object' && typeof b === 'object') return JSON.stringify(a) === JSON.stringify(b);

	return false;

}

function set(k, v) {

	if (!(k in settings)) {

		throw new Error(`Invalid configuration parameter: ${k}`);
	
	}

	const changed = !valuesEqual(settings[k], v);

	settings[k] = v;
	if (changed && onChange) onChange();
	
	return settings;

}

function init(newSettings = {}) {

	let changed = false;

	for (const key in newSettings) {

		if (!(key in settings)) {

			throw new Error(`Invalid configuration parameter: ${key}`);
		
		}

		if (!valuesEqual(settings[key], newSettings[key])) changed = true;

		settings[key] = newSettings[key];
	
	}

	if (changed && onChange) onChange();
	
	return settings;

}

function setOnChange(fn) {

	onChange = fn;

}

export default {
	settings,
	set,
	init,
	setOnChange 
};
export {
	settings, set, init, setOnChange 
};