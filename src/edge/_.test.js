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

			const result = await add({
				v1, 
				type: 'awesomeness__test', 
				v2, 
				properties: { 
					awesomeness__test: 123 
				}
			});

			expect(result?.v1).toBe(v1);
			expect(result?.v2).toBe(v2);
			expect(result?.type).toBe('awesomeness__test');


			cleanUpIds.push(result.id);
			

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
				{
					v1, 
					type: 'awesomeness__test', 
					v2, 
					properties: { 
						awesomeness__test: 1234
					}
				},
				{
					v1, 
					type: 'awesomeness__test', 
					v2, 
					properties: { 
						awesomeness__test: 1235
					}
				},
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

	it('should support filterProperties, sortBy, limit, and startIndex', async () => {

		const type = `awesomeness__test__search__${Date.now()}`;
		const v1 = uuid();

		try {

			const inserted = await addMultiple([
				{
					v1,
					type,
					v2: uuid(),
					properties: {
						group: 'search_opts',
						rank: '001'
					}
				},
				{
					v1,
					type,
					v2: uuid(),
					properties: {
						group: 'search_opts',
						rank: '002'
					}
				},
				{
					v1,
					type,
					v2: uuid(),
					properties: {
						group: 'search_opts',
						rank: '003'
					}
				}
			]);

			cleanUpIds.push(...inserted.map((edge) => edge.id));

			const edges = await search({
				edgeTypes: type,
				returnProperties: true,
				filterProperties: {
					group: 'search_opts'
				},
				sortBy: {
					property: 'rank',
					direction: 'desc'
				},
				startIndex: 1,
				limit: 2
			});

			expect(edges.length).toBe(2);
			expect(edges[0]?.properties?.rank).toBe('002');
			expect(edges[1]?.properties?.rank).toBe('001');

		} catch (ex) {

			console.error(ex);
			expect(ex).toBeNull();

		}

	});

	it('should support filterProperties date operators for created (after, before, between, lt, gt, lte, gte)', async () => {

		const type = `awesomeness__test__created__${Date.now()}`;
		const v1 = uuid();

		try {

			const inserted = await addMultiple([
				{
					v1,
					type,
					v2: uuid(),
					properties: {
						suite: 'created_ops',
						created: '2026-01-10T00:00:00Z'
					}
				},
				{
					v1,
					type,
					v2: uuid(),
					properties: {
						suite: 'created_ops',
						created: '2026-01-20T00:00:00Z'
					}
				},
				{
					v1,
					type,
					v2: uuid(),
					properties: {
						suite: 'created_ops',
						created: '2026-01-30T00:00:00Z'
					}
				}
			]);

			cleanUpIds.push(...inserted.map((edge) => edge.id));

			const afterResults = await search({
				edgeTypes: type,
				returnProperties: true,
				sortBy: {
					property: 'created',
					direction: 'asc' 
				},
				filterProperties: {
					suite: 'created_ops',
					created: { after: '2026-01-15T00:00:00Z' }
				}
			});

			expect(afterResults.length).toBe(2);
			expect(afterResults[0]?.properties?.created).toBe('2026-01-20T00:00:00Z');
			expect(afterResults[1]?.properties?.created).toBe('2026-01-30T00:00:00Z');

			const beforeResults = await search({
				edgeTypes: type,
				returnProperties: true,
				sortBy: {
					property: 'created',
					direction: 'asc' 
				},
				filterProperties: {
					suite: 'created_ops',
					created: { before: '2026-01-25T00:00:00Z' }
				}
			});

			expect(beforeResults.length).toBe(2);
			expect(beforeResults[0]?.properties?.created).toBe('2026-01-10T00:00:00Z');
			expect(beforeResults[1]?.properties?.created).toBe('2026-01-20T00:00:00Z');

			const betweenResults = await search({
				edgeTypes: type,
				returnProperties: true,
				sortBy: {
					property: 'created',
					direction: 'asc' 
				},
				filterProperties: {
					suite: 'created_ops',
					created: {
						between: [
							'2026-01-15T00:00:00Z',
							'2026-01-25T00:00:00Z'
						]
					}
				}
			});

			expect(betweenResults.length).toBe(1);
			expect(betweenResults[0]?.properties?.created).toBe('2026-01-20T00:00:00Z');

			const gtResults = await search({
				edgeTypes: type,
				returnProperties: true,
				sortBy: {
					property: 'created',
					direction: 'asc'
				},
				filterProperties: {
					suite: 'created_ops',
					created: { gt: '2026-01-20T00:00:00Z' }
				}
			});

			expect(gtResults.length).toBe(1);
			expect(gtResults[0]?.properties?.created).toBe('2026-01-30T00:00:00Z');

			const ltResults = await search({
				edgeTypes: type,
				returnProperties: true,
				sortBy: {
					property: 'created',
					direction: 'asc'
				},
				filterProperties: {
					suite: 'created_ops',
					created: { lt: '2026-01-20T00:00:00Z' }
				}
			});

			expect(ltResults.length).toBe(1);
			expect(ltResults[0]?.properties?.created).toBe('2026-01-10T00:00:00Z');

			const gteResults = await search({
				edgeTypes: type,
				returnProperties: true,
				sortBy: {
					property: 'created',
					direction: 'asc'
				},
				filterProperties: {
					suite: 'created_ops',
					created: { gte: '2026-01-20T00:00:00Z' }
				}
			});

			expect(gteResults.length).toBe(2);
			expect(gteResults[0]?.properties?.created).toBe('2026-01-20T00:00:00Z');
			expect(gteResults[1]?.properties?.created).toBe('2026-01-30T00:00:00Z');

			const lteResults = await search({
				edgeTypes: type,
				returnProperties: true,
				sortBy: {
					property: 'created',
					direction: 'asc'
				},
				filterProperties: {
					suite: 'created_ops',
					created: { lte: '2026-01-20T00:00:00Z' }
				}
			});

			expect(lteResults.length).toBe(2);
			expect(lteResults[0]?.properties?.created).toBe('2026-01-10T00:00:00Z');
			expect(lteResults[1]?.properties?.created).toBe('2026-01-20T00:00:00Z');

		} catch (ex) {

			console.error(ex);
			expect(ex).toBeNull();

		}

	});

	it('should reuse id and update when addMultiple unique=true', async () => {

		const v1 = uuid();
		const v2 = uuid();
		const type = `awesomeness__test__unique__${Date.now()}`;

		v1s.push(v1);
		v2s.push(v2);

		try {

			const first = await addMultiple([
				{
					v1,
					type,
					v2,
					properties: {
						awesomeness__test: 'first'
					}
				}
			], {
				unique: true
			});

			const second = await addMultiple([
				{
					v1,
					type,
					v2,
					properties: {
						awesomeness__test: 'second'
					}
				}
			], {
				unique: true
			});

			expect(second[0].id).toBe(first[0].id);

			const duplicateChunk = await addMultiple([
				{
					v1,
					type,
					v2,
					properties: {
						awesomeness__test: 'third'
					}
				},
				{
					v1,
					type,
					v2,
					properties: {
						awesomeness__test: 'fourth'
					}
				}
			], {
				unique: true
			});

			expect(duplicateChunk[0].id).toBe(first[0].id);
			expect(duplicateChunk[1].id).toBe(first[0].id);

			const edge = await get(first[0].id, {
				returnProperties: true
			});

			expect(edge?.id).toBe(first[0].id);
			expect(edge?.properties?.awesomeness__test).toBe('fourth');

			cleanUpIds.push(first[0].id);

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

			if(!v1s.length) {

				v1s.push(uuid()); 

			}

			if(!v2s.length) {

				v2s.push(uuid()); 

			}

			let edges = await search({
				edgeTypes: 'awesomeness__test',
			});
	
			if(edges[0]?.id){

				const deleteResult = await deleteOne(edges[0].id);

				expect(deleteResult).toBe(true);
			
			}

			if(edges[1]?.id){

				const allIds = edges.map((edge) => edge.id);
				const deleteMultipleResult = await deleteMultiple(allIds);

				expect(deleteMultipleResult).toBe(true);
			
			}
			
		} catch (ex) {

			console.error(ex);
			expect(ex).toBeNull();
		
		}


	});

	it('should return to and from', async () => {

		const v1 = uuid();
		const v2 = uuid();
		const type = `awesomeness__test__to_from__${Date.now()}`;

		try {

			const added = await add({
				v1,
				type,
				v2
			});

			const result = await get(added.id, {
				returnToFrom: true
			});

			console.log('result', result);

			expect(result).toHaveProperty('from', v1);
			expect(result).toHaveProperty('to', v2);

			const searchResult = await search({
				from: v1,
				type: type
			});

			expect(searchResult.length).toBe(1);
			expect(searchResult[0]).toHaveProperty('from', v1);

		} catch (ex) {

			console.error(ex);
			expect(ex).toBeNull();

		}

	});


});