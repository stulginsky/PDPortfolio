import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { createHash } from 'node:crypto'

const openingOnly = process.argv.includes('--opening')
const output = 'tmp/aqua-maris-case'
await fs.mkdir(output, { recursive: true })
if (process.argv.includes('--static')) {
  const content = JSON.parse(await fs.readFile('content/cases/aqua-maris.json', 'utf8'))
  const html = await fs.readFile('.output/public/cases/aqua-maris/index.html', 'utf8')
  const home = await fs.readFile('.output/public/index.html', 'utf8')
  assert.ok(home.includes('/cases/aqua-maris'))
  const assets = []
  for (const media of content.page.media) {
    assert.ok(html.includes(media.src), media.src)
    const original = await fs.readFile(`public${media.src}`)
    const packaged = await fs.readFile(`.output/public${media.src}`)
    assert.ok(original.length > 0)
    assert.ok(original.equals(packaged), media.src)
    assets.push({ ...media, bytes: original.length, sha256: createHash('sha256').update(original).digest('hex') })
  }
  await fs.writeFile(`${output}/assets.json`, JSON.stringify({ route: 'passed', showcase: 'passed', assets }, null, 2))
  console.log('Aqua Maris: generated case route, showcase target and all original poster bytes packaged correctly')
  process.exit(0)
}
const browser = await chromium.launch({ headless: true, channel: 'msedge' })
const report = []
try {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  for (const width of openingOnly ? [1920, 320] : [1920, 768, 425, 320]) {
    await page.setViewportSize({ width, height: 1080 })
    await page.goto('http://127.0.0.1:3000/cases/aqua-maris', { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    const posters = page.locator('.aqua-maris-case__poster')
    assert.equal(await posters.count(), openingOnly ? 1 : 3)
    for (let index = 0; index < await posters.count(); index++) {
      await posters.nth(index).scrollIntoViewIfNeeded()
      await posters.nth(index).locator('img').evaluate(image => image.decode())
    }
    await page.evaluate(() => scrollTo(0, 0))
    const geometry = await page.evaluate(() => {
      const box = selector => document.querySelector(selector).getBoundingClientRect().toJSON()
      return {
        width: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth,
        opening: box('.aqua-maris-case__opening'), copy: box('.aqua-maris-case__copy'), role: box('.aqua-maris-case__role'),
        fonts: [...document.querySelectorAll('.ds-role-focus__label,.ds-role-focus__value')].map(element => { const s = getComputedStyle(element); return {text:element.textContent,family:s.fontFamily,size:s.fontSize,weight:s.fontWeight,axes:s.fontVariationSettings,spacing:s.letterSpacing,width:element.getBoundingClientRect().width} }),
        posters: [...document.querySelectorAll('.aqua-maris-case__poster')].map(element => {
          const image = element.querySelector('img')
          return { ...element.getBoundingClientRect().toJSON(), src: image.getAttribute('src'), naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight, image: image.getBoundingClientRect().toJSON() }
        }), footer: box('.aqua-maris-case__ending'), height: document.documentElement.scrollHeight,
      }
    })
    report.push(geometry)
    await fs.writeFile(`${output}/${openingOnly ? 'opening-' : ''}geometry.json`, JSON.stringify(report, null, 2))
    await page.screenshot({ path: `${output}/${openingOnly ? 'opening-' : ''}${width}.png`, fullPage: true })
    if (width === 1920) await page.locator('.aqua-maris-case__opening').screenshot({ path: `${output}/opening-detail.png` })
    assert.equal(geometry.overflow, false)
    assert.deepEqual(geometry.posters.map(p => p.src), (openingOnly ? ['02'] : ['02', '01', '03']).map(name => `/cases/aqua-maris/aqua-maris${name}.png`))
    for (const poster of geometry.posters) {
      assert.equal(poster.naturalWidth, 1220)
      assert.equal(poster.naturalHeight, 1658)
      assert.ok(Math.abs(poster.image.width / poster.image.height - 1220 / 1658) < .001)
      assert.ok(Math.abs(poster.image.width - poster.width) < 1)
    }
    if (width === 1920) {
      assert.equal(geometry.opening.x, 498)
      assert.equal(geometry.opening.y, 144)
      assert.equal(geometry.opening.width, 924)
      assert.ok(Math.abs(geometry.opening.height - 444) < 1, JSON.stringify(geometry))
      assert.ok(Math.abs(geometry.posters[0].y - 732) < 1, JSON.stringify(geometry))
      if (!openingOnly) {
        for (const [index, y] of [732, 2131.731, 3531.462].entries()) assert.ok(Math.abs(geometry.posters[index].y - y) < 1)
        assert.ok(Math.abs(geometry.footer.y - 4931.193) < 1, JSON.stringify(geometry))
        assert.ok(Math.abs(geometry.height - 5357.193) < 1)
      }
    }
    if (openingOnly) continue
    // Media is inert; only the zoom control opens the existing viewer.
    for (let index = 0; index < 3; index++) {
      const poster = posters.nth(index)
      await poster.scrollIntoViewIfNeeded()
      await poster.locator('img').click({ position: { x: 20, y: 20 } })
      assert.equal(await page.getByRole('dialog').count(), 0)
      const zoom = poster.getByRole('button')
      await zoom.click()
      const dialog = page.getByRole('dialog', { name: ['AquaMaris02', 'AquaMaris01', 'AquaMaris03'][index], exact: true })
      await dialog.waitFor()
      await page.waitForFunction(() => document.querySelector('[role=dialog]')?.getAttribute('aria-busy') === 'false')
      if (index === 0) await page.screenshot({ path: `${output}/viewer-${width}.png` })
      await page.keyboard.press('Escape')
      await dialog.waitFor({ state: 'detached' })
      assert.equal(await zoom.evaluate(element => element === document.activeElement), true)
    }
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight))
    await page.locator('.ds-page-up button').click()
    await page.waitForFunction(() => scrollY < 1)
    assert.equal(await page.locator('.aqua-maris-case__back a').getAttribute('href'), '/')
  }
  if (!openingOnly) {
    for (const width of [1920, 320]) {
      await page.setViewportSize({ width, height: 1080 })
      await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' })
      const card = page.locator('[data-case-href="/cases/aqua-maris"] .aqua-maris')
      await card.scrollIntoViewIfNeeded()
      await page.screenshot({ path: `${output}/showcase-${width}.png`, fullPage: true })
      if (width === 320) { await card.focus(); await page.keyboard.press('Enter') }
      else await card.click()
      await page.waitForURL(url => /^\/cases\/aqua-maris\/?$/.test(url.pathname))
      await page.reload({ waitUntil: 'networkidle' })
      assert.equal(await page.locator('.aqua-maris-case__poster').count(), 3)
      await page.locator('.aqua-maris-case__back a').click()
      await page.waitForURL(url => url.pathname === '/')
    }
  }
  assert.equal(errors.length, 0, errors.join('\n'))
  await fs.writeFile(`${output}/verification${openingOnly ? '-opening' : ''}.json`, JSON.stringify({ report, errors, navigation: openingOnly ? 'pending' : 'passed', viewer: openingOnly ? 'pending' : 'passed' }, null, 2))
  console.log(`Aqua Maris: ${openingOnly ? 'opening and first poster' : '1920/768/425/320 geometry, original media, all viewers, Escape/focus, page-up, mouse/keyboard navigation and refresh'} passed`)
} finally { await browser.close() }
