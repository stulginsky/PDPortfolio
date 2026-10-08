import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'

const url = 'http://127.0.0.1:6006/iframe.html?id=compositions-case-heroes-chirp-pr-hero--sandbox&viewMode=story'
const evidence = 'E:/GitHub/PDPortfolio-DS/ds/evidence'
const references = { base: [320, 389], 'min-768': [768, 788], 'min-1024': [1024, 484], 'min-1280': [1280, 545], 'min-1440': [1440, 578], 'min-1920': [1920, 769] }
const breakpoint = width => width >= 1920 ? 'min-1920' : width >= 1440 ? 'min-1440' : width >= 1280 ? 'min-1280' : width >= 1024 ? 'min-1024' : width >= 768 ? 'min-768' : 'base'
const browser = await chromium.launch({ headless: true })
const results = []
await mkdir(evidence, { recursive: true })
async function ready(page) {
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.getByRole('textbox', { name: 'JSON всех профилей' }).waitFor()
  await page.waitForFunction(() => window.__STORYBOOK_PREVIEW__?.storyRenders?.some(render => render.phase === 'completed'), undefined, { timeout: 2000 }).catch(() => page.waitForTimeout(500))
  await page.getByRole('button', { name: 'Neutral', exact: true }).click()
  await page.getByRole('button', { name: 'Сбросить всё', exact: true }).click()
  await page.evaluate(() => document.fonts.ready)
  await page.waitForFunction(() => [...document.querySelectorAll('.chirp-pr-hero img')].every(image => image.complete && image.naturalWidth > 0))
}
async function offsets(page) {
  return page.locator('.chirp-pr-hero__layer').evaluateAll(layers => layers.map(layer => Number.parseFloat(layer.style.getPropertyValue('--parallax-x')) || 0))
}
try {
  for (const width of [320, 370, 410, 425, 534, 720, 767, 768, 1023, 1024, 1279, 1280, 1439, 1440, 1919, 1920]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' })
    const page = await context.newPage()
    const errors = []
    const failed = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('response', response => { if (response.status() >= 400 && response.url().includes('/hero-layers/')) failed.push(response.url()) })
    await ready(page)
    const measurement = await page.locator('.chirp-pr-hero').evaluate(root => ({
      breakpoint: root.dataset.breakpoint, width: root.clientWidth, height: root.getBoundingClientRect().height,
      overflow: document.documentElement.scrollWidth - innerWidth,
      layers: [...root.querySelectorAll('[data-layer]')].map(layer => ({ name: layer.dataset.layer, x: parseFloat(layer.style.left), y: parseFloat(layer.style.top), width: layer.clientWidth, height: layer.clientHeight })),
      font: getComputedStyle(root.querySelector('h1')).fontVariationSettings,
      headingHeight: root.querySelector('h1').getBoundingClientRect().height,
      headingLineHeight: parseFloat(getComputedStyle(root.querySelector('h1')).lineHeight),
      badgeBottom: root.querySelector('.ds-badge').getBoundingClientRect().bottom - root.getBoundingClientRect().top,
    }))
    const bp = breakpoint(width)
    assert.equal(measurement.breakpoint, bp)
    assert.equal(measurement.width, width)
    assert.equal(measurement.overflow, 0, 'horizontal overflow at ' + width)
    assert.ok(Math.abs(measurement.height - references[bp][1] * width / references[bp][0]) < .1)
    assert.equal(measurement.layers.length, 4)
    assert.ok(measurement.font.includes('"wght" 500') && measurement.font.includes('"YOPQ" 25'))
    assert.ok(Math.abs(measurement.headingHeight - measurement.headingLineHeight) < .1, 'one-line heading at ' + width)
    assert.ok(measurement.badgeBottom <= measurement.height + 1, 'badge is not clipped at ' + width)
    assert.deepEqual(errors, [])
    assert.deepEqual(failed, [])
    await page.getByRole('button', { name: 'Повторить вступление' }).click()
    await page.waitForTimeout(700)
    assert.deepEqual(await offsets(page), [0, 0, 0, 0], 'reduced motion at ' + width)
    await page.getByRole('button', { name: 'Neutral', exact: true }).click()
    if ([320, 768, 1024, 1280, 1440, 1920].includes(width)) {
      await page.locator('.chirp-pr-hero').screenshot({ path: evidence + '/chirp-pr-hero-' + width + '.png' })
    }
    results.push({ width, ...measurement, reducedMotion: 'passed', errors, failedAssets: failed })
    console.log('Responsive + reduced motion passed: ' + width)
    await context.close()
  }
  const context = await browser.newContext({ viewport: { width: 1024, height: 900 }, reducedMotion: 'no-preference' })
  const page = await context.newPage()
  await ready(page)
  await page.getByRole('button', { name: 'Interaction', exact: true }).click()
  await page.evaluate(() => window.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'mouse', clientX: innerWidth })))
  await page.waitForTimeout(800)
  const right = await offsets(page)
  const maximums = [38, -35.5, 18.5, 34.5]
  right.forEach((value, index) => assert.ok(Math.abs(value - maximums[index]) < .1, 'pointer amplitude ' + index))
  await page.getByRole('checkbox', { name: 'Анимация слоя' }).uncheck()
  await page.evaluate(() => window.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'mouse', clientX: 0 })))
  await page.waitForTimeout(800)
  assert.equal((await offsets(page))[0], 0, 'disabled background stays neutral')
  await page.getByRole('checkbox', { name: 'Анимация слоя' }).check()
  await page.getByRole('combobox', { name: 'Направление вступления' }).selectOption('-1')
  await page.getByRole('button', { name: 'Повторить вступление' }).click()
  await page.waitForTimeout(600)
  const intro = await offsets(page)
  assert.ok(intro[0] < -8 && intro[0] >= -9.51, 'left intro direction')
  assert.ok(intro[1] < 0 && intro[2] > 0 && intro[3] > 0, 'other intro directions')
  await page.waitForTimeout(700)
  assert.deepEqual(await offsets(page), [0, 0, 0, 0], 'intro returns to neutral')
  await page.getByRole('button', { name: 'Повторить вступление' }).click()
  await page.waitForTimeout(450)
  await page.evaluate(() => document.querySelector('.chirp-pr-hero').dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'touch', isPrimary: true, pointerId: 7, clientX: 100, bubbles: true })))
  await page.waitForTimeout(60)
  assert.notEqual(await page.locator('.chirp-pr-hero').getAttribute('data-motion'), 'intro', 'touch cancels intro')
  await page.evaluate(() => window.dispatchEvent(new PointerEvent('pointercancel', { pointerType: 'touch', pointerId: 7 })))
  await page.waitForTimeout(800)
  assert.deepEqual(await offsets(page), [0, 0, 0, 0], 'pointercancel resets')
  await page.getByRole('button', { name: 'Neutral', exact: true }).click()
  await page.getByRole('spinbutton', { name: 'X', exact: true }).fill('20')
  await page.getByRole('spinbutton', { name: 'Скорость ×' }).fill('2')
  await page.getByRole('button', { name: 'Повторить вступление' }).click()
  await page.waitForTimeout(850)
  assert.equal((await offsets(page))[0], 0, '2x intro finishes after 300ms pause + 450ms motion')
  await page.getByRole('button', { name: 'Neutral', exact: true }).click()
  await page.getByRole('button', { name: 'Копировать JSON' }).click()
  const exported = JSON.parse(await page.getByRole('textbox', { name: 'JSON всех профилей' }).inputValue())
  assert.equal(exported.scenes['min-1024'][0].x, 20)
  assert.equal(exported.scenes['min-1024'][0].speed, 2)
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.waitForFunction(() => document.querySelector('.chirp-pr-hero')?.dataset.breakpoint === 'min-1280')
  await page.setViewportSize({ width: 1024, height: 900 })
  await page.waitForFunction(() => document.querySelector('.chirp-pr-hero')?.dataset.breakpoint === 'min-1024')
  assert.equal(await page.getByRole('spinbutton', { name: 'X', exact: true }).inputValue(), '20')
  assert.equal(await page.getByRole('spinbutton', { name: 'Скорость ×' }).inputValue(), '2')
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('pdportfolio:chirp-pr-hero:scene:v1')))
  assert.equal(stored.scenes['min-1024'][0].x, 20)
  await page.getByRole('button', { name: 'Сбросить слой', exact: true }).click()
  assert.equal(await page.getByRole('spinbutton', { name: 'X', exact: true }).inputValue(), '-97')
  assert.equal(await page.getByRole('spinbutton', { name: 'Скорость ×' }).inputValue(), '1')
  await context.close()
  await writeFile(evidence + '/chirp-pr-hero-verification.json', JSON.stringify({ references, responsive: results, motion: { pointer: 'passed', intro: 'passed', disabledLayer: 'passed', touchCancel: 'passed', json: 'passed', persistenceAcrossBreakpoints: 'passed', reset: 'passed' } }, null, 2) + '\n')
  console.log('ChirpPrHero: 16 viewport checks, reduced motion, pointer, intro, layer disable, touch cancellation, JSON/persistence/reset passed.')
} finally { await browser.close() }
