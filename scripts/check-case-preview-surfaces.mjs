import assert from 'node:assert/strict'
import fs from 'node:fs'
import { chromium } from 'playwright'

const evidence = 'E:/GitHub/PDPortfolio-DS/ds/evidence'
const baseline = JSON.parse(fs.readFileSync(`${evidence}/case-preview-background-baseline-2026-10-26.json`, 'utf8'))
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const results = []
let maxDelta = 0
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  for (const original of baseline) {
    const { width, route } = original
    await page.setViewportSize({ width, height: 1080 })
    await page.goto(`http://127.0.0.1:3000/cases/${route}/`, { waitUntil: 'networkidle' })
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.querySelectorAll('.ds-case-image-preview img')].map(img => img.decode())) })
    const previews = await page.locator('.ds-case-image-preview').evaluateAll(elements => elements.map(element => {
      const bounds = node => { const r = node.getBoundingClientRect(); return [r.x + scrollX, r.y + scrollY, r.width, r.height] }
      const style = getComputedStyle(element)
      return { root: bounds(element), panel: bounds(element.querySelector('.ds-case-image-preview__panel')), media: bounds(element.querySelector('.ds-case-image-preview__media')), image: bounds(element.querySelector('img')), control: bounds(element.querySelector('button')), background: style.backgroundImage, color: style.backgroundColor, radius: style.borderRadius, overflow: style.overflow, parent: bounds(element.parentElement), parentBackground: getComputedStyle(element.parentElement).backgroundImage }
    }))
    assert.equal(previews.length, original.previews.length)
    for (let i = 0; i < previews.length; i++) {
      const actual = previews[i], previous = original.previews[i]
      for (const part of ['root', 'panel', 'media', 'image', 'control']) actual[part].forEach((value, index) => {
        const delta = Math.abs(value - previous[part][index])
        maxDelta = Math.max(maxDelta, delta)
        assert(delta < 1, `${route} ${width} preview${i} ${part}[${index}]: ${delta}`)
      })
      assert.equal(actual.background, 'none')
      assert.equal(actual.color, 'rgba(0, 0, 0, 0)')
      assert.equal(actual.radius, '0px')
      assert.equal(actual.overflow, 'visible')
      assert.equal(actual.parentBackground, previous.background)
      assert.deepEqual(actual.parent, actual.root)
    }
    if ([320, 1920].includes(width)) {
      const preview = page.locator('.ds-case-image-preview').first()
      if (route === 'chirp-product') await preview.locator('..').screenshot({ path: `${evidence}/case-preview-parent-v1-${width}.png` })
      await preview.locator('img').click({ position: { x: 8, y: 8 } })
      assert.equal(await page.getByRole('dialog').count(), 0)
      const button = preview.locator('button').first()
      await button.focus()
      await button.press('Enter')
      const dialog = page.getByRole('dialog')
      await dialog.waitFor()
      await page.waitForFunction(() => document.querySelector('.ds-case-image-viewer')?.getAttribute('aria-busy') === 'false')
      await page.keyboard.press('Escape')
      await dialog.waitFor({ state: 'detached' })
      assert(await button.evaluate(element => document.activeElement === element))
    }
    results.push({ type: 'v1', route, width, count: previews.length, parentPaintMatches: true, geometryMatches: true })
  }
  for (const width of [320, 768, 1023, 1024, 1920]) {
    await page.setViewportSize({ width, height: 1080 })
    await page.goto('http://127.0.0.1:6006/iframe.html?id=components-caseimagepreview--overlay&viewMode=story', { waitUntil: 'networkidle' })
    const preview = page.locator('.ds-case-image-preview--v2')
    await preview.waitFor()
    await preview.locator('img').evaluate(img => img.decode())
    const layout = await preview.evaluate(element => {
      const root = element.getBoundingClientRect(), control = element.querySelector('.ds-img-title').getBoundingClientRect()
      const style = getComputedStyle(element)
      return { width: root.width, height: root.height, color: style.backgroundColor, background: style.backgroundImage, radius: style.borderRadius, overflow: style.overflow, padding: style.padding, control: { width: control.width, height: control.height, dx: control.x + control.width / 2 - root.x - root.width / 2, dy: control.y + control.height / 2 - root.y - root.height / 2 }, surface: getComputedStyle(element.parentElement).backgroundColor }
    })
    assert.equal(layout.background, 'none'); assert.equal(layout.color, 'rgba(0, 0, 0, 0)')
    assert.equal(layout.radius, '0px'); assert.equal(layout.overflow, 'hidden'); assert.equal(layout.padding, '0px')
    assert.equal(layout.control.width, 128); assert.equal(layout.control.height, 128)
    assert(Math.abs(layout.control.dx) < 1 && Math.abs(layout.control.dy) < 1)
    assert(Math.abs(layout.width - width) < 1)
    if ([320, 1920].includes(width)) {
      await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur())
      await page.mouse.move(0, 1070)
      await page.waitForTimeout(350)
      await preview.screenshot({ path: `${evidence}/case-preview-transparent-v2-${width}.png` })
    }
    await preview.locator('..').evaluate(element => { element.style.background = 'var(--surface-default)' })
    assert.notEqual(await preview.evaluate(element => getComputedStyle(element.parentElement).backgroundColor), layout.surface)
    assert.equal((await preview.boundingBox()).height, layout.height)
    results.push({ type: 'v2-story', viewport: width, ...layout, parentSurfaceChangedWithoutLayoutChange: true })
  }
  for (const width of [320, 1920]) {
    await page.setViewportSize({ width, height: 1080 })
    await page.goto('http://127.0.0.1:3000/cases/dc-vendor-app-ux/', { waitUntil: 'networkidle' })
    const preview = page.locator('.ds-case-image-preview--v2:visible').first()
    await preview.scrollIntoViewIfNeeded()
    await preview.locator('img').evaluate(img => img.decode())
    const title = await preview.getAttribute('aria-label')
    assert(title && title !== 'Value')
    assert.equal(await preview.evaluate(element => getComputedStyle(element).backgroundImage), 'none')
    assert.equal(await preview.evaluate(element => getComputedStyle(element).borderRadius), '0px')
    await preview.screenshot({ path: `${evidence}/case-preview-dc-ux-${width}.png` })
    await preview.locator('button').click()
    await page.getByRole('dialog', { name: title, exact: true }).waitFor()
    await page.keyboard.press('Escape')
    await page.getByRole('dialog').waitFor({ state: 'detached' })
    results.push({ type: 'v2-page', width, title, zoomWorks: true })
  }
  assert.deepEqual(errors, [])
  fs.writeFileSync(`${evidence}/case-preview-background-verification-2026-10-26.json`, JSON.stringify({ maxV1GeometryDelta: maxDelta, results }, null, 2) + '\n')
  console.log(`PASS: 15 v1 route/viewport combinations, exact parent paint, max geometry delta ${maxDelta}px; 5 v2 widths and 2 page zoom flows`)
} finally { await browser.close() }
