import { test, expect } from '@playwright/test'

test('draw3d smoke', async ({ page }) => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
  const url = `${baseUrl}/draw3d`

  await page.goto(url, { waitUntil: 'domcontentloaded' })

  await expect(page.getByText('ready:')).toBeVisible()
  await expect(page.getByText('load:')).toBeVisible()
  await expect(page.getByText('infer:')).toBeVisible()
  await expect(page.getByText('fps:')).toBeVisible()
  await expect(page.getByText('instances:')).toBeVisible()

  const canvases = page.locator('canvas')
  await expect(canvases).toHaveCount(1)
  await expect(canvases.first()).toBeVisible()

  await expect(page.getByRole('button', { name: 'Classify' })).toHaveCount(0)
})
