import pg from 'pg';
const { Pool } = pg;
import config from './config.js';

const configSettings = config.settings();
const pool = new Pool(configSettings);

let isPoolEnded = false;

async function closePool() {
    
    if (isPoolEnded) return;
    isPoolEnded = true;

    try {
        await pool.end();
        console.log('PostgreSQL pool has ended gracefully');
    } catch (err) {
        console.error('Error closing the pool:', err);
    }

    // whats up?

    console.log('wtf?');
}

pool.on('error', async (err, client) => {
    console.error('Unexpected error on idle client', err);
    await closePool();
});

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
