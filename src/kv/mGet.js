/**
 * Searches for multiple key-value pairs in the database by their keys.
 *
 * @async
 * @function mGet
 * @param {string[]} keys - An array of string keys to search for. Each key must be a string with a maximum length of 420 characters.
 * @returns {Promise<Object>} A promise that resolves to an object mapping each found key to its corresponding value.
 * @throws {Object} Throws an error object if the input is invalid or if the database query fails.
 *   - If `keys` is not an array, throws an error with a `dbError` property.
 *   - If any key is not a string or exceeds 420 characters, throws an error with a `dbError` property.
 *   - If the database query fails, throws an error with a `searchKVsFailed` property containing the stack trace.
 */
import getMultiple from './getMultiple.js';

export default async function mGet(keys) {

	const res = await getMultiple(keys);
	return res;

}
