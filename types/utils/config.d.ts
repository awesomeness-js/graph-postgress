declare namespace _default {
    export { set };
    export { get };
    export { settings };
}
export default _default;
declare function set(param: any, value: any): {
    defaultBatchSize: number;
    keyById: boolean;
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
declare function settings(db?: boolean): {};
