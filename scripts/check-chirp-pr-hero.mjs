import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'

const url = 'http://127.0.0.1:6006/iframe.html?id=compositions-case-heroes-chirp-pr-hero--sandbox&viewMode=story'
const evidence = 'E:/GitHub/PDPortfolio-DS/ds/evidence'
const references = { base: [320, 643], 'min-768': [768, 1000], 'min-1024': [1024, 656], 'min-1280': [1280, 781], 'min-1440': [1440, 814], 'min-1920': [1920, 1005] }
const breakpoint = width => width >= 1920 ? 'min-1920' : width >= 1440 ? 'min-1440' : width >= 1280 ? 'min-1280' : width >= 1024 ? 'min-1024' : width >= 768 ? 'min-768' : 'base'
const browser = await chromium.launch({ headless: true })
const results = []
const titleGeometry = {
  base: [223, 34, -4.2275390625, 1.705078125, 234, 33],
  'min-768': [419, 69, -8.364013671875, 5.188720703125, 440, 64],
  'min-1024': [338, 54, -7.06591796875, 3.92578125, 355, 51],
  'min-1280': [419, 69, -8.364013671875, 5.18896484375, 440, 64],
  'min-1440': [419, 69, -8.364013671875, 5.18896484375, 440, 64],
  'min-1920': [533, 90, -11.81982421875, 7.853515625, 562, 83],
}
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
      caseTitle: (() => {
        const slot = root.querySelector('.chirp-pr-hero__case-title')
        const image = slot.querySelector('img')
        const box = slot.getBoundingClientRect(), ink = image.getBoundingClientRect()
        const badge = root.querySelector('.ds-badge').getBoundingClientRect()
        const copy = slot.parentElement, wordmark = root.querySelector('.chirp-pr-hero__wordmark').getBoundingClientRect()
        return { width: box.width, height: box.height, x: ink.left - box.left, y: ink.top - box.top,
          exportWidth: ink.width, exportHeight: ink.height, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight,
          gap: badge.top - box.bottom, paddingRight: parseFloat(getComputedStyle(copy).paddingRight), rightInset: wordmark.right - box.right,
          copyWidth: copy.getBoundingClientRect().width, badgeInset: badge.left - box.left, semanticCount: root.querySelectorAll('h1').length,
          clip: getComputedStyle(root.querySelector('h1')).clipPath, ariaHidden: slot.getAttribute('aria-hidden'), alt: image.alt }
      })(),
      badgeBottom: root.querySelector('.ds-badge').getBoundingClientRect().bottom - root.getBoundingClientRect().top,
    }))
    const bp = breakpoint(width)
    assert.equal(measurement.breakpoint, bp)
    assert.equal(measurement.width, width)
    assert.equal(measurement.overflow, 0, 'horizontal overflow at ' + width)
    const role = await page.locator('.chirp-pr-hero__role').evaluate(wrapper => {
      const content = wrapper.firstElementChild, root = wrapper.closest('.chirp-pr-hero'), box = content.getBoundingClientRect(), bounds = root.getBoundingClientRect(), css = getComputedStyle(wrapper)
      return { width: box.width, x: box.left - bounds.left, top: box.top - bounds.top, bottom: box.bottom - bounds.top, padding: parseFloat(css.paddingBottom), text: content.textContent.replace(/\s+/g, ' '), base: content.classList.contains('ds-role-focus--base'), items: [...content.querySelectorAll('.ds-role-focus__item')].map(item=>({ text:item.textContent, height:item.getBoundingClientRect().height })) }
    })
    const pad = bp === 'base' ? 24 : bp === 'min-768' ? 48 : bp === 'min-1024' ? 32 : 64
    assert.equal(role.padding, pad)
    assert.ok(Math.abs(measurement.height - role.bottom - pad) < .1, 'hero hugs padded RoleFocus at ' + width)
    assert.ok(Math.abs(role.top - measurement.badgeBottom - pad - (bp === 'base' ? 26 : 0)) < .1, 'RoleFocus follows visual stage at ' + width)
    assert.ok(Math.abs(role.width - (width < 1024 ? width - 32 : 924)) < .1)
    assert.ok(Math.abs(role.x - (width - role.width) / 2) < .1)
    assert.equal(role.base, width < 768)
    assert.ok(role.text.includes('Product Designer') && role.text.includes('UX Researcher') && !role.text.includes('Design Tokens'))
    assert.equal(role.items.length, 7)
    assert.equal(measurement.layers.length, 4)
    assert.ok(measurement.font.includes('"wght" 500') && measurement.font.includes('"YOPQ" 25'))
    const ct = measurement.caseTitle, expected = titleGeometry[bp], ratio = width / references[bp][0]
    if (bp === 'base' || bp === 'min-768') {
      const background = measurement.layers[0]
      const source = bp === 'base' ? [-80, 419.617431640625, 293.77191162109375] : [-144.5, 1057, 740]
      assert.ok(Math.abs(background.x - source[0] * ratio) < .05, 'original background X at ' + width)
      assert.ok(Math.abs(background.width - source[1] * ratio) < 1, 'original background width at ' + width)
      assert.ok(Math.abs(background.height - source[2] * ratio) < 1, 'original background height at ' + width)
      assert.ok(background.x <= 0 && background.x + background.width >= width, 'background covers neutral frame at ' + width)
      // User requested base X−80 without resizing/motion changes; extreme left motion has a known right-edge gap at320.
      if (bp !== 'base') assert.ok(background.x + 38 <= 0 && background.x + background.width - 38 >= width, 'background covers pointer extremes at ' + width)
    }
    for (const [index, key] of ['width', 'height', 'x', 'y', 'exportWidth', 'exportHeight'].entries()) {
      assert.ok(Math.abs(ct[key] - expected[index] * ratio) < .05, 'CaseTitle ' + key + ' at ' + width)
    }
    assert.equal(ct.naturalWidth, expected[4])
    assert.equal(ct.naturalHeight, expected[5])
    assert.equal(ct.gap, 12)
    const padding = bp === 'base' || bp === 'min-1024' ? 4 : 8
    assert.equal(ct.paddingRight, padding, 'DS right padding at ' + width)
    assert.ok(Math.abs(ct.rightInset - padding) < .05, 'right inset from wordmark at ' + width)
    assert.ok(Math.abs(ct.copyWidth - expected[0] * ratio - padding) < .05, 'padded copy width at ' + width)
    assert.ok(Math.abs(ct.badgeInset) < .05, 'Badge follows title inset at ' + width)
    assert.equal(ct.semanticCount, 1)
    assert.equal(ct.clip, 'inset(50%)')
    assert.equal(ct.ariaHidden, 'true')
    assert.equal(ct.alt, '')
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
 await browser.close()
 const {spawnSync}=await import('node:child_process')
 const result=spawnSync(process.execPath,['scripts/check-hero-motion.mjs','--hero','pr'],{stdio:'inherit'})
 assert.equal(result.status,0,'shared motion regression pr')
 console.log('PASS pr: original layout/assets and shared hero motion')
} finally { await browser.close() }
