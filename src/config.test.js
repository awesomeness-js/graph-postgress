import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { init, set, setOnChange, settings } from './config.js';

describe('config onChange', () => {

	let snapshot;
	let onChange;

	beforeEach(() => {

		snapshot = JSON.parse(JSON.stringify(settings));
		onChange = vi.fn();
		setOnChange(onChange);
	
	});

	afterEach(() => {

		setOnChange(null);

		for (const key of Object.keys(snapshot)) {

			settings[key] = snapshot[key];
		
		}
	
	});

	it('does not fire onChange when init is called with the current settings', () => {

		init({
			host: settings.host,
			port: settings.port,
			ssl: settings.ssl
		});

		expect(onChange).not.toHaveBeenCalled();
	
	});

	it('does not fire onChange when init is called with no changes', () => {

		init({});

		expect(onChange).not.toHaveBeenCalled();
	
	});

	it('fires onChange once when init changes a setting', () => {

		init({
			host: 'changed-host.example'
		});

		expect(onChange).toHaveBeenCalledTimes(1);
	
	});

	it('does not fire onChange when init is given an equal ssl object', () => {

		settings.ssl = {
			rejectUnauthorized: false
		};

		init({
			ssl: {
				rejectUnauthorized: false
			}
		});

		expect(onChange).not.toHaveBeenCalled();
	
	});

	it('fires onChange when init changes ssl', () => {

		init({
			ssl: {
				rejectUnauthorized: false
			}
		});

		expect(onChange).toHaveBeenCalledTimes(1);
	
	});

	it('does not fire onChange when set is given the current value', () => {

		set('max', settings.max);

		expect(onChange).not.toHaveBeenCalled();
	
	});

	it('fires onChange once when set changes a value', () => {

		set('max', settings.max + 1);

		expect(onChange).toHaveBeenCalledTimes(1);
	
	});

	it('throws and does not fire onChange for an invalid set key', () => {

		expect(() => {

			set('notARealSetting', 1);
		
		}).toThrow('Invalid configuration parameter: notARealSetting');

		expect(onChange).not.toHaveBeenCalled();
	
	});

	it('throws and does not fire onChange for an invalid init key', () => {

		expect(() => {

			init({
				notARealSetting: 1
			});
		
		}).toThrow('Invalid configuration parameter: notARealSetting');

		expect(onChange).not.toHaveBeenCalled();
	
	});

});
