import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

const originalNodeEnv = process.env.NODE_ENV;

const importLogger = async () => {
	vi.resetModules();
	return (await import('@/lib/logger')).logger;
};

describe('logger utility', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
		process.env.NODE_ENV = originalNodeEnv;
	});

	test('emits debug logs in development mode', async () => {
		process.env.NODE_ENV = 'development';
		const logger = await importLogger();
		const spy = vi.spyOn(console, 'debug').mockImplementation(() => {});

		logger.debug('boot', { foo: 'bar' });

		expect(spy).toHaveBeenCalledWith('[2024-01-01T00:00:00.000Z] [DEBUG] boot {"foo":"bar"}');
	});

	test('skips debug logs outside development', async () => {
		process.env.NODE_ENV = 'production';
		const logger = await importLogger();
		const spy = vi.spyOn(console, 'debug').mockImplementation(() => {});

		logger.debug('boot');

		expect(spy).not.toHaveBeenCalled();
	});

	test('logs info and warn messages with context', async () => {
		process.env.NODE_ENV = 'development';
		const logger = await importLogger();

		const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		logger.info('ready');
		logger.warn('careful', { risk: 42 });

		expect(infoSpy).toHaveBeenCalledWith('[2024-01-01T00:00:00.000Z] [INFO] ready');
		expect(warnSpy).toHaveBeenCalledWith('[2024-01-01T00:00:00.000Z] [WARN] careful {"risk":42}');
	});

	test('logs error details when provided with Error instance', async () => {
		process.env.NODE_ENV = 'development';
		const logger = await importLogger();
		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const error = new Error('bad things');

		logger.error('failed', error, { step: 'fetch' });

		expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('"error":"bad things"'));
		expect(errorSpy.mock.calls[0][0]).toContain('"step":"fetch"');
		expect(errorSpy.mock.calls[0][0]).toContain('"stack"');
	});

	test('logs error details when provided with unknown value', async () => {
		process.env.NODE_ENV = 'development';
		const logger = await importLogger();
		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		logger.error('failed', 'timeout');

		expect(errorSpy).toHaveBeenCalledWith(
			'[2024-01-01T00:00:00.000Z] [ERROR] failed {"error":"timeout"}',
		);
	});
});
