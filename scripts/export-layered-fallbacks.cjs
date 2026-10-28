// Technical render of approved Default artwork. Re-run after source scene edits.
const { chromium } = require('playwright')
const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')

const cards = [
  ['chirp-ai-health-assistant', '.chirp-health'],
  ['chirp-explainable-ai-ux', '.chirp-ux.chirp-card'],
  ['chirp-ai-medical-brand', '.chirp-brand.chirp-card'],
  ['chirp-ai-design-system', '.chirp-ds-card'],
  ['dc-vendor-app-pr', '.dc-vendor-app-pr.chirp-card'],
  ['dc-vendor-app-ux', '.dc-vendor-app-ux.chirp-card'],
]
const heroes = [
  ['chirp-br-hero', '/cases/chirp-brand/', '.chirp-br-hero', '.chirp-br-hero__title-svg, [data-figma-name="Role-Focus"]'],
  ['chirp-ds-hero', '/cases/chirp-design-system/', '.chirp-ds-hero', '.chirp-ds-hero__title, .chirp-ds-hero__copy'],
  ['chirp-pr-hero', '/cases/chirp-product/', '.chirp-pr-hero', '.chirp-pr-hero__title, .chirp-pr-hero__role'],
  ['chirp-ux-hero', '/cases/chirp-ux/', '.chirp-ux-hero', '.chirp-ux-hero__title, .chirp-ux-hero__role'],
  ['dc-vendor-app-pr-hero', '/cases/dc-vendor-app-pr/', '.dc-vendor-app-pr-hero', '[data-layer="Title"], .dc-vendor-app-pr-hero__semantic'],
  ['dc-vendor-app-ux-hero', '/cases/dc-vendor-app-ux/', '.dc-vendor-app-ux-hero', '[class*="__media--title"], .dc-vendor-app-ux-hero__semantic'],
]
const widths = [320, 370, 410, 425, 534, 720, 768, 1024, 1280, 1440, 1920]
const target = path.join(__dirname, '..', 'public', 'layered-fallbacks')
const requested = process.argv.slice(2)
const relatedOnly = requested.includes('--related')
const indexOnly = requested.includes('--index')
const selected = relatedOnly || indexOnly ? [] : requested.length ? requested : [...cards, ...heroes].map(([name]) => name)
const manifest = []

async function webp(page, png) {
  return Buffer.from(await page.evaluate(async base64 => {
    const image = new Image()
    image.src = `data:image/png;base64,${base64}`
    await image.decode()
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    canvas.getContext('2d').drawImage(image, 0, 0)
    return canvas.toDataURL('image/webp', .9).split(',')[1]
  }, png.toString('base64')), 'base64')
}

