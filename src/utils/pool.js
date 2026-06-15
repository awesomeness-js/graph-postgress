import pg from 'pg';
const { Pool } = pg;

import { settings, setOnChange } from '../config.js';

let pool;
let isPoolEnded = false;

function createNewPool() {

	const nextPool = new Pool(settings);
	nextPool.on('error', async (err) => {

		console.error('Unexpected error on idle client', err);
		await closePool(nextPool);
	
	});

	pool = nextPool;
	isPoolEnded = false;

	return nextPool;

}

function createPool() {

	if (!pool || isPoolEnded) return createNewPool();

	return pool;

}

async function closePool(targetPool = pool) {

	if (!targetPool) return;
	if (targetPool === pool && isPoolEnded) return;
	if (targetPool === pool) isPoolEnded = true;

	try {

		await targetPool.end();
		console.log('Pool ended gracefully');
	
	} catch (err) {

		console.error('Error closing pool:', err);
	
	} finally {

		if (targetPool === pool) {

			pool = undefined;
			isPoolEnded = false;
		
		}
	
	}

}

function resetPool() {

	const currentPool = pool;
	pool = undefined;
	isPoolEnded = false;

	if (currentPool) {

		currentPool.end().catch((err) => {

			console.error('Error closing pool during reset:', err);
		
		});
	
	}

	createNewPool();
	console.log('Pool reset with new settings');

}

setOnChange(resetPool);

process.on('SIGINT', async () => {

	await closePool();
	process.exit(0);

});

process.on('uncaughtException', async (err) => {

	console.error('Uncaught Exception:', err);
	await closePool();

});

process.on('unhandledRejection', async (reason) => {

	console.error('Unhandled Rejection:', reason);
	await closePool();

});

export default {
	createPool,
	closePool,
	resetPool 
};

export {
	createPool, 
	closePool, 
	resetPool 
};
