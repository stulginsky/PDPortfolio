import assert from 'node:assert/strict'
import { readFileSync, statSync, writeFileSync } from 'node:fs'
import { chromium } from 'playwright'

const content = JSON.parse(readFileSync(new URL('../content/cases/chirp-ux.json', import.meta.url), 'utf8')).page
const base = process.env.CHIRP_UX_URL || 'http://127.0.0.1:3000/cases/chirp-ux'
const evidence = 'E:/GitHub/PDPortfolio-DS/ds/evidence/'
const normalize = text => text.replace(/\s+/g, ' ').trim()
const widths = [320, 370, 410, 534, 767, 768, 769, 1024, 1279, 1280, 1440, 1920]
const results = []
const intrinsic = content.media.map(media => {
  const root = readFileSync(new URL('../public' + media.src, import.meta.url), 'utf8').split('>')[0]
  return { width: Number(root.match(/ width="([\d.]+)"/)[1]), height: Number(root.match(/ height="([\d.]+)"/)[1]) }
})
for (const media of content.media) assert.ok(statSync(new URL('../public' + media.src, import.meta.url)).size > 0)
const browser = await chromium.launch({ headless: true })
try {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 1080 }, reducedMotion: 'reduce' })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (/hydration.*mismatch/i.test(message.text())) errors.push(message.text()) })
    const response = await page.goto(base, { waitUntil: 'networkidle' })
    assert.equal(response.status(), 200)
    await page.evaluate(() => document.fonts.ready)
    await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0))
    const data = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      hero: document.querySelector('.ux-case__hero').getBoundingClientRect().height,
      nodes: [...document.querySelectorAll('[data-figma-text]')].map(el => ({ id: el.dataset.figmaText, text: el.innerText })),
      column: document.querySelector('.ux-case__frame').getBoundingClientRect().toJSON(),
      previews: [...document.querySelectorAll('.ds-case-image-preview')].map(el => {
        const image = el.querySelector('img'), panel = el.querySelector('.ds-case-image-preview__panel')
        return { src: new URL(image.src).pathname, image: image.getBoundingClientRect().toJSON(), panel: panel.getBoundingClientRect().toJSON(), outer: el.getBoundingClientRect().toJSON(), natural: { width: image.naturalWidth, height: image.naturalHeight } }
      }),
    }))
    assert.equal(data.overflow, false, `overflow at ${width}`)
    const related = await page.locator('.related-cases').evaluate(root => ({
      padding: getComputedStyle(root.querySelector('.related-cases__track')).paddingInlineStart,
      cardX: root.querySelector('.related-cases__card').getBoundingClientRect().x,
      railX: root.querySelector('.related-cases__rail').getBoundingClientRect().x,
    }))
    assert.equal(related.padding, '0px', 'text list indentation must not affect the carousel')
    assert.ok(Math.abs(related.cardX - related.railX) < .1)
    if (width >= 1024 || width < 768) assert.ok(Math.abs(related.cardX - data.column.x) < .1)
    assert.equal(data.nodes.length, Object.keys(content.nodes).length)
    for (const node of data.nodes) assert.equal(normalize(node.text), normalize(content.nodes[node.id].text), `copy ${node.id} at ${width}`)
    assert.ok(Math.abs(data.column.width - Math.min(924, width - 32)) < .1)
    assert.equal(data.previews.length, 4)
    data.previews.forEach((preview, i) => {
      assert.equal(preview.src, content.media[i].src)
      assert.ok(preview.image.width <= 924.1 && preview.image.width <= preview.natural.width + .1)
      assert.ok(preview.image.x >= 0 && preview.image.right <= width + .1)
      assert.ok(preview.image.y >= preview.panel.bottom + 23.9, `title overlap at ${width}/${i}`)
      assert.ok(preview.image.bottom <= preview.outer.bottom - 31.9)
      assert.ok(Math.abs(preview.image.height - preview.image.width * intrinsic[i].height / intrinsic[i].width) < .15, `ratio at ${width}/${i}`)
    })
    if ([320, 768, 1920].includes(width)) {
      await page.screenshot({ path: evidence + `chirp-ux-page-${width}.png`, fullPage: true })
      for (let i = 0; i < 4; i++) {
        const button = page.locator('.ds-case-image-preview').nth(i).getByRole('button')
        await button.click()
        const dialog = page.getByRole('dialog')
        await dialog.waitFor()
        await page.waitForFunction(() => document.body.style.overflow === 'hidden')
        await dialog.locator('img[src^="/cases/"], svg[role="img"]').waitFor()
        assert.equal(new URL(await dialog.locator('img[src^="/cases/"], svg[role="img"] image').getAttribute(i === 3 ? 'href' : 'src'), base).pathname, content.media[i].src)
        if (i === 1) await page.screenshot({ path: evidence + `chirp-ux-viewer-${width}.png` })
        await page.keyboard.press('Escape')
        await dialog.waitFor({ state: 'hidden' })
        assert.ok(await button.evaluate(el => el === document.activeElement), 'focus returns to zoom')
        assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden')
      }
      const rail = page.locator('.related-cases__rail')
      await rail.scrollIntoViewIfNeeded()
      await rail.locator('a').last().focus()
      await page.waitForFunction(() => document.querySelector('.related-cases__rail').scrollLeft > 0)
      await page.screenshot({ path: evidence + `chirp-ux-footer-${width}.png` })
      await page.locator('.ds-page-up button').click()
      await page.waitForFunction(() => scrollY < 1)
      assert.ok(await page.locator('.ux-case__hero').evaluate(el => el === document.activeElement))
    }
    assert.deepEqual(errors, [])
    results.push({ width, hero: data.hero, column: data.column, previews: data.previews })
    console.log(`Viewport ${width}: passed`)
    await page.close()
  }
  const page = await browser.newPage()
  await page.goto(base, { waitUntil: 'networkidle' })
  await page.locator('.ux-case__back a').click()
  await page.waitForURL(url => url.pathname === '/')
  await page.locator('.main-page__case a[href="/cases/chirp-ux"]').click()
  await page.waitForURL(url => url.pathname.replace(/\/$/, '') === '/cases/chirp-ux')
  await page.close()
  writeFileSync(evidence + 'chirp-ux-page-verification.json', JSON.stringify({ results, checks: ['all source text nodes', '4 original SVG compositions', 'proportional media/Hug/no overlap', 'all 4 viewers/3 references', 'focus/Escape/scroll lock', 'related rail', 'PageUp', 'back/home case route'] }, null, 2))
  console.log(`Chirp UX: ${widths.length} viewports, copy/assets/geometry, viewers, focus, navigation passed`)
} finally { await browser.close() }
