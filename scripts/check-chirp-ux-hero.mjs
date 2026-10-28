import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'
import { PNG } from 'pngjs'
import { heroRasterAssets } from '../app/components/chirp-ux-hero.raster-assets.ts'

const url = 'http://127.0.0.1:6006/iframe.html?id=compositions-case-heroes-chirp-ux-hero--sandbox&viewMode=story&embed=true'
const evidence = 'E:/GitHub/PDPortfolio-DS/ds/evidence'
const references = { base: [320, 564], 'min-768': [768, 869], 'min-1024': [1024, 455.466705], 'min-1280': [1280, 569.333313], 'min-1440': [1440, 640.5], 'min-1920': [1920, 854] }
const breakpoint = width => width >= 1920 ? 'min-1920' : width >= 1440 ? 'min-1440' : width >= 1280 ? 'min-1280' : width >= 1024 ? 'min-1024' : width >= 768 ? 'min-768' : 'base'
const browser = await chromium.launch({ headless: true })
const motionOnly = process.argv.includes('--motion-only')
const results = motionOnly ? JSON.parse(await readFile(evidence + '/chirp-ux-hero-verification.json', 'utf8')).responsive.filter(item => typeof item.width === 'number') : []
// Independent Figma spacing matrix: outer gap, padding L/R, CaseTitleBadge width, LogoName width.
const titleSpacing = {
  base: [8, 0, 4, 200.787003, 196.787003],
  'min-768': [12, 0, 4, 390.819031, 390.819031],
  'min-1024': [1, 4, 4, 307, 427.79361],
  'min-1280': [1, 4, 0, 355, 509.358398],
  'min-1440': [1, 8, 8, 367, 509.358398],
  'min-1920': [1, 8, 8, 444, 636.552612],
}
// Independent Figma text slots / render offsets / intrinsic SVG exports (not font metrics).
const caseTitles = {
  base: [196.78700256347656, 24, 45.7705078125, 2.05078125, 156, 27],
  'min-768': [386.81903076171875, 47, 108.0224609375, 2.92919921875, 288, 52],
  'min-1024': [299, 52, -4.552734375, 3.8408203125, 314, 57],
  'min-1280': [351, 62, -5.5166015625, 5.0908203125, 368, 67],
  'min-1440': [351, 62, -5.5166015625, 5.0908203125, 368, 67],
  'min-1920': [428, 77, -7.07470703125, 6.64599609375, 450, 84],
}
const content = JSON.parse(await readFile('content/cases/chirp-ux.json', 'utf8'))
// An isolated background export must never contain an opaque ancestor fill.
for (const [profile, assets] of Object.entries(heroRasterAssets)) {
  for (const asset of assets) {
    const png = PNG.sync.read(await readFile('public/cases/chirp-ux/hero-layers/' + profile + '/' + asset.file))
    assert.equal(png.width, asset.width)
    assert.equal(png.height, asset.height)
    let transparent = false, visible = false
    for (let i = 3; i < png.data.length; i += 4) {
      transparent ||= png.data[i] === 0
      visible ||= png.data[i] > 0
      assert.ok(png.data[i] < 255, 'no opaque parent fill: ' + profile + '/' + asset.file)
    }
    assert.ok(transparent && visible, 'original alpha retained: ' + profile + '/' + asset.file)
    if (!['base', 'min-768'].includes(profile)) {
      for (let x = 0; x < png.width; x++) assert.equal(png.data[((png.height - 1) * png.width + x) * 4 + 3], 0, 'expanded desktop export ends fully transparent')
    }
  }
}
for (const [bp, values] of Object.entries(caseTitles)) {
  const svg = await readFile('public/cases/chirp-ux/hero-layers/' + bp + '/case-title.svg', 'utf8')
  const root = svg.match(/<svg\b[^>]*>/)[0]
  assert.equal(Number(root.match(/\bwidth="([\d.]+)"/)[1]), values[4])
  assert.equal(Number(root.match(/\bheight="([\d.]+)"/)[1]), values[5])
  assert.equal(/<text\b/.test(svg), false, 'outlined CaseTitle ' + bp)
  assert.equal(/<rect\b/.test(svg), false, 'transparent content-only export ' + bp)
}
const sceneSource = await readFile('app/components/chirp-ux-hero.scene-context.ts', 'utf8')
const geometry = JSON.parse(sceneSource.match(/const geometry[^=]+=\s*([\s\S]*?)\n\/\/ Trial/)[1])
// Independent corrected Figma frames; exported edges stay outside during parallax.
const greenFrames = {
  'min-1024': [-138, 0, 1303, 455],
  'min-1280': [-153, -0.466796875, 1598, 570],
  'min-1440': [-160, 0.2001953125, 1793, 640],
  'min-1920': [-226, -0.2998046875, 2373, 854],
}
for (const [bp, frame] of Object.entries(greenFrames)) {
  assert.deepEqual(geometry[bp][1].slice(1), frame, 'corrected green frame ' + bp)
  const svg = await readFile('public/cases/chirp-ux/hero-layers/' + bp + '/green.svg', 'utf8')
  const root = svg.match(/<svg\b[^>]*>/)[0]
  assert.equal(Number(root.match(/\bwidth="([\d.]+)"/)[1]), frame[2], 'original green width ' + bp)
  assert.equal(Number(root.match(/\bheight="([\d.]+)"/)[1]), frame[3], 'original green height ' + bp)
}
await mkdir(evidence, { recursive: true })
async function ready(page) {
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.locator('.chirp-ux-hero').waitFor()
  await page.waitForFunction(() => window.__STORYBOOK_PREVIEW__?.storyRenders?.some(render => render.phase === 'completed'), undefined, { timeout: 2000 }).catch(() => page.waitForTimeout(500))
  await page.getByRole('button', { name: 'Neutral', exact: true }).click()
  await page.getByRole('button', { name: 'Сбросить всё', exact: true }).click()
  await page.evaluate(() => document.fonts.ready)
  await page.waitForFunction(() => [...document.querySelectorAll('.chirp-ux-hero img')].every(image => image.complete && image.naturalWidth > 0))
}
async function offsets(page) {
  return page.locator('.chirp-ux-hero__layer').evaluateAll(layers => layers.map(layer => Number.parseFloat(layer.style.getPropertyValue('--parallax-x')) || 0))
}
try {
  for (const width of motionOnly ? [] : [320, 370, 410, 425, 534, 720, 767, 768, 1023, 1024, 1279, 1280, 1439, 1440, 1919, 1920]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' })
    const page = await context.newPage()
    const errors = []
    const failed = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('response', response => { if (response.status() >= 400 && response.url().includes('/hero-layers/')) failed.push(response.url()) })
    await ready(page)
    const measurement = await page.locator('.chirp-ux-hero').evaluate(root => ({
      breakpoint: root.dataset.breakpoint, width: root.clientWidth, height: root.getBoundingClientRect().height,
      roleBottom: root.querySelector('.chirp-ux-hero__role').firstElementChild.getBoundingClientRect().bottom - root.getBoundingClientRect().top,
      overflow: document.documentElement.scrollWidth - innerWidth,
      animationEnabled: [...root.querySelectorAll('[data-layer]')].map(layer => layer.dataset.animationEnabled === 'true'),
      green: (() => {
        const image = root.querySelector('[data-layer="green"] img')
        const box = image.getBoundingClientRect()
        const hero = root.getBoundingClientRect()
        return { x: box.left - hero.left, y: box.top - hero.top, width: box.width, height: box.height, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight }
      })(),
      layers: [...root.querySelectorAll('[data-layer]')].map(layer => ({ name: layer.dataset.layer, x: parseFloat(layer.style.left), y: parseFloat(layer.style.top), width: layer.clientWidth, height: layer.clientHeight })),
      caseTitle: (() => {
        const slot = root.querySelector('.chirp-ux-hero__case-title')
        const image = slot.querySelector('img')
        const box = slot.getBoundingClientRect(), ink = image.getBoundingClientRect()
        const badge = root.querySelector('.ds-badge').getBoundingClientRect()
        const h1 = root.querySelector('h1')
        return { width: box.width, height: box.height, x: ink.left - box.left, y: ink.top - box.top,
          exportWidth: ink.width, exportHeight: ink.height, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight,
          badgeGap: badge.top - box.bottom, text: h1.textContent, h1Count: root.querySelectorAll('h1').length,
          clip: getComputedStyle(h1).clipPath, ariaHidden: slot.getAttribute('aria-hidden'), alt: image.alt }
      })(),
      badgeBottom: root.querySelector('.ds-badge').getBoundingClientRect().bottom - root.getBoundingClientRect().top,
      titleSpacing: (() => {
        const wordmark = root.querySelector('.chirp-ux-hero__wordmark').getBoundingClientRect()
        const copyElement = root.querySelector('.chirp-ux-hero__copy')
        const copy = copyElement.getBoundingClientRect()
        const style = getComputedStyle(copyElement)
        const badge = root.querySelector('.ds-badge').getBoundingClientRect()
        return { gap: copy.top - wordmark.bottom, paddingLeft: parseFloat(style.paddingLeft), paddingRight: parseFloat(style.paddingRight), innerGap: parseFloat(style.rowGap), copyWidth: copy.width, wordmarkWidth: wordmark.width, badgeRightInset: copy.right - badge.right }
      })(),
    }))
    const roleBounds = await page.locator('.ds-role-focus').evaluate(root => {
      const box = root.getBoundingClientRect()
      return [...root.children].every(row => { const r = row.getBoundingClientRect(); return r.left >= box.left - .1 && r.right <= box.right + .1 })
    })
    assert.equal(roleBounds, true, 'both Role-Focus rows fit container at ' + width)
    const bp = breakpoint(width)
    assert.equal(measurement.breakpoint, bp)
    assert.equal(measurement.width, width)
    assert.equal(measurement.overflow, 0, 'horizontal overflow at ' + width)
    assert.ok(Math.abs(measurement.height - (bp === 'base' ? measurement.roleBottom : references[bp][1] * width / references[bp][0])) < .1, 'content height at ' + width)
    assert.equal(measurement.layers.length, 5)
    assert.deepEqual(measurement.animationEnabled, [true, true, true, false, false], 'stationary text in every profile at ' + width)
    const [gap, left, right, copyWidth, wordmarkWidth] = titleSpacing[bp]
    const titleRatio = width / references[bp][0]
    if (greenFrames[bp]) {
      const [x, y, w, h] = greenFrames[bp]
      const raster = heroRasterAssets[bp][1]
      for (const [actual, expected] of [[measurement.green.x, x + raster.x], [measurement.green.y, y + raster.y], [measurement.green.width, raster.width], [measurement.green.height, raster.height]]) {
        assert.ok(Math.abs(actual - expected * titleRatio) < .05, 'green export geometry at ' + width)
      }
      assert.equal(measurement.green.naturalWidth, w)
      assert.equal(measurement.green.naturalHeight, raster.height)
      assert.ok(measurement.green.x < 0 && measurement.green.x + measurement.green.width > width, 'original neutral green edges at ' + width)
    }
    assert.ok(Math.abs(measurement.titleSpacing.gap - gap) < .05, 'LogoName to copy gap at ' + width)
    assert.equal(measurement.titleSpacing.paddingLeft, left)
    assert.equal(measurement.titleSpacing.paddingRight, right)
    assert.equal(measurement.titleSpacing.innerGap, 12)
    assert.ok(Math.abs(measurement.titleSpacing.copyWidth - copyWidth * titleRatio) < .05)
    assert.ok(Math.abs(measurement.titleSpacing.wordmarkWidth - wordmarkWidth * titleRatio) < .05)
    assert.ok(Math.abs(measurement.titleSpacing.badgeRightInset - right) < .05)
    measurement.layers.forEach((layer, index) => {
      const [name, sourceX, y, w, h] = geometry[bp][index]
      const x = index === 1 && bp === 'base' ? -450 : index === 1 && bp === 'min-768' ? -600 : sourceX
      const ratio = width / references[bp][0]
      assert.equal(layer.name, name)
      assert.ok(Math.abs(layer.x - x * ratio) < .05, 'layer X ' + name)
      assert.ok(Math.abs(layer.y - y * ratio) < .05, 'layer Y ' + name)
      assert.ok(Math.abs(layer.width - w * ratio) <= .5, 'layer width ' + name)
      assert.ok(Math.abs(layer.height - h * ratio) <= .5, 'layer height ' + name)
    })
    const ct = measurement.caseTitle, expectedTitle = caseTitles[bp]
    for (const [i, key] of ['width', 'height', 'x', 'y', 'exportWidth', 'exportHeight'].entries()) {
      assert.ok(Math.abs(ct[key] - expectedTitle[i] * titleRatio) < .05, 'CaseTitle ' + key + ' at ' + width)
    }
    assert.equal(ct.naturalWidth, expectedTitle[4])
    assert.equal(ct.naturalHeight, expectedTitle[5])
    assert.equal(ct.badgeGap, 12)
    assert.equal(ct.h1Count, 1)
    assert.equal(ct.text.replace(/\s+/g, ' '), content.hero.title.replace(/\s+/g, ' '))
    assert.equal(ct.clip, 'inset(50%)')
    assert.equal(ct.ariaHidden, 'true')
    assert.equal(ct.alt, '')
    assert.ok(measurement.badgeBottom <= measurement.height + 1, 'badge is not clipped at ' + width)
    assert.deepEqual(errors, [])
    assert.deepEqual(failed, [])
    await page.getByRole('button', { name: 'Повторить вступление' }).click()
    await page.waitForTimeout(700)
    assert.deepEqual(await offsets(page), [0, 0, 0, 0, 0], 'reduced motion at ' + width)
    await page.getByRole('button', { name: 'Neutral', exact: true }).click()
    if ([320, 768, 1024, 1280, 1440, 1920].includes(width)) {
      await page.locator('.chirp-ux-hero').screenshot({ path: evidence + '/chirp-ux-hero-' + width + '.png' })
    }
    results.push({ width, ...measurement, reducedMotion: 'passed', errors, failedAssets: failed })
    console.log('Responsive + reduced motion passed: ' + width)
    await context.close()
  }
  if (!motionOnly) await writeFile(evidence + '/chirp-ux-hero-verification.json', JSON.stringify({ references, responsive: results, motionEvidence: 'chirp-ux-viscous-verification.json' }, null, 2) + '\n')
  // The movement-driven contract replaces the old position-held motion assertions.
  await browser.close()
  const { spawnSync } = await import('node:child_process')
  const motion = spawnSync(process.execPath, ['scripts/check-chirp-ux-viscous-motion.mjs'], { stdio: 'inherit' })
  assert.equal(motion.status, 0, 'viscous motion regression')
  console.log('ChirpUxHero: responsive/layout evidence and new viscous motion checks passed.')
} finally { await browser.close() }
