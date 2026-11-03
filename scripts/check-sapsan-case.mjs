import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'

const output = 'tmp/sapsan-case'
await fs.mkdir(output, { recursive: true })
const browser = await chromium.launch({ headless: true, channel: 'msedge' })
try {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  const report = []
  for (const width of [1920, 768, 320]) {
    await page.setViewportSize({ width, height: 1080 })
    await page.goto('http://127.0.0.1:3000/cases/sapsan-cr', { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    await page.locator('.sapsan-case__poster img').evaluate(image => image.decode())
    const geometry = await page.evaluate(() => {
      const box = selector => document.querySelector(selector).getBoundingClientRect().toJSON()
      return { width: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth,
        opening: box('.sapsan-case__opening'), role: box('.sapsan-case__role'),
        media: box('.sapsan-case__poster'), ending: box('.sapsan-case__ending'),
        height: document.querySelector('main').getBoundingClientRect().height }
    })
    assert.equal(geometry.overflow, false)
    assert.ok(Math.abs(geometry.media.width / geometry.media.height - 1190 / 2922) < .001)
    if (width === 1920) {
      assert.equal(geometry.opening.x, 498)
      assert.equal(geometry.opening.y, 144)
      assert.ok(Math.abs(geometry.opening.height - 476) < 1, JSON.stringify(geometry))
      assert.ok(Math.abs(geometry.media.y - 764) < 1, JSON.stringify(geometry))
      assert.ok(Math.abs(geometry.height - 3602.847) < 1, JSON.stringify(geometry))
    }
    await page.screenshot({ path: `${output}/${width}.png`, fullPage: true })
    const preview = page.locator('.sapsan-case__poster')
    await preview.locator('img').click({ position: { x: 20, y: 20 } })
    assert.equal(await page.getByRole('dialog').count(), 0)
    await preview.getByRole('button').click()
    await page.getByRole('dialog').waitFor()
    await page.keyboard.press('Escape')
    await page.getByRole('dialog').waitFor({ state: 'detached' })
    report.push(geometry)
  }
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' })
  const card = page.locator('[data-case-href="/cases/sapsan-cr"]')
  await card.scrollIntoViewIfNeeded()
  await card.getByRole('button').click()
  await page.waitForURL(url => /^\/cases\/sapsan-cr\/?$/.test(url.pathname))
  assert.deepEqual(errors, [])
  await fs.writeFile(`${output}/verification.json`, JSON.stringify({ report, errors, navigation: 'passed', viewer: 'passed' }, null, 2))
  console.log('Sapsan: geometry 1920/768/320, image, viewer, Escape and showcase navigation passed')
} finally { await browser.close() }
