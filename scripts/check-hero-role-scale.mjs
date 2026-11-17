import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync } from 'node:fs'

// Intermediate widths expose regressions hidden by scale=1 at Figma reference widths.
const heroes = ['chirp-ds-hero', 'chirp-br-hero', 'chirp-pr-hero', 'chirp-ux-hero', 'dcvendorapp-pr-hero', 'dcvendorapp-ux-hero', 'lidport-ds-hero']
const widths = [320, 410, 767, 768, 900, 1024, 1200, 1280, 1366, 1440, 1600, 1842, 1920, 2200]
const cases = ['chirp-design-system', 'chirp-brand', 'chirp-product', 'chirp-ux', 'lidport-design-system']
const browser = await chromium.launch({ headless: true })
const results = []

async function measure(page, name, width, javascript) {
  await page.evaluate(() => document.fonts.ready)
  const roles = await page.evaluate(() => [...document.querySelectorAll('.ds-role-focus')]
    .filter(el => el.getBoundingClientRect().height > 0).map(role => {
      const label = role.querySelector('.ds-role-focus__label')
      const value = role.querySelector('.ds-role-focus__value')
      const box = label.getBoundingClientRect()
      return { font: getComputedStyle(label).fontSize, valueFont: getComputedStyle(value).fontSize,
        scaleX: box.width / label.offsetWidth, width: role.getBoundingClientRect().width }
    }))
  if (!name.startsWith('dcvendorapp-')) assert.equal(roles.length, 1, `${name}/${width}: missing Role-Focus`)
  for (const role of roles) assert(Math.abs(role.scaleX - 1) < .015, `${name}/${width}/${javascript}: scaled ${JSON.stringify(role)}`)
  results.push({ name, width, javascript, roles })
}

try {
  for (const hero of heroes) {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' })
    await page.goto(`http://127.0.0.1:6006/iframe.html?id=compositions-case-heroes-${hero}--preview&viewMode=story&embed=true`, { waitUntil: 'networkidle' })
    for (const width of widths) {
      await page.setViewportSize({ width, height: 1080 })
      await page.waitForTimeout(100)
      await measure(page, hero, width, true)
    }
    await page.close()
  }
  for (const name of cases) for (const width of [320, 900, 1842, 2200]) {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width, height: 1080 }, reducedMotion: 'reduce' })
    const page = await context.newPage()
    await page.goto(`http://127.0.0.1:3000/cases/${name}`, { waitUntil: 'networkidle' })
    await measure(page, name, width, false)
    await context.close()
  }
  mkdirSync('tmp', { recursive: true })
  writeFileSync('tmp/hero-role-scale-regression.json', JSON.stringify(results, null, 2))
  console.log(`PASS: ${results.length} hero/width checks; native Role-Focus size in Storybook and server-rendered cases`)
} finally { await browser.close() }
