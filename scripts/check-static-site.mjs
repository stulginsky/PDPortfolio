import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import http from 'node:http'
import ts from 'typescript'

const base = process.env.NUXT_APP_BASE_URL || '/PDPortfolio/'
assert(base.startsWith('/') && base.endsWith('/'), 'Base URL must start and end with /')
const output = path.resolve('.output/public')
async function pageRoutes(directory, prefix = '') {
  const routes = []
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) routes.push(...await pageRoutes(path.join(directory, entry.name), prefix + '/' + entry.name))
    else if (entry.name.endsWith('.vue')) {
      assert(!entry.name.includes('['), 'Add explicit prerender/test destinations for dynamic page ' + entry.name)
      routes.push((prefix + '/' + entry.name.slice(0, -4)).replace(/\/index$/, '') || '/')
    }
  }
  return routes
}
const routes = await pageRoutes('app/pages')
const failures = new Set()
const source = await fs.readFile('app/utils/site-url.ts', 'utf8')
async function urlHelpers(base) {
  const code = ts.transpileModule(source.replace('import.meta.env.VITE_SITE_BASE_URL', JSON.stringify(base)), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText
  return import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'))
}
for (const base of ['/', '/PDPortfolio/']) {
  const { siteUrl, siteRoute, siteSrcset } = await urlHelpers(base)
  assert.equal(siteUrl('/cases/a.png'), base + 'cases/a.png')
  assert.equal(siteUrl(siteUrl('/cases/a.png')), base + 'cases/a.png')
  for (const value of ['https://example.com/a', '//example.com/a', 'data:image/png;base64,a', 'mailto:a@b.com', '#section', 'relative.png', '', undefined]) assert.equal(siteUrl(value), value)
  assert.equal(siteSrcset('/a.png 1x, /b.png 2x'), base + 'a.png 1x, ' + base + 'b.png 2x')
  assert.equal(siteSrcset('data:image/jpeg;base64,/9jABC 1x, /b.png 2x'), 'data:image/jpeg;base64,/9jABC 1x, ' + base + 'b.png 2x')
  assert.equal(siteRoute(base + 'cases/a'), '/cases/a')
  if (base !== '/') assert.equal(siteRoute('/another-site/'), null)
}
async function fileFor(url) {
  const pathname = decodeURIComponent(new URL(url, 'http://localhost').pathname)
  if (!pathname.startsWith(base)) throw new Error('URL outside hosting base: ' + pathname)
  let file = path.resolve(output, '.' + pathname.slice(base.length - 1))
  if (!file.startsWith(output + path.sep) && file !== output) throw new Error('Unsafe URL')
  if ((await fs.stat(file)).isDirectory()) file = path.join(file, 'index.html')
  await fs.access(file)
  return file
}
for (const route of routes) {
  const url = base + route.replace(/^\//, '')
  const html = await fs.readFile(await fileFor(url), 'utf8')
  assert(html.includes('__NUXT'), 'Missing Nuxt document: ' + route)
  assert.equal([...html.matchAll(/metrika\/tag\.js\?id=114073004/g)].length, 1, `One Metrika loader required: ${route}`)
  assert(html.includes('https://mc.yandex.ru/watch/114073004'), `Missing noscript counter: ${route}`)
  for (const match of html.matchAll(/\s(?:src|href|poster)="(\/[^"]*)"/g)) {
    if (match[1].startsWith('//')) continue
    try { await fileFor(match[1].replaceAll('&amp;', '&')) } catch (error) { failures.add(`${route}: ${match[1]} — ${error.message}`) }
  }
}
assert.equal(failures.size, 0, [...failures].join('\n'))
console.log(`Static checks passed: ${routes.length} pages, local URLs and files, helpers at / and /PDPortfolio/.`)

if (process.argv.includes('--browser')) {
  const { chromium } = await import('playwright')
  const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.mp4': 'video/mp4' }
  const server = http.createServer(async (req, res) => {
    try { const file = await fileFor(req.url); res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream'); res.end(await fs.readFile(file)) }
    catch { res.writeHead(404); res.end('Not found') }
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const origin = `http://127.0.0.1:${server.address().port}`
  const browser = await chromium.launch({ headless: true })
  try {
    for (const width of [390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
      // Leave the real bootstrap queue intact, but never send QA visits to Yandex.
      await page.route('https://mc.yandex.ru/**', route => route.fulfill({ contentType: 'text/javascript', body: '/* Analytics transport disabled for QA. */' }))
      async function hits(count) {
        await page.waitForFunction(expected => (window.ym?.a || []).filter(args => args[1] === 'hit').length === expected, count)
        const calls = await page.evaluate(() => window.ym.a.map(args => Array.from(args)))
        assert.equal(calls.filter(args => args[1] === 'init').length, 1, 'Counter initialized once per document')
        assert.equal(calls.find(args => args[1] === 'init')[2].defer, true, 'SPA views must not be counted twice')
        assert(calls.every(args => args[0] === 114073004), 'Unexpected Metrika counter')
        return calls.filter(args => args[1] === 'hit')
      }
      page.on('pageerror', error => failures.add(error.message))
      page.on('response', response => { if (response.status() >= 400 && response.url().startsWith(origin)) failures.add(`${response.status()} ${response.url()}`) })
      for (const route of routes) {
        await page.goto(origin + base + route.replace(/^\//, ''), { waitUntil: 'domcontentloaded' })
        await page.waitForFunction(() => !!document.querySelector('#__nuxt')?.__vue_app__)
        const initialHits = await hits(1)
        assert.equal(initialHits[0][2], page.url(), `Initial page hit URL: ${route}`)
        assert.equal(initialHits[0][3].title, await page.title(), `Initial page hit title: ${route}`)
        const urls = await page.locator('[src],a[href],source[srcset]').evaluateAll(elements => elements.flatMap(el => ['src','href','srcset'].flatMap(attr => {
          const value = el.getAttribute(attr)
          return value?.startsWith('/') && !value.startsWith('//') ? [attr === 'srcset' ? value.split(/\s/)[0] : value] : []
        })))
        for (const url of urls) try { await fileFor(url) } catch (error) { failures.add(`${route}: ${url} — ${error.message}`) }
        console.log(`${width}px ${route}: OK`)
      }
      await page.goto(origin + base, { waitUntil: 'domcontentloaded' })
      await page.waitForFunction(() => !!document.querySelector('#__nuxt')?.__vue_app__)
      await hits(1)
      await page.evaluate(() => { window.__navigationMarker = true })
      await page.locator(`a[href="${base}cases/dc-vendor-app-ux"]`).first().click()
      await page.waitForURL('**/cases/dc-vendor-app-ux')
      const navigatedHits = await hits(2)
      assert.equal(navigatedHits[1][2], page.url())
      assert.equal(navigatedHits[1][3].referer, origin + base)
      assert.equal(navigatedHits[1][3].title, await page.title())
      assert(await page.evaluate(() => window.__navigationMarker), 'Case navigation must keep the Nuxt app mounted')
      await page.goBack({ waitUntil: 'domcontentloaded' })
      assert.equal(new URL(page.url()).pathname, base)
      await hits(3)
      await page.evaluate(() => { window.location.hash = 'analytics-anchor-test' })
      await page.waitForURL('**/#analytics-anchor-test')
      await hits(3)
      await page.close()
    }
    assert.equal(failures.size, 0, [...failures].join('\n'))
    console.log('Browser checks passed: desktop/mobile, direct pages, local resources, Nuxt navigation, history, Metrika hits without duplicates or real analytics traffic.')
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)) }
}
