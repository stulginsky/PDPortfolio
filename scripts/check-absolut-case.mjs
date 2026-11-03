import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'

const output = 'tmp/absolut-case'
await fs.mkdir(output, { recursive: true })
const browser = await chromium.launch({ headless: true, channel: 'msedge' })
const report = []
try {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  for (const width of [1920, 768, 320]) {
    await page.setViewportSize({ width, height: 1080 })
    await page.goto('http://127.0.0.1:3000/cases/absolut', { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    const posters = page.locator('.absolut-case__poster')
    await assert.equal(await posters.count(), 4)
    for (let index = 0; index < 4; index++) {
      await posters.nth(index).scrollIntoViewIfNeeded()
      await posters.nth(index).locator('img').evaluate(image => image.decode())
    }
    await page.evaluate(() => scrollTo(0, 0))
    const geometry = await page.evaluate(() => {
      const box = selector => document.querySelector(selector).getBoundingClientRect().toJSON()
      return {
        width: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth,
        opening: box('.absolut-case__opening'), copy: box('.absolut-case__copy'), role: box('.absolut-case__role'),
        posters: [...document.querySelectorAll('.absolut-case__poster')].map(element => {
          const image = element.querySelector('img')
          return { ...element.getBoundingClientRect().toJSON(), src: image.getAttribute('src'), naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight, image: image.getBoundingClientRect().toJSON() }
        }), footer: box('.absolut-case__ending'), height: document.documentElement.scrollHeight,
      }
    })
    assert.equal(geometry.overflow, false)
    assert.deepEqual(geometry.posters.map(p => p.src), ['message', 'vigilance', 'dacha', 'russua'].map(name => `/cases/absolut/${name}.png`))
    for (const poster of geometry.posters) {
      assert.ok(poster.naturalWidth > 0 && poster.naturalHeight > 0)
      assert.ok(Math.abs(poster.image.width / poster.image.height - poster.naturalWidth / poster.naturalHeight) < .001)
    }
    if (width === 1920) {
      assert.equal(geometry.opening.x, 498)
      assert.equal(geometry.opening.y, 144)
      assert.equal(geometry.opening.width, 924)
      assert.equal(geometry.role.width, 924)
      assert.ok(Math.abs(geometry.opening.height - 348) < 1, JSON.stringify(geometry.opening))
      assert.ok(Math.abs(geometry.posters[0].y - 636) < 1)
      assert.ok(Math.abs(geometry.footer.y - 6060.679) < 1, JSON.stringify(geometry))
    }
    await page.screenshot({ path: `${output}/${width}.png`, fullPage: true })
    // The media itself is inert; only the original zoom control opens the viewer.
    await posters.first().scrollIntoViewIfNeeded()
    await posters.first().locator('img').click({ position: { x: 20, y: 20 } })
    assert.equal(await page.getByRole('dialog').count(), 0)
    const zoom = posters.first().getByRole('button')
    await zoom.click()
    const dialog = page.getByRole('dialog', { name: 'Absolut Message', exact: true })
    await dialog.waitFor()
    await page.waitForFunction(() => document.querySelector('[role=dialog]')?.getAttribute('aria-busy') === 'false')
    await page.screenshot({ path: `${output}/viewer-${width}.png` })
    await page.keyboard.press('Escape')
    await dialog.waitFor({ state: 'detached' })
    assert.equal(await zoom.evaluate(element => element === document.activeElement), true)
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight))
    await page.locator('.ds-page-up button').click()
    await page.waitForFunction(() => scrollY < 1)
    assert.equal(await page.locator('.absolut-case__back a').getAttribute('href'), '/')
    report.push(geometry)
  }
  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' })
  await page.locator('[data-case-href="/cases/absolut"] .absolut').click()
  await page.waitForURL(url => /^\/cases\/absolut\/?$/.test(url.pathname))
  assert.equal(errors.length, 0, errors.join('\n'))
  await fs.writeFile(`${output}/verification.json`, JSON.stringify({ report, errors, navigation: 'passed', viewer: 'passed' }, null, 2))
  console.log('Absolut: 1920/768/320 geometry, assets, zoom, Escape/focus return, page-up and showcase navigation passed')
} finally { await browser.close() }
