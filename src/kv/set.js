/**
* Adds a key-value pair to the storage.
* ALIAS of add
*
* @param {string} key - The key to add.
* @param {string} value - The value to associate with the key.
* @returns {Promise<void>} A promise that resolves when the key-value pair has been added.
*/ 
import add from './add.js';

export default async function graphSetKv(key, value){

	const res = await add(key, value);
	return res;
	
}