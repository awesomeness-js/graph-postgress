/**
 * Removes an index from the properties column for edges/vertices table.
 *
 * @param {Object} options
 * @param {'edges'|'vertices'} options.target - Table target by logical name.
 * @param {string} options.indexName - Existing index name.
 * @returns {Promise<{ removed: boolean, indexName: string, tableName: string }>}
 */
export default function removeIndex({ target, indexName }?: {
    target: "edges" | "vertices";
    indexName: string;
}): Promise<{
    removed: boolean;
    indexName: string;
    tableName: string;
}>;
