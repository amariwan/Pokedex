/**
 * Structured logging utility to replace console.* calls.
 * Provides consistent logging with levels and context.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
	[key: string]: unknown;
}

const isDevelopment = process.env.NODE_ENV === 'development';

class Logger {
	private log(level: LogLevel, message: string, context?: LogContext): void {
		if (!isDevelopment && level === 'debug') {
			return; // Skip debug logs in production
		}

		const timestamp = new Date().toISOString();
		const contextStr = context ? ` ${JSON.stringify(context)}` : '';
		const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;

		switch (level) {
			case 'error':
				console.error(logMessage);
				break;
			case 'warn':
				console.warn(logMessage);
				break;
			case 'info':
				console.info(logMessage);
				break;
			case 'debug':
				console.debug(logMessage);
				break;
		}
	}

	debug(message: string, context?: LogContext): void {
		this.log('debug', message, context);
	}

	info(message: string, context?: LogContext): void {
		this.log('info', message, context);
	}

	warn(message: string, context?: LogContext): void {
		this.log('warn', message, context);
	}

	error(message: string, error?: Error | unknown, context?: LogContext): void {
		const errorContext =
			error instanceof Error
				? { ...context, error: error.message, stack: error.stack }
				: { ...context, error };
		this.log('error', message, errorContext);
	}
}

export const logger = new Logger();
