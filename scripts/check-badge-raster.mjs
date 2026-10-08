import { chromium } from 'playwright'
import { PNG } from 'pngjs'

const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1024, height: 900 }, deviceScaleFactor: 3, reducedMotion: 'reduce' })
  await page.goto('http://127.0.0.1:6006/iframe.html?id=compositions-relatedcases--sandbox&viewMode=story', { waitUntil: 'networkidle' })
  await page.waitForTimeout(3500)
  await page.getByRole('button', { name: 'Reset', exact: true }).click()
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(100)
  const badges = page.locator('.related-cases .ds-badge')
  for (let i = 0; i < 12; i++) {
    const badge = badges.nth(i)
    const info = await badge.evaluate(el => {
      const text = el.querySelector('.ds-badge__text')
      const b = el.getBoundingClientRect(), t = text.getBoundingClientRect()
      return { label: text.textContent, transform: text.style.transform, baselineBoxTop: t.top - b.top, x1: t.left - b.left, x2: t.right - b.left }
    })
    const png = PNG.sync.read(await badge.screenshot())
    let top = png.height, bottom = -1
    for (let y = 0; y < png.height; y++) for (let x = Math.ceil(info.x1 * 3); x < Math.floor(info.x2 * 3); x++) {
      const index = (y * png.width + x) * 4
      if (png.data[index] < 120 && png.data[index + 1] < 120 && png.data[index + 2] < 120 && png.data[index + 2] - png.data[index] < 40) { top = Math.min(top, y); bottom = Math.max(bottom, y) }
    }
    console.log(JSON.stringify({ ...info, inkOffsetY: (top + bottom + 1 - png.height) / 6 }))
  }
} finally { await browser.close() }
