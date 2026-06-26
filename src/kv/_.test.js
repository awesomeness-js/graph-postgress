import { describe, it, expect } from 'vitest';

import add from './add.js';
import addMultiple from './addMultiple.js';

import set from './set.js';
import mGet from './mGet.js';

import deleteOne from './delete.js';
import deleteMultiple from './deleteMultiple.js';

import getMultiple from './getMultiple.js';

describe('add', async () => {

	it('should call add with the correct arguments', async () => {
		
		try {

			const result = await add('awesomeness__test', { some: 'data' });

			expect(result).toEqual({ some: 'data' });	

		} catch (ex) {

			console.error(ex);
			expect(ex).toBeNull();

		}

	});

	it('should call addMultiple with the correct arguments', async () => {
		
		let kvs = {
			awesomeness__test: { some: 'data2' },
			awesomeness__testObject: { some: 'data' },
			awesomeness__testString: "some string",
			awesomeness__testNumber: 123,
			awesomeness__testBoolean: true,
			awesomeness__testArray: [ 1, 2, 3 ],
			awesomeness__delete0: "delete0",
			awesomeness__delete1: "delete1",
			awesomeness__delete2: "delete2",
		};

		try {

			const result = await addMultiple(kvs);	

			expect(result).toEqual(kvs);
		
		} catch (ex) {

			console.error(ex);
			expect(ex).toBeNull();

		}


	});

	it('should get the correct value from the key', async () => {

		let kvs = {
			awesomeness__test: { some: 'data2' },
			awesomeness__testObject: { some: 'data' },
			awesomeness__testString: "some string",
			awesomeness__testNumber: 123,
			awesomeness__testBoolean: true,
			awesomeness__testArray: [ 1, 2, 3 ],
			awesomeness__delete0: "delete0",
			awesomeness__delete1: "delete1",
			awesomeness__delete2: "delete2",
		};

		let keys = Object.keys(kvs);

		let kvsBack = await getMultiple(keys);

		expect(kvsBack).toEqual(kvs);

		let delZero = await deleteOne('delete0');

		expect(delZero).toEqual(true);

		let del = await deleteMultiple([
			'awesomeness__test',
			'awesomeness__testObject',
			'awesomeness__testString',
			'awesomeness__testNumber',
			'awesomeness__testBoolean',
			'awesomeness__testArray',
			'awesomeness__delete0',
			'awesomeness__delete1',
			'awesomeness__delete2',
		]);

		expect(del).toEqual(true);

	});


	// set
	it('should set the correct value for a key', async () => {
		
		const result = await set('awesomeness__testSet', { some: 'data' });

		expect(result).toEqual({ some: 'data' });

	});

	// mget
	it('should get the correct values for multiple keys', async () => {

		let kvs = {
			awesomeness__testSet: { some: 'data' },
			awesomeness__testSet2: { some: 'data2' },
			awesomeness__testSet3: { some: 'data3' },
		};

		await addMultiple(kvs);

		let keys = Object.keys(kvs);

		let kvsBack = await mGet(keys);

		expect(kvsBack).toEqual(kvs);

		let del = await deleteMultiple(keys);

		expect(del).toEqual(true);

	});


});