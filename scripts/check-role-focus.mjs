import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'
import { typografRoleFocusItems } from './lib/typograf-shared.mjs'

const input = 'Product Discovery · Product Architecture · Business Analysis · MVP Scope · AI Product Design'
const formatted = typografRoleFocusItems(input)
assert.equal(formatted.at(-1), 'AI\u00a0Product\u00a0Design')
assert.ok(formatted.slice(0, -1).every(item => item.endsWith('\u00a0·')))
assert.deepEqual(typografRoleFocusItems(formatted.join(' ')), formatted, 'idempotent on generated text')
assert.deepEqual(typografRoleFocusItems(''), [])
assert.deepEqual(typografRoleFocusItems(' AI Product Design &nbsp; · UX-исследователь '), ['AI\u00a0Product\u00a0Design\u00a0·', 'UX‑исследователь'])
const evidence = 'E:/GitHub/PDPortfolio-DS/ds/evidence'
await mkdir(evidence, { recursive: true })
const browser = await chromium.launch({ headless: true })
const results = []
try {
  for (const width of [320, 370, 410, 424, 425, 534, 720, 768, 1024, 1280, 1440, 1920]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto('http://127.0.0.1:6006/iframe.html?id=components-rolefocus--sandbox&viewMode=story&embed=true', { waitUntil: 'networkidle' })
    await page.locator('.ds-role-focus').first().waitFor()
    await page.evaluate(() => document.fonts.ready)
    assert.equal(await page.locator('.ds-role-focus').count(), 1, 'one responsive preview')
    assert.ok(!(await page.locator('.ds-role-focus').getAttribute('class')).includes('ds-role-focus--'), 'no forced breakpoint in Sandbox')
    const check = await page.locator('.ds-role-focus').first().evaluate(root => {
      const rows = [...root.querySelectorAll('.ds-role-focus__row')]
      return {
        layout: getComputedStyle(rows[0]).flexDirection,
        baselineDeltas: rows.map(row => {
          const markers = [...row.children].map(element => {
            const marker = document.createElement('span')
            marker.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline;padding:0;margin:0;border:0'
            element.insertBefore(marker, element.firstChild)
            return marker
          })
          const delta = markers[0].getBoundingClientRect().top - markers[1].getBoundingClientRect().top
          markers.forEach(marker => marker.remove())
          return delta
        }),
        labels: [...root.querySelectorAll('.ds-role-focus__label')].map(label => ({ align: getComputedStyle(label).textAlign, width: label.getBoundingClientRect().width })),
        values: [...root.querySelectorAll('.ds-role-focus__value')].map(value => {
          const box = value.getBoundingClientRect()
          return [...value.querySelectorAll('.ds-role-focus__item')].map(item => {
            const range = document.createRange()
            range.selectNodeContents(item)
            const rects = [...range.getClientRects()]
            return { text: item.textContent, lines: rects.length, fits: rects.every(rect => rect.left >= box.left - .1 && rect.right <= box.right + .1) }
          })
        }),
      }
    })
    assert.equal(check.layout, width < 425 ? 'column' : 'row')
    if (width >= 425) for (const delta of check.baselineDeltas) assert.ok(Math.abs(delta) < .1, 'first baselines align at ' + width)
    for (const label of check.labels) {
      assert.equal(label.align === 'right', width >= 425)
      if (width >= 425) assert.equal(label.width, 116)
    }
    for (const items of check.values) for (const [index, item] of items.entries()) {
      assert.equal(item.lines, 1, 'whole item on one line at ' + width)
      assert.equal(item.fits, true, 'item fits available value width at ' + width)
      assert.ok(!item.text.includes(' '), 'no internal breaking spaces')
      assert.ok(index === items.length - 1 || item.text.endsWith('\u00a0·'), 'separator stays with preceding item')
    }
    assert.deepEqual(errors, [])
    if ([320, 425, 1280].includes(width)) await page.locator('.ds-role-focus').first().screenshot({ path: evidence + '/role-focus-' + width + '.png' })
    results.push({ width, ...check, errors })
    await page.close()
  }
  const docs = await browser.newPage({ viewport: { width: 1280, height: 1000 } })
  await docs.goto('http://127.0.0.1:6006/iframe.html?id=components-rolefocus--docs&viewMode=docs', { waitUntil: 'networkidle' })
  await docs.locator('.ds-role-focus').waitFor()
  assert.equal(await docs.locator('.ds-role-focus').count(), 1, 'exactly one Docs preview')
  await docs.locator('tbody').getByText('breakpoint', { exact: true }).first().waitFor()
  // Storybook retains a hidden loading skeleton table; inspect actual prop names only.
  const props = await docs.locator('tbody tr').evaluateAll(rows => rows.map(row => row.querySelector('td')?.textContent.trim()).filter(name => /^(breakpoint|role\*?|focus\*?)$/.test(name ?? '')))
  assert.equal(props[0], 'breakpoint', 'breakpoint first in props')
  assert.equal(await docs.getByRole('radio', { name: 'base', exact: true }).isChecked(), true, 'Docs starts base')
  const root = docs.locator('.ds-role-focus')
  assert.ok((await root.getAttribute('class')).includes('--base'))
  await docs.screenshot({ path: evidence + '/role-focus-docs-base.png', fullPage: true })
  await docs.getByRole('radio', { name: 'min-425', exact: true }).check()
  await docs.waitForFunction(() => document.querySelector('.ds-role-focus')?.classList.contains('ds-role-focus--min-425'))
  assert.equal(await root.locator('.ds-role-focus__row').first().evaluate(row => getComputedStyle(row).flexDirection), 'row')
  assert.ok((await root.boundingBox()).width >= 666, 'Docs has enough preview width for min-425')
  await docs.screenshot({ path: evidence + '/role-focus-docs-min-425.png', fullPage: true })
  await docs.getByRole('radio', { name: 'base', exact: true }).check()
  await docs.waitForFunction(() => document.querySelector('.ds-role-focus')?.classList.contains('ds-role-focus--base'))
  const index = await (await docs.request.get('http://127.0.0.1:6006/index.json')).json()
  assert.equal(index.entries['components-rolefocus--docs'].name, 'Docs')
  assert.equal(index.entries['components-rolefocus--sandbox'].name, 'Sandbox')
  assert.ok(!index.entries['components-rolefocus--breakpoints'], 'old Breakpoints story removed')
  assert.ok(!index.entries['components-rolefocus--preview'].tags.includes('dev'), 'Docs preview hidden from sidebar')
  await docs.close()
  await writeFile(evidence + '/role-focus-verification.json', JSON.stringify({ results, docs: { previewCount: 1, props, radioRoundTrip: 'passed', previewWidth: 'passed', sidebar: 'Docs + Sandbox' } }, null, 2) + '\n')
  console.log('RoleFocus: Typograf/idempotence, 12 actual Sandbox viewports, whole items/separators, automatic breakpoint, label alignment passed.')
} finally {
  await browser.close()
}
