# USAGE
```js

import graph from '@awesomeness-js/graph-postgres';

// set up your database connection
// only needs to happen once, so you can do this in your main / start file
const db = graph.init({

    host: process.env.AWESOMENESS_GRAPH_POSTGRES_HOST ?? 'localhost',
	user: process.env.AWESOMENESS_GRAPH_POSTGRES_USER ?? 'postgres',
	port: process.env.AWESOMENESS_GRAPH_POSTGRES_PORT ?? 5432,
	password: process.env.AWESOMENESS_GRAPH_POSTGRES_PASSWORD ?? 'your-password-here',
	database: process.env.AWESOMENESS_GRAPH_POSTGRES_DB ?? 'awesomeness_graph',
	
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,

    defaultBatchSize: 2500,
    keyById: true,

    tableName_kv: process.env.AWESOMENESS_GRAPH_TABLE_NAME_KV ?? 'awesomeness__kv',
    tableName_vertices: process.env.AWESOMENESS_GRAPH_TABLE_NAME_VERTICES ??  'awesomeness__vertices',
    tableName_edges: process.env.AWESOMENESS_GRAPH_TABLE_NAME_EDGES ?? 'awesomeness__edges',
    

}, true); // test mode inserts 1 record into the kv table: awesomenessTest at current time

```