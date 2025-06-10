import { init } from './utils/config.js';
export default async (payload, test) =>{
    await init(payload, test);
};
