import { expect, test } from '@playwright/test'

test('klinika katalogidan laboratoriya yo‘nalishiga o‘tadi', async ({ page }) => {
  await page.goto('/clinic')

  const directions = page.locator('a[href="/clinic/services"]')
  await expect(directions).toHaveCount(1)
  await directions.click()
  await expect(page).toHaveURL(/\/clinic\/services$/)

  const laboratory = page.locator('a[href="/clinic/laboratory"]')
  await expect(laboratory).toHaveCount(1)
  await laboratory.click()

  await expect(page).toHaveURL(/\/clinic\/laboratory$/)
  await expect(page.getByRole('heading', { name: 'Laboratoriya', level: 1 })).toBeVisible()
})

test.describe('mobil klinik yo‘nalish', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true })

  test('laboratoriya sarlavhasi va tavsifi ekrandan chiqmaydi', async ({ page }) => {
    await page.goto('/clinic/laboratory')

    const title = page.getByRole('heading', { name: 'Laboratoriya', level: 1 })
    await expect(title).toBeVisible()
    await expect(page.getByText('Laboratoriya markazi klinik tahlillar', { exact: false })).toBeVisible()

    const dimensions = await page.evaluate(() => {
      const heading = document.querySelector('.specialty-detail__hero-copy h1')
      if (!heading) throw new Error('Specialty heading was not rendered')

      const rect = heading.getBoundingClientRect()
      return {
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        headingRight: rect.right,
      }
    })

    expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth)
    expect(dimensions.headingRight).toBeLessThanOrEqual(dimensions.viewportWidth)
  })

  test('qabulga yozilish havolasi kerakli so‘rov bilan ochiladi', async ({ page }) => {
    await page.goto('/clinic/laboratory')

    const booking = page.locator('.specialty-detail__actions a[href="/contacts?intent=booking"]')
    await expect(booking).toHaveCount(1)
    await expect(booking).toHaveAttribute('href', '/contacts?intent=booking')
  })

  test('sahifa ichidagi navigatsiya silliq, reduced-motionda esa darhol ishlaydi', async ({ page }) => {
    await page.goto('/clinic/laboratory')
    await expect(page.getByRole('heading', { name: 'Laboratoriya', level: 1 })).toBeVisible()

    await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'smooth')

    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto')
  })
})
