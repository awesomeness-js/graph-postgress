import { describe, it, expect } from 'vitest';
import { uuid } from '@awesomeness-js/utils';

import add from './add.js';
import addMultiple from './addMultiple.js';

import deleteOne from './delete.js';
import deleteMultiple from './deleteMultiple.js';

import get from './get.js';
import getMultiple from './getMultiple.js';

import search from './search.js';

describe('add', async () => {

	let cleanUpIds = [];

    it('should call add with the correct arguments', async () => {
		
		try {

			const result = await add({ type: 'awesomeness__test', some: 'data' });
			expect(result).toHaveProperty('id');
			expect(result).toHaveProperty('type');
			expect(result).toHaveProperty('some');
			cleanUpIds.push(result.id);

		} catch (ex) {

			console.log(ex);

		}

    });

	it('should call addMultiple with the correct arguments', async () => {
		
		const id = uuid();

		let vertex  = { id: id, type: 'awesomeness__test', some: 'data' };

		try {

			const result = await addMultiple([vertex]);	

			expect(result.length).toEqual(1);

			expect(result[0]).toHaveProperty('id');
			expect(result[0].id).toEqual(id);
			expect(result[0]).toHaveProperty('type');
			expect(result[0]).toHaveProperty('some');

			cleanUpIds.push(id);

		
		} catch (ex) {

			console.error(ex);
			expect(ex).toBeNull();

		}


    });

	it('should get the vertices', async () => {

		let vertices = await getMultiple(cleanUpIds, { keyById: false });

		expect(vertices.length).toEqual(2);

	});


	it('should delete the vertices', async () => {

		let result = await deleteMultiple(cleanUpIds);

		expect(result).toBe(true);

	});

	it('should delete the vertices', async () => {

		const createResult = await add({ type: 'awesomeness__test', some: 'data' });

		expect(createResult).toHaveProperty('id');

		const searchResult = await search('awesomeness__test');
		let testIds = Object.keys(searchResult);

		const getResult = await get(createResult.id);

		expect(getResult).toHaveProperty('id');
		
		const deleteResult = await deleteOne(createResult.id);

		expect(deleteResult).toBe(true);

		const deleteMultipleResult = await deleteMultiple(testIds);

		expect(deleteMultipleResult).toBe(true);

	});

});