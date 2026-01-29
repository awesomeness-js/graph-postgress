/**
 * Searches for a value in the key-value store by the provided key.
 *
 * @async
 * @function searchKV
 * @param {string} key - The key to search for in the key-value store.
 * @returns {Promise<*>} The value associated with the given key, or undefined if not found.
 */
import getMultiple from './getMultiple.js';
export default async function searchKV(key) {
	const kvs = await getMultiple([key]);
	return kvs[key];
}