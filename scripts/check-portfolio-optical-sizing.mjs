import { chromium } from 'playwright'
import fs from 'node:fs/promises'
import assert from 'node:assert/strict'

const routes = ['/', ...(await fs.readdir('app/pages/cases')).filter(name => name.endsWith('.vue')).map(name => `/cases/${name.slice(0, -4)}`)]
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const report = [], errors = []
try {
  const page = await browser.newPage()
  page.on('pageerror', error => errors.push(error.message))
  for (const width of [1920, 768, 320]) {
    await page.setViewportSize({ width, height: 1080 })
    for (const route of routes) {
      await page.goto(`http://127.0.0.1:3000${route}`, { waitUntil: 'domcontentloaded' })
      await page.evaluate(() => document.fonts.ready)
      const result = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        disabled: [...document.querySelectorAll('main p, main h1, main h2, main h3, .main-page p')]
          .filter(element => getComputedStyle(element).fontOpticalSizing !== 'auto').map(element => element.className),
      }))
      report.push({ width, route, ...result })
    }
  }
  await fs.mkdir('tmp/sapsan-case', { recursive: true })
  await fs.writeFile('tmp/sapsan-case/optical-sizing.json', JSON.stringify({ report, errors }, null, 2))
  assert.deepEqual(report.filter(result => result.overflow || result.disabled.length), [])
  assert.deepEqual(errors, [])
  console.log(`Optical sizing: ${report.length} route/viewport checks passed`)
} finally { await browser.close() }
