let configPostgres = {

    // postgres pool settings
    host: process.env.AWESOMENESS_GRAPH_POSTGRES_HOST ?? 'localhost',
	user: process.env.AWESOMENESS_GRAPH_POSTGRES_USER ?? 'postgres',
	port: process.env.AWESOMENESS_GRAPH_POSTGRES_PORT ?? 5432,
	password: process.env.AWESOMENESS_GRAPH_POSTGRES_PASSWORD ?? 'your-password-here',
	database: process.env.AWESOMENESS_GRAPH_POSTGRES_DB ?? 'awesomeness_graph',
	max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,

};

let configAwesomeness = {

    // custom settings
    defaultBatchSize: 2500,
    keyById: true,

    tableName_kv: process.env.AWESOMENESS_GRAPH_TABLE_NAME_KV ?? 'awesomeness__kv',
    tableName_vertices: process.env.AWESOMENESS_GRAPH_TABLE_NAME_VERTICES ??  'awesomeness__vertices',
    tableName_edges: process.env.AWESOMENESS_GRAPH_TABLE_NAME_EDGES ?? 'awesomeness__edges',
    
};

let config = { ...configPostgres, ...configAwesomeness };

// Shared config functions

async function init(params){

    if (params && typeof params === 'object') {
        for (const key in params) {
            if (key in config) {
                config[key] = params[key];  // Mutate the shared config
            } else {
                throw new Error(`Invalid configuration parameter: ${key}`);
            }
        }
    }

    return config;

}

function set(param, value) {
    if (!(param in config)) {
        throw new Error(`Invalid configuration parameter: ${param}`);
    }
    config[param] = value;  // Mutate the shared config
    return config;
}

function get(param) {
    if (!(param in config)) {
        throw new Error(`Invalid configuration parameter: ${param}`);
    }
    return config[param];
}


function settings() {
    
    return { ...config };  // Return a copy to prevent external mutation
    
}

// Export all functions as a default export
export default { init, set, get, settings };
