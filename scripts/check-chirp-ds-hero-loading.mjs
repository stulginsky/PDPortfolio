import assert from 'node:assert/strict'
import { writeFileSync } from 'node:fs'
import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const evidence = 'E:/GitHub/PDPortfolio-DS/ds/evidence/'
const results = []
const url = 'http://127.0.0.1:3000/cases/chirp-design-system'
async function geometry(page) {
  return page.locator('.chirp-ds-hero').evaluate(root => {
    const rect = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height } }
    return { ready: root.dataset.ready, root: rect(root), layers: [...root.querySelectorAll('.chirp-ds-hero__title,.chirp-ds-hero__bird,.chirp-ds-hero__copy')].map(rect),
      title: rect(root.querySelector('.chirp-ds-hero__clip')), role: rect(root.querySelector('.chirp-ds-hero__panel')),
      assets: [...root.querySelectorAll('img')].map(img => new URL(img.currentSrc).pathname),
      visibleRoles: [...root.querySelectorAll('.ds-role-focus')].filter(el => el.getBoundingClientRect().height > 0).length,
      overflow: document.documentElement.scrollWidth > innerWidth }
  })
}
try {
  for (const width of [320, 534, 767, 768, 1024, 1280, 1440, 1920]) {
    const page = await browser.newPage({ viewport: { width, height: 1080 }, reducedMotion: 'reduce' })
    let release
    const blocked = new Promise(resolve => { release = resolve })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (/hydration.*mismatch/i.test(message.text())) errors.push(message.text()) })
    await page.route('**/*', async route => {
      if (route.request().resourceType() === 'script') await blocked
      await route.continue().catch(() => {})
    })
    await page.goto(url, { waitUntil: 'commit' })
    await page.locator('.chirp-ds-hero').waitFor()
    await page.evaluate(() => document.fonts.ready)
    await page.waitForFunction(() => [...document.querySelectorAll('.chirp-ds-hero img')].every(img => img.complete && img.naturalWidth > 0))
    const before = await geometry(page)
    assert.equal(before.ready, 'false')
    assert.equal(before.visibleRoles, 1)
    assert.equal(before.overflow, false)
    if ([320, 768, 1920].includes(width)) await page.screenshot({ path: evidence + `chirp-ds-first-paint-${width}.png` })
    release()
    await page.waitForFunction(() => document.querySelector('.chirp-ds-hero').dataset.ready === 'true')
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => document.fonts.ready)
    const after = await geometry(page)
    assert.equal(after.visibleRoles, 1)
    assert.equal(after.overflow, false)
    assert.deepEqual(before.assets, after.assets, `responsive sources at ${width}`)
    // Interactive decorative layers may have intrinsic fractional pixel rounding;
    // the source reference geometry must remain the same across hydration.
    for (const key of ['root', 'title', 'role']) for (const axis of ['x', 'y', 'width', 'height']) {
      assert.ok(Math.abs(before[key][axis] - after[key][axis]) < .2, `${width}: ${key}.${axis}: ${before[key][axis]} -> ${after[key][axis]}`)
    }
    before.layers.forEach((layer, i) => {
      for (const axis of ['x', 'y', 'width']) assert.ok(Math.abs(layer[axis] - after.layers[i][axis]) < .2, `${width} layer ${i}.${axis}`)
    })
    assert.deepEqual(errors, [])
    results.push({ width, before, after })
    console.log(`Initial paint / hydration: ${width} passed`)
    await page.close()
  }
  writeFileSync(evidence + 'chirp-ds-loading-verification.json', JSON.stringify(results, null, 2))
} finally { await browser.close() }
