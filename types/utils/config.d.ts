declare namespace _default {
    export { init };
    export { set };
    export { get };
    export { settings };
}
export default _default;
declare function init(params: any): {
    defaultBatchSize: number;
    keyById: boolean;
    tableName_kv: any;
    tableName_vertices: any;
    tableName_edges: any;
    host: any;
    user: any;
    port: any;
    password: any;
    database: any;
    max: number;
    idleTimeoutMillis: number;
    connectionTimeoutMillis: number;
};
declare function set(param: any, value: any): {
    defaultBatchSize: number;
    keyById: boolean;
    tableName_kv: any;
    tableName_vertices: any;
    tableName_edges: any;
    host: any;
    user: any;
    port: any;
    password: any;
    database: any;
    max: number;
    idleTimeoutMillis: number;
    connectionTimeoutMillis: number;
};
declare function get(param: any): any;
declare function settings(): {
    defaultBatchSize: number;
    keyById: boolean;
    tableName_kv: any;
    tableName_vertices: any;
    tableName_edges: any;
    host: any;
    user: any;
    port: any;
    password: any;
    database: any;
    max: number;
    idleTimeoutMillis: number;
    connectionTimeoutMillis: number;
};
