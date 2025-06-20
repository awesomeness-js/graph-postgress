/**
 * This file is auto-generated by the build script.
 * It consolidates API type declarations for use in the application.
 * Do not edit manually.
 */
import type _config from './config';
import type _edge_add from './edge/add';
import type _edge_addMultiple from './edge/addMultiple';
import type _edge_delete from './edge/delete';
import type _edge_deleteMultiple from './edge/deleteMultiple';
import type _edge_get from './edge/get';
import type _edge_getMultiple from './edge/getMultiple';
import type _edge_search from './edge/search';
import type _kv_add from './kv/add';
import type _kv_addMultiple from './kv/addMultiple';
import type _kv_delete from './kv/delete';
import type _kv_deleteMultiple from './kv/deleteMultiple';
import type _kv_get from './kv/get';
import type _kv_getMultiple from './kv/getMultiple';
import type _utils_createDB from './utils/createDB';
import type _utils_pool from './utils/pool';
import type _vertex_add from './vertex/add';
import type _vertex_addMultiple from './vertex/addMultiple';
import type _vertex_delete from './vertex/delete';
import type _vertex_deleteMultiple from './vertex/deleteMultiple';
import type _vertex_get from './vertex/get';
import type _vertex_getMultiple from './vertex/getMultiple';
import type _vertex_search from './vertex/search';

export declare const config: typeof _config;

declare const _default: {
    config: typeof _config;
    edge: {
        add: typeof _edge_add,
        addMultiple: typeof _edge_addMultiple,
        delete: typeof _edge_delete,
        deleteMultiple: typeof _edge_deleteMultiple,
        get: typeof _edge_get,
        getMultiple: typeof _edge_getMultiple,
        search: typeof _edge_search,
    },
    kv: {
        /**
        * Adds a key-value pair to the storage.
        *
        * @param {string} key - The key to add.
        * @param {string} value - The value to associate with the key.
        * @returns {Promise<void>} A promise that resolves when the key-value pair has been added.
        */
        add: typeof _kv_add,
        /**
         * Adds multiple key-value pairs to the database.
         * 
         * @example graph.kv.addMultiple({
         *    key1: { some: 'data' },
         *    key2: 'some string'
         * });
         *
         * @param {Object} dictionary - An object containing key-value pairs to be added.
         * @param {Object} options - Options for the batch insertion.
         * @param {number} [options.batchSize=settings.defaultBatchSize] - The number of key-value pairs to insert in each batch.
         * @returns {Promise<Object>} - The original dictionary object.
         * @throws {Object} - Throws an error if a key is invalid or if the database insertion fails.
         */
        addMultiple: typeof _kv_addMultiple,
        delete: typeof _kv_delete,
        deleteMultiple: typeof _kv_deleteMultiple,
        get: typeof _kv_get,
        getMultiple: typeof _kv_getMultiple,
    },
    utils: {
        createDB: typeof _utils_createDB,
        pool: typeof _utils_pool,
    },
    vertex: {
        /**
         * Adds a single vertex to the graph.
         *
         * @param {Object} vertex - The vertex object to be added.
         * @param {string} vertex.type - The type of the vertex.
         * @param {string} vertex.id - The ID of the vertex. If not provided, a UUID will be generated.
         * @param {Object} vertex.example - any other properties of the vertex.
         * @returns {Promise<Object>} A promise that resolves to the added vertex.
         */
        add: typeof _vertex_add,
        /**
         * Adds multiple vertices to the database.
         * 
         * @example graph.vertices.addMultiple([
         *    { id: 'this uuid will be used', type: 'Person', name: 'Alice' },
         *    { type: 'City', name: 'Wonderland' } // id will be generated
         * ]);
         *
         * @param {Array<Object>} vertices - An array of vertex objects to be added.
         * @param {Object} options - Options for the batch insertion.
         * @param {number} [options.batchSize=settings.defaultBatchSize] - The number of vertices to insert in each batch.
         * @returns {Promise<Array>} - An array of inserted vertices with all properties.
         * @throws {Object} - Throws an error if a vertex type is invalid or if the database insertion fails.
         */
        addMultiple: typeof _vertex_addMultiple,
        delete: typeof _vertex_delete,
        deleteMultiple: typeof _vertex_deleteMultiple,
        get: typeof _vertex_get,
        getMultiple: typeof _vertex_getMultiple,
        search: typeof _vertex_search,
    },
};

export default _default;
