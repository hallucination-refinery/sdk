import { test, expect } from '@playwright/test'

// Light smoke: ensure the /draw3d route boots and HUD reports ready
// Skip when Playwright browsers are unavailable in CI
const browserUnavailable =
  !!process.env.CI && !process.env.PLAYWRIGHT_BROWSERS_PATH

test.describe('draw3d smoke', () => {
  test.skip(browserUnavailable, 'Playwright browsers not installed in CI')

  test('HUD shows ready label', async ({ page }) => {
    await page.goto('/draw3d')
    await expect(page.getByText('ready:')).toBeVisible()
  })
})
