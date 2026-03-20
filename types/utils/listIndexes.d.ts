/**
 * Lists indexes on the properties column for edge/vertex tables.
 *
 * @returns {Promise<Array<{ tableName: string, indexName: string, indexDefinition: string }>>}
 */
export default function listIndexes(): Promise<Array<{
    tableName: string;
    indexName: string;
    indexDefinition: string;
}>>;
