import deleteVertices from './deleteMultiple.js';
export default async function deleteVertex(vertexID){
	return deleteVertices([vertexID]);
}