;(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true })
  try {
    if (indexOnly) {
      const page = await browser.newPage()
      const rows = []
      for (const component of fs.readdirSync(target, { withFileTypes: true }).filter(entry => entry.isDirectory())) {
        for (const file of fs.readdirSync(path.join(target, component.name)).filter(name => name.endsWith('.webp'))) {
          const bytes = fs.readFileSync(path.join(target, component.name, file))
          const dimensions = await page.evaluate(async base64 => {
            const image = new Image()
            image.src = `data:image/webp;base64,${base64}`
            await image.decode()
            return { width: image.naturalWidth, height: image.naturalHeight }
          }, bytes.toString('base64'))
          rows.push({ component: component.name, viewport: Number(file.match(/viewport-(\d+)/)[1]), ...(file.startsWith('related-') ? { variant: 'related' } : {}), file: `/${path.posix.join('layered-fallbacks', component.name, file)}`, ...dimensions, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') })
        }
      }
      fs.writeFileSync(path.join(target, 'manifest.json'), JSON.stringify(rows.sort((a, b) => a.component.localeCompare(b.component) || a.file.localeCompare(b.file)), null, 2) + '\n')
      console.log(`Indexed ${rows.length} fallback images`)
      await page.close()
      return
    }
    if (relatedOnly) {
      const page = await browser.newPage({ viewport: { width: 370, height: 1000 }, reducedMotion: 'reduce' })
      for (const width of [370, 410, 425, 462, 533]) {
        await page.setViewportSize({ width, height: 1000 })
        await page.goto('http://127.0.0.1:6006/iframe.html?id=compositions-relatedcases--all-cards&viewMode=story', { waitUntil: 'networkidle' })
        await page.waitForFunction(() => [...document.querySelectorAll('.related-cases__card')].slice(0, 6).every(card =>
          Math.abs(card.getBoundingClientRect().width - 288) < 1 &&
          card.querySelector('.showcase-card')?.dataset.ready === 'true' &&
          [...card.querySelectorAll('img')].filter(image => !image.closest('[data-scene-fallback]')).every(image => image.complete && image.naturalWidth)))
        for (const [name] of cards) {
          const root = page.locator(`.related-cases__card:has(.${name === 'chirp-ai-health-assistant' ? 'chirp-health' : name === 'chirp-explainable-ai-ux' ? 'chirp-ux' : name === 'chirp-ai-medical-brand' ? 'chirp-brand' : name === 'chirp-ai-design-system' ? 'chirp-ds-card' : name}) .showcase-card`).first()
          await root.evaluate(element => {
            const card = element.closest('.related-cases__card')
            const rail = element.closest('.related-cases__rail')
            rail.scrollLeft = Math.min(rail.scrollWidth - rail.clientWidth, card.offsetLeft)
          })
          await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
          const fullyVisible = await root.evaluate(element => {
            const rail = element.closest('.related-cases__rail').getBoundingClientRect()
            const card = element.getBoundingClientRect()
            return card.left >= rail.left - 1 && card.right <= rail.right + 1
          })
          if (!fullyVisible) throw new Error(`${name} at ${width}: related card not fully visible for capture`)
          await root.evaluate(element => { element.dataset.sceneState = 'ready' })
          await page.addStyleTag({ content: '.showcase-card [class$="__cred"]{visibility:hidden!important}.showcase-card [class$="__pict"]{visibility:visible!important}.layered-scene-fallback,.showcase-card::after{display:none!important}' })
          const bytes = await webp(page, await root.screenshot({ animations: 'disabled' }))
          const directory = path.join(target, name)
          fs.mkdirSync(directory, { recursive: true })
          const file = `related-viewport-${width}.webp`
          fs.writeFileSync(path.join(directory, file), bytes)
          const dimensions = await root.evaluate(node => ({ width: Math.round(node.getBoundingClientRect().width), height: Math.round(node.getBoundingClientRect().height) }))
          manifest.push({ component: name, viewport: width, variant: 'related', file: `/${path.posix.join('layered-fallbacks', name, file)}`, ...dimensions, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') })
          console.log(`${name} related ${width}: ${dimensions.width}x${dimensions.height}, ${bytes.length} B`)
        }
      }
      await page.close()
    }
    for (const name of selected) {
      const card = cards.find(([key]) => key === name)
      const hero = heroes.find(([key]) => key === name)
      if (!card && !hero) throw new Error(`Unknown component ${name}`)
      const page = await browser.newPage({ viewport: { width: 320, height: 1200 }, reducedMotion: 'reduce' })
      for (const width of widths) {
        await page.setViewportSize({ width, height: 1200 })
        await page.goto(card
          ? 'http://127.0.0.1:3000/'
          : `http://127.0.0.1:3000${hero[1]}`, { waitUntil: 'networkidle' })
        const root = page.locator(card ? card[1] : hero[2]).first()
        await root.waitFor({ state: 'visible' })
        await page.waitForFunction(selector => {
          const node = document.querySelector(selector)
          if (!node || node.dataset.ready !== 'true') return false
          if (node.hasAttribute('data-media-state') && node.dataset.mediaState !== 'ready') return false
          return [...node.querySelectorAll('img')].filter(img => img.getClientRects().length).every(img => img.complete && img.naturalWidth)
        }, card ? card[1] : hero[2], { timeout: 30000 })
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
        await root.evaluate(element => { if (element.hasAttribute('data-scene-state')) element.dataset.sceneState = 'ready' })
        await page.addStyleTag({ content: card
          ? `${card[1]} [class$="__cred"] { visibility:hidden!important } ${card[1]} [class$="__pict"] { visibility:visible!important } ${card[1]}::after,.layered-scene-fallback{display:none!important}`
          : `${hero[3]}, [class$="__back"] { visibility:hidden!important } ${hero[2]}::after,.layered-scene-fallback{display:none!important}` })
        if (name === 'chirp-br-hero') await root.evaluate(element => {
          const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
          while (walker.nextNode()) {
            const text = walker.currentNode
            if (text.textContent?.trim() && text.parentElement) text.parentElement.style.setProperty('visibility', 'hidden', 'important')
          }
        })
        const png = await root.screenshot({ animations: 'disabled' })
        const bytes = await webp(page, png)
        const directory = path.join(target, name)
        fs.mkdirSync(directory, { recursive: true })
        const file = `viewport-${width}.webp`
        fs.writeFileSync(path.join(directory, file), bytes)
        const dimensions = await root.evaluate(node => ({ width: Math.round(node.getBoundingClientRect().width), height: Math.round(node.getBoundingClientRect().height) }))
        manifest.push({ component: name, viewport: width, file: `/${path.posix.join('layered-fallbacks', name, file)}`, ...dimensions, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') })
        console.log(`${name} ${width}: ${dimensions.width}x${dimensions.height}, ${bytes.length} B`)
      }
      await page.close()
    }
  } finally { await browser.close() }
  fs.mkdirSync(target, { recursive: true })
  const previous = fs.existsSync(path.join(target, 'manifest.json')) ? JSON.parse(fs.readFileSync(path.join(target, 'manifest.json'), 'utf8')) : []
  const merged = [...previous.filter(old => !manifest.some(item => item.file === old.file)), ...manifest]
  fs.writeFileSync(path.join(target, 'manifest.json'), JSON.stringify(merged.sort((a, b) => a.component.localeCompare(b.component) || a.file.localeCompare(b.file)), null, 2) + '\n')
})().catch(error => { console.error(error); process.exit(1) })
