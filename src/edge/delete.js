import deleteMultiple from './deleteMultiple.js';
export default async function deleteEdge(edgeID){
	return await deleteMultiple([edgeID]);
}