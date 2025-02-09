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

	const cleanUpIds = [];
	const v1s = [];
	const v2s = [];

    it('should call add with the correct arguments', async () => {
		
		try {

			const v1 = uuid();
			const v2 = uuid();

			v1s.push(v1);
			v2s.push(v2);

			const result = await add( v1, 'awesomeness__test', v2, null, { awesomeness__test: 123 } );

			expect(result?.v1).toBe(v1);
			expect(result?.v2).toBe(v2);
			expect(result?.type).toBe('awesomeness__test');


			cleanUpIds.push(result.id)
			

		} catch (ex) {

			console.log(ex);

		}

    });

	it('should call addMultiple with the correct arguments', async () => {
		
		const v1 = uuid();
		const v2 = uuid();

		v1s.push(v1);
		v2s.push(v2);

		try {

			const result = await addMultiple([
				[v1, 'awesomeness__test', v2, null, { awesomeness__test: 1234 }],
				[v1, 'awesomeness__test', v2, null, { awesomeness__test: 1235 }],
			]);	

			expect(result.length).toEqual(2);

			expect(result[0]?.v1).toBe(v1);
			expect(result[0]?.v2).toBe(v2);
			expect(result[0]?.type).toBe('awesomeness__test');


			expect(result[1]?.v1).toBe(v1);
			expect(result[1]?.v2).toBe(v2);
			expect(result[1]?.type).toBe('awesomeness__test');


			cleanUpIds.push(result[0].id);
			cleanUpIds.push(result[1].id);

		
		} catch (ex) {

			console.error(ex);
			expect(ex).toBeNull();

		}


    });

	it('should get the edges', async () => {

		let edge = await get(cleanUpIds[0]);
		expect(edge).toHaveProperty('id');


		let edges = await getMultiple(cleanUpIds);
		expect(edges.length).toBeGreaterThan(0);

	});


	it('do a little of everything', async () => {
		
		try {

			if(!v1s.length) { v1s.push(uuid()); }
			if(!v2s.length) { v2s.push(uuid()); }

			let edges = await search('x', 'awesomeness__test', 'x');
	
			if(edges[0]?.id){
				const deleteResult = await deleteOne(edges[0].id);
				expect(deleteResult).toBe(true);
			}

			if(edges[1]?.id){
				const allIds = edges.map(edge => edge.id);
				const deleteMultipleResult = await deleteMultiple(allIds);
				expect(deleteMultipleResult).toBe(true);
			}
			
		} catch (ex) {
			console.error(ex);
			expect(ex).toBeNull();
		}


	});

});