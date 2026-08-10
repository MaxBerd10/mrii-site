import { expect, test } from '@playwright/test'

const routes = [
  '/',
  '/clinic',
  '/clinic/services',
  '/doctors',
  '/prices',
  '/research',
  '/education',
  '/ai',
  '/contacts',
]

test.describe('mobil sahifa tuzilishi', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true })

  test('menyuda bo‘limlar yig‘ilgan va ochib yopiladi', async ({ page }) => {
    await page.goto('/')

    const menu = page.getByRole('button', { name: /menyu|menu/i })
    await menu.click()

    const clinicToggle = page.getByRole('button', { name: /klinika|clinic/i })
    await expect(clinicToggle).toHaveAttribute('aria-expanded', 'false')
    await expect(page.locator('a[href="/clinic/services"]')).toBeHidden()

    await clinicToggle.click()
    await expect(clinicToggle).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('a[href="/clinic/services"]')).toBeVisible()
  })

  for (const route of routes) {
    test(`${route} gorizontal scroll chiqarmaydi`, async ({ page }) => {
      await page.goto(route)
      await expect(page.locator('body')).toBeVisible()

      const widths = await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      }))

      expect(widths.documentWidth).toBeLessThanOrEqual(widths.viewportWidth)
    })
  }
})
