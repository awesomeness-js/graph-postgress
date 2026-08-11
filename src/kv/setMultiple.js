/**
 * Alias of addMultiple. Adds multiple key-value pairs to the database.
 *
 * @example graph.kv.setMultiple({
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
import addKVs from './addMultiple.js';

export default async function setMultipleKVs(dictionary, options){
	const updated = await addKVs(dictionary, options);
	return updated;
}
