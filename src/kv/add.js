/**
* Adds a key-value pair to the storage.
*
* @param {string} key - The key to add.
* @param {string} value - The value to associate with the key.
* @returns {Promise<void>} A promise that resolves when the key-value pair has been added.
*/ 
import addMultiple from './addMultiple.js';
async function graphAddKv(key, value){
	await addMultiple({ [key]: value});
	return value;
}

export default graphAddKv;
