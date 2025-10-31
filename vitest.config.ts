import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./vitest.setup.ts'],
		include: ['src/**/*.{test,spec}.{ts,tsx}'],
		exclude: ['tests/**'],
		coverage: {
			provider: 'v8',
			reportsDirectory: './coverage/unit',
			reporter: ['text', 'lcov', 'json-summary'],
			enabled: true,
			include: ['src/lib/**/*.ts', 'src/app/page.tsx', 'src/app/pokemon/[slug]/page.tsx'],
			exclude: ['src/lib/gsap/**', 'src/lib/data/**'],
			thresholds: {
				global: {
					lines: 100,
					functions: 100,
					branches: 100,
					statements: 100,
				},
			},
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
