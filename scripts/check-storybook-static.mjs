import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import http from 'node:http'
import { chromium } from 'playwright'

const base = process.env.NUXT_APP_BASE_URL || '/PDPortfolio/'
assert(base.startsWith('/') && base.endsWith('/'))
const root = path.resolve('.output/public')
const storybook = `${base}storybook/`
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.pdf': 'application/pdf' }
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
    assert(pathname.startsWith(base), `Outside hosting prefix: ${pathname}`)
    let file = path.resolve(root, pathname.slice(base.length))
    assert(file === root || file.startsWith(root + path.sep))
    if ((await fs.stat(file)).isDirectory()) file = path.join(file, 'index.html')
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' })
    res.end(await fs.readFile(file))
  } catch { res.writeHead(404); res.end('Not found') }
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const origin = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch()
const failures = new Set()
let current = ''
try {
  const page = await browser.newPage({ viewport: { width: 370, height: 900 }, reducedMotion: 'reduce' })
  await page.route(/https?:\/\/(?:[^/]+\.)?mc\.yandex\.[^/]+\//, route => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }))
  await page.route('https://www.googletagmanager.com/**', route => route.fulfill({ contentType: 'application/javascript', body: '' }))
  await page.route('https://*.google-analytics.com/**', route => route.fulfill({ body: '' }))
  page.on('pageerror', error => failures.add(`${current}: ${error.message}`))
  page.on('response', response => {
    if (response.url().startsWith(origin) && response.status() >= 400) failures.add(`${current}: ${response.status()} ${response.url()}`)
  })
  const index = JSON.parse(await fs.readFile(path.join(root, 'storybook/index.json'), 'utf8'))
  const docs = Object.values(index.entries).filter(entry => entry.type === 'docs')
  assert(docs.length > 0)
  for (const entry of docs) {
    current = entry.id
    await page.goto(`${origin}${storybook}iframe.html?id=${entry.id}&viewMode=docs`)
    await page.locator('.sbdocs-content').waitFor()
    await page.evaluate(() => document.fonts.ready)
    await page.waitForLoadState('networkidle')
    const dimensions = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }))
    assert(dimensions.scrollWidth <= dimensions.width, `${entry.id}: horizontal overflow ${dimensions.scrollWidth}/${dimensions.width}`)
  }
  for (const width of [1280, 393]) {
    current = `showcase-roundtrip-${width}`
    await page.setViewportSize({ width, height: 900 })
    await page.goto(origin + base)
    await page.evaluate(() => localStorage.removeItem('pdportfolio:showcase:category'))
    await page.reload()
    await page.locator('.pd-portfolio-ds').waitFor({ state: 'attached' })
    if (width < 1024) {
      await page.getByRole('button', { name: 'Выбрать категорию', exact: true }).click()
      await page.getByRole('dialog').getByRole('button', { name: 'Дизайн система', exact: true }).click()
    } else await page.getByRole('button', { name: 'Дизайн система', exact: true }).click()
    const card = page.locator('.pd-portfolio-ds')
    await card.scrollIntoViewIfNeeded()
    if (width === 1280) { await card.focus(); await page.keyboard.press('Enter') }
    else await card.click()
    await page.waitForURL(origin + storybook)
    await page.frameLocator('#storybook-preview-iframe').locator('.sbdocs-content').waitFor()
    await page.reload()
    await page.frameLocator('#storybook-preview-iframe').locator('.sbdocs-content').waitFor()
    if (width < 600) await page.getByRole('button', { name: 'Open navigation menu' }).click()
    const back = page.getByRole('link', { name: 'На витрину' })
    assert.equal(await back.getAttribute('href'), base)
    assert.equal(await back.count(), 1)
    await back.scrollIntoViewIfNeeded()
    assert.equal(await back.evaluate(el => el.getRootNode() instanceof ShadowRoot), true)
    const buttonSize = await back.boundingBox()
    assert.equal(buttonSize?.width, 50)
    assert.equal(buttonSize?.height, 50)
    if (width >= 600) { await back.focus(); await page.keyboard.press('Enter') }
    else await back.click()
    await page.waitForURL(origin + base)
    await page.waitForFunction(() => document.querySelector('.main-page__cases')?.getAttribute('data-category') === 'design-system')
    assert.equal(await page.locator('.main-page__case').count(), 3)
  }
  current = 'direct-links'
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto(`${origin}${storybook}?path=/docs/components-button--docs`)
  await page.frameLocator('#storybook-preview-iframe').locator('.docblock-argstable').waitFor()
  await page.reload()
  await page.frameLocator('#storybook-preview-iframe').locator('.docblock-argstable').waitFor()
  await page.goto(`${origin}${storybook}?path=/story/components-topstickybar--sandbox`)
  await page.frameLocator('#storybook-preview-iframe').locator('header').waitFor()
  await page.getByRole('link', { name: 'На витрину' }).waitFor()
  const pdf = await page.request.get(`${origin}${base}resume/Bazarov-Product-Designer-Resume.pdf`)
  assert.equal(pdf.status(), 200)
  assert.equal(failures.size, 0, [...failures].join('\n'))
  console.log(`Storybook publication checks passed: ${docs.length} Docs, mobile overflow, resources, direct links/refresh, PDF, desktop/mobile card roundtrip, filter persistence.`)
} finally {
  await browser.close()
  await new Promise(resolve => server.close(resolve))
}
