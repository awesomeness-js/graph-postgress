import { describe, it, expect } from 'vitest';
import { uuid } from '@awesomeness-js/utils';

import addMultiple from './addMultiple.js';
import search from './search.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const PERSISTENT_TYPE = 'awesomeness__test__persistent__between';
const PERSISTENT_V1 = '11111111-1111-4111-8111-111111111111';
const PERSISTENT_V2S = [
	'22222222-2222-4222-8222-222222222222',
	'33333333-3333-4333-8333-333333333333',
	'44444444-4444-4444-8444-444444444444'
];

function toIso(daysFromNow) {

	return new Date(Date.now() + (daysFromNow * DAY_MS)).toISOString();

}

async function seedPersistentCreatedRecords() {

	const records = [
		{
			label: 'past_10d',
			created: toIso(-10),
			v2: PERSISTENT_V2S[0] 
		},
		{
			label: 'now',
			created: toIso(0),
			v2: PERSISTENT_V2S[1] 
		},
		{
			label: 'future_10d',
			created: toIso(10),
			v2: PERSISTENT_V2S[2] 
		}
	];

	await addMultiple(records.map((record) => ({
		id: uuid(),
		v1: PERSISTENT_V1,
		type: PERSISTENT_TYPE,
		v2: record.v2,
		properties: {
			suite: 'persistent_created_range',
			label: record.label,
			created: record.created
		}
	})), {
		unique: true
	});

	return records;

}

describe('edge.search persistent date range', async () => {

	it('keeps 3 persistent records and excludes +/-10 day records from between +/-5 days', async () => {

		await seedPersistentCreatedRecords();

		const startDate = toIso(-5);
		const endDate = toIso(5);

		const betweenResults = await search({
			edgeTypes: PERSISTENT_TYPE,
			returnProperties: true,
			sortBy: {
				property: 'created',
				direction: 'asc'
			},
			filterProperties: {
				suite: 'persistent_created_range',
				created: {
					between: [ startDate, endDate ]
				}
			}
		});

		expect(betweenResults.length).toBe(1);
		expect(betweenResults[0]?.properties?.label).toBe('now');

		const allPersistent = await search({
			edgeTypes: PERSISTENT_TYPE,
			returnProperties: true,
			sortBy: {
				property: 'created',
				direction: 'asc'
			},
			filterProperties: {
				suite: 'persistent_created_range'
			}
		});

		expect(allPersistent.length).toBe(3);
	
	});

});
