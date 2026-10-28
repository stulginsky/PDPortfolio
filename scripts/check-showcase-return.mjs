import { chromium } from 'playwright'

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const snapshots = new Map()
const geometry = page => page.locator('.main-page .showcase-card').evaluateAll(cards => cards.map(card => {
  const scene = card.querySelector('[class$="__pict"]').getBoundingClientRect()
  const bounds = card.getBoundingClientRect()
  return [bounds.width, bounds.height, scene.x - bounds.x, scene.y - bounds.y, scene.width, scene.height].map(value => Math.round(value * 100) / 100)
}))
try {
  for (const width of [320, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
    let documents = 0
    page.on('request', request => { if (request.isNavigationRequest() && request.frame() === page.mainFrame()) documents++ })
    await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' })
    await page.waitForFunction(() => {
      const cards = [...document.querySelectorAll('.main-page .showcase-card')]
      return cards.length === 6 && cards.every(card => card.dataset.sceneState === 'ready')
    })
    await page.evaluate(() => {
      window.__showcaseReturn = { root: document.querySelector('.main-page'), loads: [] }
      const observer = new MutationObserver(records => {
        for (const record of records) {
          if (record.target.isConnected && record.target.dataset.sceneState === 'loading') window.__showcaseReturn.loads.push(record.target.className)
        }
      })
      observer.observe(window.__showcaseReturn.root, { subtree: true, attributes: true, attributeFilter: ['data-scene-state'] })
    })
    snapshots.set(width, await geometry(page))
    for (const method of ['page-link', 'browser-back']) {
      await page.locator('.main-page .chirp-health').click()
      await page.waitForURL('**/cases/chirp-product')
      if (!await page.evaluate(() => Boolean(window.__showcaseReturn))) throw new Error(`${width}: document reloaded on case link`)
      await page.waitForFunction(() => document.querySelector('.chirp-pr-hero')?.dataset.sceneState === 'ready')
      await page.mouse.move(0, 0)
      if (method === 'page-link') await page.locator('.product-case__back a').click()
      else await page.goBack()
      await page.waitForURL('http://127.0.0.1:3000/')
      await page.locator('.main-page').waitFor({ state: 'visible' })
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
      const result = await page.evaluate(() => ({
        sameRoot: window.__showcaseReturn?.root === document.querySelector('.main-page'),
        states: [...document.querySelectorAll('.main-page .showcase-card')].map(card => card.dataset.sceneState),
        interactions: [...document.querySelectorAll('.main-page .showcase-card')].map(card => card.dataset.state),
        loads: window.__showcaseReturn?.loads,
      }))
      if (!result.sameRoot || result.states.some(state => state !== 'ready') || result.interactions.some(state => state !== 'Default') || result.loads.length) {
        throw new Error(`${width} ${method}: ${JSON.stringify(result)}`)
      }
      if (documents !== 1) throw new Error(`${width}: ${documents} document requests`)
      if (JSON.stringify(await geometry(page)) !== JSON.stringify(snapshots.get(width))) throw new Error(`${width}: geometry changed after return`)
      console.log(`${width}px ${method}: same cards, ready immediately, no repeated skeleton or document request`)
    }
    if (width === 1440) {
      await page.locator('.main-page .chirp-health').click()
      await page.waitForURL('**/cases/chirp-product')
      await page.setViewportSize({ width: 320, height: 900 })
      await page.locator('.product-case__back a').click()
      await page.waitForURL('http://127.0.0.1:3000/')
      await page.waitForFunction(() => [...document.querySelectorAll('.main-page .showcase-card')].every(card => card.dataset.sceneState === 'ready'))
      if (JSON.stringify(await geometry(page)) !== JSON.stringify(snapshots.get(320))) throw new Error('Retained cards have incorrect geometry after viewport change in case')
      console.log('1440 → case → resize to 320 → showcase: correct responsive geometry')
    }
    await page.close()
  }
} finally { await browser.close() }
