import { test, expect } from '@playwright/test'

// Light smoke: ensure the /draw3d route boots and HUD reports ready
// Skip in CI when browsers are unavailable
const browsersMissing = !!process.env.CI && !process.env.PLAYWRIGHT_BROWSERS_PATH

test.describe('draw3d smoke', () => {
  test.skip(browsersMissing, 'Playwright browsers not installed in CI')

  test('HUD shows ready label', async ({ page }) => {
    await page.goto('/draw3d')
    await expect(page.getByText('ready:')).toBeVisible()
  })
})
