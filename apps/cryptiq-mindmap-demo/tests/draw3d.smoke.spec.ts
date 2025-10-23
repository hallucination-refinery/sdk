import { test, expect } from '@playwright/test'

// Light smoke: ensure the /draw3d route boots and HUD/canvases mount
// Skip when Playwright browsers are unavailable in CI
const browserUnavailable = !!process.env.CI && !process.env.PLAYWRIGHT_BROWSERS_PATH

test.describe('draw3d smoke', () => {
  test.skip(browserUnavailable, 'Playwright browsers not installed in CI')

  test('HUD and canvases mount', async ({ page }) => {
    await page.goto('/draw3d', { waitUntil: 'domcontentloaded' })

    await expect(page.getByText('ready:')).toBeVisible()
    await expect(page.getByText('load:')).toBeVisible()
    await expect(page.getByText('infer:')).toBeVisible()
    await expect(page.getByText('fps:')).toBeVisible()
    await expect(page.getByText('instances:')).toBeVisible()

    const canvases = page.locator('canvas')
    await expect(canvases).toHaveCount(1)
    await expect(canvases.first()).toBeVisible()
  })
})
