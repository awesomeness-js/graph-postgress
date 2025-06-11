import pg from 'pg';
const { Pool } = pg;
import { settings, setOnChange } from '../config.js';

let pool;
let isPoolEnded = false;

function createPool() {
    if (!pool) {
        pool = new Pool(settings);
        pool.on('error', async (err) => {
            console.error('Unexpected error on idle client', err);
            await closePool();
        });
    }
    return pool;
}

async function closePool() {
    if (isPoolEnded || !pool) return;
    isPoolEnded = true;
    try {
        await pool.end();
        console.log('Pool ended gracefully');
    } catch (err) {
        console.error('Error closing pool:', err);
    }
}

function resetPool() {
    if (pool) pool.end();
    pool = new Pool(settings);
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

export default pool;
export { createPool, closePool, resetPool };
