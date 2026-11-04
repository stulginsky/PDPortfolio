import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'

const browser = await chromium.launch()
const results = []
const closeTo = (a, b, message, tolerance = .2) => assert.ok(Math.abs(a - b) < tolerance, `${message}: ${a} / ${b}`)
try {
  const page = await browser.newPage()
  page.setDefaultTimeout(15000)
  let index = 0
  for (const type of ['v1', 'v2']) for (const width of [393, 1024]) {
    for (const area of ['content', 'viewport']) for (const mode of ['fit-screen', 'fit-width', 'fit-height', '100%']) {
      const alignX = index % 2 ? 'left' : 'center', alignY = index++ % 3 ? 'center' : 'top'
      await page.setViewportSize({ width, height: 820 })
      const story = mode === '100%' ? 'natural-size' : 'fit-settings'
      const args = `type:${type};${mode === '100%' ? '' : `initialScale:${mode};`}alignX:${alignX};alignY:${alignY};fitArea:${area}`
      await page.goto(`http://127.0.0.1:6006/iframe.html?id=components-caseimageviewer--${story}&viewMode=story&embed=true&args=${encodeURIComponent(args)}`, { waitUntil: 'domcontentloaded' })
      await page.waitForFunction(() => document.querySelector('[role=dialog]')?.getAttribute('aria-busy') === 'false')
      await page.waitForTimeout(60)
      const r = await page.getByRole('dialog').evaluate(e => {
        const v = e.querySelector('.ds-case-image-viewer__viewport'), m = e.querySelector('.ds-case-image-viewer__media'), image = e.querySelector('img'), b = m.getBoundingClientRect()
        return { w: v.clientWidth, h: v.clientHeight, header: e.querySelector('header').getBoundingClientRect().height, naturalW: image.naturalWidth, naturalH: image.naturalHeight, x: b.left, y: b.top, mediaW: b.width, mediaH: b.height, left: v.scrollLeft, top: v.scrollTop, scrollW: v.scrollWidth, scrollH: v.scrollHeight }
      })
      const gutter = area === 'viewport' ? 0 : width >= 768 ? 64 : 16
      const top = area === 'viewport' ? 0 : r.header + 24
      const bottom = area === 'viewport' ? 0 : width >= 768 ? 24 : 32
      const sx = (r.w - 2 * gutter) / r.naturalW, sy = (r.h - top - bottom) / r.naturalH
      const scale = mode === '100%' ? 1 : Math.max(.01, mode === 'fit-width' ? sx : mode === 'fit-height' ? sy : Math.min(sx, sy))
      closeTo(r.mediaW, r.naturalW * scale, 'scale width')
      closeTo(r.mediaH, r.naturalH * scale, 'scale height')
      closeTo(r.x + r.left, gutter + (alignX === 'center' ? Math.max(0, (r.w - 2 * gutter - r.mediaW) / 2) : 0), 'X alignment')
      closeTo(r.y + r.top, top + (alignY === 'center' ? Math.max(0, (r.h - top - bottom - r.mediaH) / 2) : 0), 'Y alignment')
      closeTo(r.left, alignX === 'center' ? Math.max(0, (r.scrollW - r.w) / 2) : 0, 'initial X scroll', .6)
      closeTo(r.top, alignY === 'center' ? Math.max(0, (r.scrollH - r.h) / 2) : 0, 'initial Y scroll', .6)
      // Both opposite corners remain reachable even when initial view is centered.
      const edges = await page.locator('.ds-case-image-viewer__viewport').evaluate(v => {
        const m = v.querySelector('.ds-case-image-viewer__media')
        v.scrollTo(0, 0); const first = m.getBoundingClientRect()
        v.scrollTo(v.scrollWidth, v.scrollHeight); const last = m.getBoundingClientRect()
        return { firstX: first.left, firstY: first.top, lastRight: last.right, lastBottom: last.bottom }
      })
      assert.ok(edges.firstX >= -.2 && edges.firstY >= -.2)
      assert.ok(edges.lastRight <= width + .6 && edges.lastBottom <= 820 + .6, JSON.stringify({ type, width, area, mode, alignX, alignY, edges }))
      results.push({ type, width, area, mode, alignX, alignY, ...r })
    }
  }
  await page.setViewportSize({ width: 1024, height: 820 })
  await page.goto('http://127.0.0.1:6006/iframe.html?id=components-caseimageviewer--responsive-settings&viewMode=story&embed=true', { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => document.querySelector('[role=dialog]')?.getAttribute('aria-busy') === 'false')
  for (const width of [767, 768, 393, 1280]) {
    await page.setViewportSize({ width, height: 820 })
    await page.waitForFunction(web => {
      const d = document.querySelector('[role=dialog]'), m = d?.querySelector('.ds-case-image-viewer__media'), image = d?.querySelector('img')
      if (!m || !image || d.classList.contains('ds-case-image-viewer--web') !== web) return false
      const expected = web ? Math.min(innerWidth / image.naturalWidth, innerHeight / image.naturalHeight) : 1
      return Math.abs(m.getBoundingClientRect().width / image.naturalWidth - expected) < .0001
    }, width >= 768)
  }
  await page.getByRole('button', { name: 'Закрыть просмотрщик', exact: true }).click()
  await page.getByRole('button', { name: 'Открыть просмотрщик', exact: true }).click()
  await page.waitForFunction(() => document.querySelector('[role=dialog]')?.getAttribute('aria-busy') === 'false')
  await page.screenshot({ path: 'exports/viewer-responsive-settings.png' })
  await writeFile('exports/viewer-settings-verification.json', JSON.stringify(results, null, 2))
  console.log(`PASS ${results.length} scale/area/type configurations; independent X/Y; reachable edges; responsive boundary; reopen`)
} finally { await browser.close() }
