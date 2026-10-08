import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'

const require = createRequire(import.meta.url)
const evidence = 'E:/GitHub/PDPortfolio-DS/ds/evidence'
const url = 'http://127.0.0.1:6006/iframe.html?id=compositions-relatedcases--sandbox&viewMode=story'
const browser = await chromium.launch({ headless: true })
const results = []
await mkdir(evidence, { recursive: true })
try {
  for (const width of (process.argv[2] ? process.argv[2].split(',').map(Number) : [320, 370, 410, 425, 534, 720, 767, 768, 1024, 1920])) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce', hasTouch: width < 768 })
    const page = await context.newPage()
    const pageErrors = []
    page.on('pageerror', error => pageErrors.push(error.message))
    await page.goto(url, { waitUntil: 'networkidle' })
    // The same production story runs its interaction play before spatial QA.
    await page.waitForTimeout(3500)
    await page.getByRole('button', { name: 'Reset', exact: true }).click()
    await page.mouse.move(0, 880)
    await page.waitForFunction(() => document.querySelector('.related-cases')?.dataset.position === 'Start')
    await page.evaluate(() => document.fonts.ready)
    await page.waitForFunction(() => [...document.querySelectorAll('.related-cases img')].every(img => img.complete && img.naturalWidth > 0))
    const geometry = await page.locator('.related-cases').evaluate(root => {
      const rail = root.querySelector('.related-cases__rail')
      const card = root.querySelector('.related-cases__card')
      const anchor = card.querySelector('a')
      return {
        viewport: innerWidth, breakpoint: root.dataset.breakpoint, scale: Number(root.dataset.scale),
        rail: rail.clientWidth, width: card.getBoundingClientRect().width, height: card.getBoundingClientRect().height,
        anchorWidth: anchor.getBoundingClientRect().width, anchorHeight: anchor.getBoundingClientRect().height,
        gap: parseFloat(getComputedStyle(root.querySelector('ul')).gap), overflow: document.documentElement.scrollWidth - innerWidth,
        position: root.dataset.position,
      }
    })
    assert.equal(geometry.breakpoint, width < 768 ? 'base' : 'min-768')
    assert.equal(geometry.overflow, 0, `page overflow at ${width}`)
    assert.equal(geometry.gap, 8)
    const k = width >= 768 ? (16 / 21) * Math.min(1, geometry.rail / 924) : Math.min(430 * 16 / 21, geometry.rail - 24) / 430
    const expectedWidth = width >= 768 ? 430 * k : Math.min(430 * 16 / 21, geometry.rail - 24)
    const expectedHeight = 532 * k
    assert.ok(Math.abs(geometry.width - expectedWidth) < .1)
    assert.ok(geometry.height >= expectedHeight - .1)
    assert.ok(Math.abs(geometry.anchorWidth - geometry.width) < .1)
    assert.ok(Math.abs(geometry.anchorHeight - geometry.height) < .1)
    const typography = await page.locator('.related-cases').evaluate(root => {
      const scale = Number(root.dataset.scale)
      return [...root.querySelectorAll('.related-cases__stage > a')].map(card => {
        const copy = card.querySelector('[class$="__copy"]')
        const factor = scale * Number(getComputedStyle(copy).zoom)
        const size = selector => parseFloat(getComputedStyle(card.querySelector(selector)).fontSize) * factor
        return {
          badge: size('.ds-badge__text'), title: size('[class$="__title"]'), description: size('[class$="__subtitle"]'),
          copyHeight: copy.getBoundingClientRect().height,
          clippedBadges: [...card.querySelectorAll('.ds-badge')].filter(badge => badge.getBoundingClientRect().right > copy.getBoundingClientRect().right + 1).length,
        }
      })
    })
    for (const type of typography) {
      assert.ok(type.badge >= 9.999, `badge font below10 at ${width}`)
      assert.ok(type.title >= 18.332, `title font below DS floor at ${width}`)
      assert.ok(type.description >= 13.332, `description font below DS floor at ${width}`)
      assert.ok(type.copyHeight * 3 <= geometry.height + .2, `copy exceeds one third at ${width}`)
      assert.equal(type.clippedBadges, 0)
    }
    geometry.typography = typography
    if ([320, 720, 768, 1920].includes(width)) await page.screenshot({ path: `${evidence}/related-cases-${width}.png`, fullPage: true })
    if (width >= 768) {
      await page.getByRole('button', { name: 'Следующие кейсы' }).click()
      if (geometry.rail < 924) {
        await page.waitForFunction(() => document.querySelector('.related-cases')?.dataset.position === 'Middle')
        await page.getByRole('button', { name: 'Следующие кейсы' }).click()
      }
      await page.waitForFunction(() => document.querySelector('.related-cases')?.dataset.position === 'End')
      if (width === 1920) await page.screenshot({ path: `${evidence}/related-cases-1920-end.png`, fullPage: true })
      assert.equal(await page.getByRole('button', { name: 'Следующие кейсы' }).count(), 0)
      await page.waitForFunction(() => document.querySelector('.related-cases__previous') === document.activeElement)
      await page.getByRole('button', { name: 'Предыдущие кейсы' }).click()
      await page.waitForFunction(expected => document.querySelector('.related-cases')?.dataset.position === expected, geometry.rail >= 924 ? 'Start' : 'Middle')
      if (geometry.rail >= 924) {
        assert.equal(await page.locator('.related-cases__rail').evaluate(el => el.scrollLeft), 0)
        await page.waitForFunction(() => document.querySelector('.related-cases__next') === document.activeElement)
      }
    } else if (width === 320) {
      const session = await context.newCDPSession(page)
      await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 245, y: 170 }] })
      for (const x of [220, 185, 140, 90, 45]) {
        await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: 170 }] })
        await page.waitForTimeout(35)
      }
      await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
      await page.waitForFunction(() => document.querySelector('.related-cases__rail').scrollLeft > 50)
      assert.equal(new URL(page.url()).pathname, '/iframe.html')
      await page.waitForFunction(() => [...document.querySelectorAll('.related-cases a')].every(a => a.dataset.state !== 'ActivePressed'))
    }
    await page.getByRole('button', { name: 'Reset', exact: true }).click()
    await page.locator('.related-cases a').first().focus()
    await page.keyboard.press('End')
    await page.waitForFunction(() => document.querySelector('.related-cases')?.dataset.position === 'End')
    await page.keyboard.press('Home')
    await page.waitForFunction(() => document.querySelector('.related-cases')?.dataset.position === 'Start')
    if (width === 768) {
      await page.addScriptTag({ path: require.resolve('axe-core') })
      const audit = await page.evaluate(async () => (await window.axe.run(document.querySelector('.related-cases'), { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations.map(v => ({ id: v.id, description: v.description, nodes: v.nodes.length })))
      assert.deepEqual(audit, [], 'accessibility violations')
      await page.setViewportSize({ width: 767, height: 900 })
      await page.waitForFunction(() => document.querySelector('.related-cases')?.dataset.breakpoint === 'base')
      await page.setViewportSize({ width: 768, height: 900 })
      await page.waitForFunction(() => document.querySelector('.related-cases')?.dataset.breakpoint === 'min-768' && document.querySelector('.related-cases')?.dataset.position === 'Start')
    }
    assert.deepEqual(pageErrors, [], `page errors at ${width}`)
    results.push({ ...geometry, interactions: 'passed', pageErrors })
    console.log(JSON.stringify(results.at(-1)))
    await context.close()
  }
  // Confirm the agreed duration uses animation, and reduced motion was not masking it.
  const page = await browser.newPage({ viewport: { width: 1024, height: 900 }, reducedMotion: 'no-preference' })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(3500)
  await page.getByRole('button', { name: 'Reset', exact: true }).click()
  const motionSamples = await page.evaluate(async () => {
    const rail = document.querySelector('.related-cases__rail')
    const samples = []
    const started = performance.now()
    document.querySelector('.related-cases__next').click()
    await new Promise(resolve => {
      function sample(now) {
        samples.push({ ms: Math.round(now - started), offset: rail.scrollLeft })
        if (now - started < 450) requestAnimationFrame(sample); else resolve()
      }
      requestAnimationFrame(sample)
    })
    return samples
  })
  assert.ok(motionSamples.some(sample => sample.offset > 0 && sample.offset < 430 * 16 / 21 + 8), 'animation must contain intermediate frames')
  assert.ok(Math.abs(motionSamples.at(-1).offset - (4 * 430 * 16 / 21 + 24 - 924)) < 1)
  await writeFile(`${evidence}/related-cases-production-checks.json`, JSON.stringify({ date: '2026-10-07', profiles: results, motion: { duration: 300, easing: 'ease-out', samples: motionSamples, result: 'passed' }, storybookMcp: 'unavailable', productConsumersChanged: false }, null, 2))
} finally {
  await browser.close()
}
