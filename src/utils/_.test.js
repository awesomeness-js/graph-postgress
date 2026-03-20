import { describe, it, expect } from 'vitest';
import config from '../config.js';
import createDB from './createDB.js';
import createIndex from './createIndex.js';
import listIndexes from './listIndexes.js';
import removeIndex from './removeIndex.js';


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

	it('should create, find, then remove test index on justATest property', async () => {

		const indexName = `awesomeness_test_justATest_${Date.now()}_idx`;
		const normalizedIndexName = indexName.toLowerCase();

		try {

			const created = await createIndex({
				target: 'edges',
				propertyKey: 'justATest',
				indexName
			});

			expect(created).toBeDefined();
			expect(created.indexName).toBe(normalizedIndexName);

			const found = await listIndexes();

			expect(found.some((idx) => idx.indexName === normalizedIndexName)).toBe(true);

			const removed = await removeIndex({
				target: 'edges',
				indexName
			});

			expect(removed).toBeDefined();
			expect(removed.removed).toBe(true);

			const afterRemove = await listIndexes();

			expect(afterRemove.some((idx) => idx.indexName === normalizedIndexName)).toBe(false);

		} catch (ex) {

			console.error(ex);
			expect(ex).toBeNull();

		}

	});


});