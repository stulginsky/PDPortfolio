import { chromium } from 'playwright'
import assert from 'node:assert/strict'
const browser = await chromium.launch({ headless: true })
try {
  for (const width of [320, 768, 1024, 1920]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
    await page.goto('http://127.0.0.1:6006/iframe.html?id=compositions-relatedcases--sandbox&viewMode=story', { waitUntil: 'networkidle' })
    await page.waitForTimeout(3500)
    await page.getByRole('button', { name: 'Reset', exact: true }).click()
    await page.evaluate(() => document.fonts.ready)
    assert.equal(await page.evaluate(() => CSS.supports('text-box', 'trim-both cap alphabetic')), true)
    const values = await page.locator('.related-cases .ds-badge').evaluateAll(badges => badges.map(badge => {
      const text = badge.querySelector('.ds-badge__text')
      const b = badge.getBoundingClientRect(), t = badge.querySelector('.ds-badge__glyphs').getBoundingClientRect()
      return { label: text.textContent, x: (t.left + t.right - b.left - b.right) / 2, y: (t.top + t.bottom - b.top - b.bottom) / 2, width: b.width, height: b.height }
    }))
    for (const badge of values) {
      assert.ok(Math.abs(badge.x) < .1 && Math.abs(badge.y) < .1, `${width}: ${badge.label} cap box not centered`)
    }
    console.log(JSON.stringify({ width, checked: values.length, result: 'cap boxes centered', maxVerticalError: Math.max(...values.map(badge => Math.abs(badge.y))) }))
    if (width === 1024) {
      await page.getByRole('button', { name: 'Следующие кейсы' }).click()
      await page.screenshot({ path: 'E:/GitHub/PDPortfolio-DS/ds/evidence/related-cases-badges-1024.png' })
    }
    await page.close()
  }
} finally { await browser.close() }
