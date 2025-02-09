import getMultiple from './getMultiple.js';
export default async function getEdge(id, {
    returnProperties = false
} = {}) {
	
	let edges = await getMultiple([id], {
		returnProperties
	});

	return edges[0];

}