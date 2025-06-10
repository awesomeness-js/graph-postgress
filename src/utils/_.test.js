import { describe, it, expect } from 'vitest';

import config from './config.js';
import createDB from './createDB.js';


describe('create db', async () => {

    it('should set config', async () => {
		
		try {

			let configUpdated = await config.init({
				password: 'abc123',
			}, true);

			console.log('configUpdated', configUpdated);

		} catch (ex) {

			console.error(ex);
			expect(ex).toBeNull();

		}

    });


	it('should create db', async () => {

		try {

			let result = await createDB();

			console.log('result', result);

			expect(result).toBeDefined();
			expect(result).toHaveProperty('created', true);

		} catch (ex) {

			console.error(ex);
			expect(ex).toBeNull();

		}

	});


});