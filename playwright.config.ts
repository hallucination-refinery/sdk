import { defineConfig, devices } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const SMOKE_ROUTE = process.env.SMOKE_ROUTE || '/brain'

export default defineConfig({
  testDir: 'tests',
  timeout: 60_000,
  workers: 1,
  retries: 1,
  outputDir: '.clmem/artifacts/playwright',
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    baseURL: BASE_URL,
    viewport: {
      width: Number(process.env.VIEWPORT_W || 1280),
      height: Number(process.env.VIEWPORT_H || 800),
    },
    launchOptions: {
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm -C apps/cryptiq-mindmap-demo dev -p 3000',
    url: `${BASE_URL}${SMOKE_ROUTE}`,
    timeout: 120_000,
    reuseExistingServer: true,
  },
})
