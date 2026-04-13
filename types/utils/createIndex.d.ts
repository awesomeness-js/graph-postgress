/**
 * Creates an expression index on a properties key path for edges/vertices table.
 *
 * @param {Object} [options]
 * @param {'edges'|'vertices'} [options.target='edges'] - Table target by logical name.
 * @param {string|null} [options.indexName=null] - Optional index name.
 * @param {string} options.propertyKey - Required properties key path (supports dot notation, e.g. "createdBy" or "something.deeper").
 * @returns {Promise<{ created: boolean, indexName: string, tableName: string }>}
 */
export default function createIndex({ target, indexName, propertyKey }?: {
    target?: "edges" | "vertices" | undefined;
    indexName?: string | null | undefined;
    propertyKey: string;
}): Promise<{
    created: boolean;
    indexName: string;
    tableName: string;
}>;
