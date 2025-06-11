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

    // custom settings
    defaultBatchSize: 2500,
    keyById: true,

    tableName_kv: process.env.AWESOMENESS_GRAPH_TABLE_NAME_KV ?? 'awesomeness__kv',
    tableName_vertices: process.env.AWESOMENESS_GRAPH_TABLE_NAME_VERTICES ??  'awesomeness__vertices',
    tableName_edges: process.env.AWESOMENESS_GRAPH_TABLE_NAME_EDGES ?? 'awesomeness__edges',
    

};

function init(newSettings){

    for (const key in newSettings) {

        if (!(key in settings)) {
            throw new Error(`Invalid configuration parameter: ${key}`);
        }

        settings[key] = newSettings[key];  // Mutate the shared config
    }

    return settings;

}

function set(k, v){

    if (!(k in config)) {
        throw new Error(`Invalid configuration parameter: ${k}`);
    }

    config[k] = v;  // Mutate the shared config

    return config;

}

export default { set, settings, init };
export { set, settings, init };