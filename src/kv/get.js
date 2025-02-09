import getMultiple from './getMultiple.js';
export default async function searchKV(key) {
	return await getMultiple([key])[key];
}