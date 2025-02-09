import getMultiple from './getMultiple.js';
export default async function getVertex(id){
    const fetched = await getMultiple([id],{ keyById: false  });
    return fetched[0];
}