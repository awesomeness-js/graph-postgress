import getMultiple from './getMultiple.js';
export default async function searchKV(key) {
	const kvs = await getMultiple([key]);
	return kvs[key];
}