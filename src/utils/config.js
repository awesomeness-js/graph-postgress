import utils from '@awesomeness-js/utils';

if(!process.env.AWESOMENESS_GRAPH_POSTGRES_DB){
    console.log('Setting local envs (config.js)');
    await utils.setLocalEnvs('./secrets/local.env');
}

let configPostgres = {

    // postgres pool settings
    host: process.env.AWESOMENESS_GRAPH_POSTGRES_HOST,
	user: process.env.AWESOMENESS_GRAPH_POSTGRES_USER,
	port: process.env.AWESOMENESS_GRAPH_POSTGRES_PORT,
	password: process.env.AWESOMENESS_GRAPH_POSTGRES_PASSWORD,
	database: process.env.AWESOMENESS_GRAPH_POSTGRES_DB,
	max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,

};

let configAwesomeness = {

    // custom settings
    defaultBatchSize: 2500,
    keyById: true

};

let config = { ...configPostgres, ...configAwesomeness };

// Shared config functions
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

function settings(db = false) {
    const customKeys = Object.keys(configAwesomeness);
    
    if(db){
        // filter out custom keys
        return Object.keys(config).filter(key => !customKeys.includes(key)).reduce((acc, key) => {
            acc[key] = config[key];
            return acc;
        }, {});
    }

    return { ...config };  // Return a copy to prevent external mutation
    
}

// Export all functions as a default export
export default { set, get, settings };
