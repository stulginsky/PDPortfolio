import assert from 'node:assert/strict'
import { mkdir, writeFile, stat } from 'node:fs/promises'
import { chromium } from 'playwright'

const url = process.env.MAIN_URL || 'http://127.0.0.1:3000/'
const evidence = 'E:/GitHub/PDPortfolio-DS/ds/evidence'
await mkdir(evidence, { recursive: true })
const browser = await chromium.launch({ headless: true })
const results = []
try {
  for (const width of [320, 370, 394, 410, 425, 534, 570, 720, 767, 768, 1024, 1280, 1440, 1920]) {
    const context = await browser.newContext({ viewport: { width, height: width === 1920 ? 1068 : 900 }, reducedMotion: 'reduce', hasTouch: width < 768 })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', e => errors.push(e.message))
    const response = await page.goto(url, { waitUntil: 'networkidle' })
    assert.equal(response.status(), 200)
    await page.evaluate(() => document.fonts.ready)
    await page.waitForFunction(() => [...document.querySelectorAll('.main-page img')].every(img => img.complete && img.naturalWidth > 0))
    const measure = await page.locator('.main-page').evaluate(root => {
      const rect = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height } }
      return {
        width: innerWidth, overflow: document.documentElement.scrollWidth - innerWidth,
        page: rect(root), header: rect(root.querySelector('.main-page__header')),
        filters: rect(root.querySelector('.ds-filters')), footer: rect(root.querySelector('.ds-footer')),
        cards: [...root.querySelectorAll('.main-page__case')].map(rect),
        links: [...root.querySelectorAll('.main-page__case > a')].map(a => a.getAttribute('href')),
        images: [...root.querySelectorAll('img')].map(img => ({ src: img.getAttribute('src'), width: img.getBoundingClientRect().width, height: img.getBoundingClientRect().height })),
      }
    })
    assert.equal(measure.overflow, 0, `horizontal overflow at ${width}`)
    assert.equal(measure.cards.length, 5)
    assert.equal(await page.locator('h1').count(), 1)
    assert.deepEqual(measure.links, ['/cases/chirp-product', '/cases/chirp-ux', '/cases/chirp-brand', '/cases/chirp-design-system', '#'])
    for (const card of measure.cards) {
      assert.equal(card.width, Math.min(430, width - 32))
      assert.equal(card.height, width >= 462 ? 532 : 500)
    }
    for (const image of measure.images) {
      assert.ok(image.width > 0 && image.height > 0)
      assert.ok(!image.src.includes('figma.com/api/mcp'))
      if (image.src.startsWith('/cases/')) assert.ok((await stat(`public${decodeURIComponent(image.src)}`)).size > 0)
    }
    assert.equal(await page.locator('.main-page__compact').count(), 0)
    assert.equal(await page.locator('.ds-page-up').count(), 0)
    if (width === 1920) {
      assert.deepEqual(measure.cards.map(card => card.x), [64, 518, 972, 1426, 745])
      assert.ok(Math.abs(measure.cards[0].y - 546) < 1)
      assert.ok(Math.abs(measure.footer.y - 1860) < 1)
    }
    if ([320, 768, 1024, 1440, 1920].includes(width)) {
      await page.screenshot({ path: `${evidence}/main-${width}.png`, fullPage: true })
    }
    const delivery=page.locator('.main-page__case .dc-vendor-app-pr')
    assert.equal(await delivery.count(),1)
    const logo=await delivery.locator('.dc-vendor-app-pr__pict [data-layer="09-ostrich"] img').evaluate(i=>({width:i.naturalWidth,height:i.naturalHeight}))
    assert.deepEqual(logo,{width:200,height:234},'Main must load the corrected logo, not the stale inlined SVG')
    await delivery.scrollIntoViewIfNeeded()
    const locationBefore=page.url(),scrollBefore=await page.evaluate(()=>scrollY)
    await delivery.click()
    assert.equal(page.url(),locationBefore,'Delivery card has no destination yet')
    assert.equal(await page.evaluate(()=>scrollY),scrollBefore,'Placeholder must not jump to page top')
    await delivery.focus()
    await page.keyboard.press('Enter')
    assert.equal(page.url(),locationBefore,'Keyboard must not navigate either')

    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), measure.header.height + 1)
    await page.waitForFunction(() => document.querySelector('.main-page')?.dataset.compact === 'true')
    assert.equal(await page.locator('.main-page__filters').isVisible(), false)
    const stickyRect = await page.locator('.ds-top-nav-scroll-vitrina').boundingBox()
    assert.equal(stickyRect.y, 0)
    assert.equal(stickyRect.width, Math.min(394, width))
    const up = await page.locator('.ds-page-up').boundingBox()
    assert.equal(up.x, width - 98)
    assert.equal(up.y, (width === 1920 ? 1068 : 900) - 98)
    // Avatar and PageUp must share both the visibility source and return behavior.
    await page.locator('.ds-avatar-sm').click()
    await page.waitForFunction(() => scrollY === 0 && document.querySelector('.main-page')?.dataset.compact === 'false')
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), measure.header.height + 1)
    await page.waitForFunction(() => document.querySelector('.main-page')?.dataset.compact === 'true')
    await page.locator('.ds-page-up button').focus()
    await page.keyboard.press('Enter')
    await page.waitForFunction(() => scrollY === 0 && document.querySelector('.main-page')?.dataset.compact === 'false')
    assert.equal(await page.locator('.main-page__header').evaluate(el => el === document.activeElement), true)

    async function select(label) {
      if (width < 1024) {
        await page.getByRole('button', { name: 'Выбрать категорию' }).click()
        await page.getByRole('dialog').getByRole('button', { name: label, exact: true }).click()
        await page.getByRole('dialog').waitFor({ state: 'hidden' })
      } else {
        await page.getByRole('button', { name: label, exact: true }).click()
      }
    }
    for (const [label, category] of [['Продукт', 'product'], ['UX', 'ux'], ['Дизайн система', 'design-system'], ['Брендинг', 'branding']]) {
      await select(label)
      assert.equal(await page.locator('.main-page__case').count(), category==='product'?2:1)
      assert.equal(await page.locator('.main-page__cases').getAttribute('data-category'), category)
    }
    await select('Креатив')
    assert.equal(await page.locator('.main-page__case').count(), 0)
    await select('Все кейсы')
    assert.equal(await page.locator('.main-page__case').count(), 5)
    await page.mouse.move(0, 0)
    if (width === 1920) {
      await page.evaluate(() => window.scrollTo({ top: 484, behavior: 'instant' }))
      await page.waitForFunction(() => document.querySelector('.main-page')?.dataset.compact === 'true')
      await page.screenshot({ path: `${evidence}/main-scroll-1920.png` })
      const y = await page.locator('.main-page__case').first().evaluate(el => el.getBoundingClientRect().y)
      assert.ok(Math.abs(y - 62) < 1)
    }
    assert.deepEqual(errors, [], `browser errors at ${width}`)
    results.push({ ...measure, images: { count: measure.images.length, loaded: true, local: true }, interactions: 'filters, empty category, shared compact/PageUp, avatar, keyboard, reduced motion passed' })
    await context.close()
  }
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const page = await context.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Резюме', exact: true }).click()
  await page.waitForURL('**/resume')
  assert.equal(new URL(page.url()).pathname, '/resume')
  await context.close()
  await writeFile(`${evidence}/main-verification.json`, JSON.stringify({ url, results, resumeRoute: 'passed' }, null, 2))
  console.log(`Main: ${results.length} widths; geometry/assets/filters/scroll/keyboard/reduced-motion and resume route passed`)
} finally {
  await browser.close()
}
