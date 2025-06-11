declare namespace _default {
    export { settings };
    export { set };
    export { init };
    export { setOnChange };
}
export default _default;
export namespace settings {
    let host: any;
    let user: any;
    let port: number;
    let password: any;
    let database: any;
    let max: number;
    let idleTimeoutMillis: number;
    let connectionTimeoutMillis: number;
    let defaultBatchSize: number;
    let keyById: boolean;
    let tableName_kv: any;
    let tableName_vertices: any;
    let tableName_edges: any;
}
export function set(k: any, v: any): {
    host: any;
    user: any;
    port: number;
    password: any;
    database: any;
    max: number;
    idleTimeoutMillis: number;
    connectionTimeoutMillis: number;
    defaultBatchSize: number;
    keyById: boolean;
    tableName_kv: any;
    tableName_vertices: any;
    tableName_edges: any;
};
export function init(newSettings?: {}): {
    host: any;
    user: any;
    port: number;
    password: any;
    database: any;
    max: number;
    idleTimeoutMillis: number;
    connectionTimeoutMillis: number;
    defaultBatchSize: number;
    keyById: boolean;
    tableName_kv: any;
    tableName_vertices: any;
    tableName_edges: any;
};
export function setOnChange(fn: any): void;
