import { describe, it, expect } from 'vitest';
import { settings, init } from './config.js';

describe('test settings', async () => {

	it('update settings', async () => {
		
		const newSettings = {
			password: 'new-password',
			database: 'new_database',
		};

		const updatedSettings = init(newSettings);

		expect(settings.password).toBe(newSettings.password);

    });

	

});