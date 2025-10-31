import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './tests/e2e',
	testMatch: ['**/*.e2e.ts'],
	timeout: 120_000,
	expect: {
		timeout: 10_000,
	},
	reporter: [['list'], ['html', { outputFolder: 'coverage/e2e-report', open: 'never' }]],
	use: {
		baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3000',
		trace: 'on-first-retry',
		video: 'retain-on-failure',
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
	webServer: {
		command: 'pnpm dev',
		port: 3000,
		timeout: 120_000,
		reuseExistingServer: !process.env.CI,
		env: {
			NEXT_TELEMETRY_DISABLED: '1',
			PORT: '3000',
		},
	},
});
