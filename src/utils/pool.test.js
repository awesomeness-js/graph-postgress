import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { Pool } = vi.hoisted(() => {

	const Pool = vi.fn().mockImplementation(() => {

		return {
			on: vi.fn(),
			end: vi.fn().mockResolvedValue(undefined)
		};
	
	});

	return { Pool };

});

vi.mock('pg', () => {

	return {
		default: { Pool },
		Pool
	};

});

import { createPool, resetPool } from './pool.js';
import { init, settings } from '../config.js';

describe('resetPool', () => {

	let snapshot;
	let log;

	beforeEach(() => {

		snapshot = JSON.parse(JSON.stringify(settings));
		log = vi.spyOn(console, 'log').mockImplementation(() => {});
		Pool.mockClear();
	
	});

	afterEach(() => {

		resetPool();
		log.mockRestore();

		for (const key of Object.keys(snapshot)) {

			settings[key] = snapshot[key];
		
		}
	
	});

	it('does not construct a pool when none exists', () => {

		resetPool();

		expect(Pool).not.toHaveBeenCalled();
		expect(log).not.toHaveBeenCalledWith('Pool reset with new settings');
	
	});

	it('lets createPool build a pool lazily after reset', () => {

		resetPool();

		expect(Pool).not.toHaveBeenCalled();

		const first = createPool();
		const second = createPool();

		expect(Pool).toHaveBeenCalledTimes(1);
		expect(second).toBe(first);
	
	});

	it('ends a live pool and does not construct a replacement', () => {

		const current = createPool();

		Pool.mockClear();
		resetPool();

		expect(current.end).toHaveBeenCalledTimes(1);
		expect(Pool).not.toHaveBeenCalled();
		expect(log).not.toHaveBeenCalledWith('Pool reset with new settings');
	
	});

	it('does not reset or create a pool when init is given the current settings', () => {

		const current = createPool();

		Pool.mockClear();
		current.end.mockClear();

		init({
			host: settings.host,
			port: settings.port,
			ssl: settings.ssl
		});

		expect(current.end).not.toHaveBeenCalled();
		expect(Pool).not.toHaveBeenCalled();
		expect(log).not.toHaveBeenCalledWith('Pool reset with new settings');
	
	});

	it('ends a live pool without creating a new one when init changes settings', () => {

		const current = createPool();

		Pool.mockClear();

		init({
			host: 'changed-host.example'
		});

		expect(current.end).toHaveBeenCalledTimes(1);
		expect(Pool).not.toHaveBeenCalled();
		expect(log).not.toHaveBeenCalledWith('Pool reset with new settings');

		const next = createPool();

		expect(Pool).toHaveBeenCalledTimes(1);
		expect(next).not.toBe(current);
	
	});

});
