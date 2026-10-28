import { chromium } from 'playwright'

const base = 'http://127.0.0.1:3000'
const cases = [
  'chirp-brand', 'chirp-design-system', 'chirp-product', 'chirp-ux',
  'dc-vendor-app-pr', 'dc-vendor-app-ux',
]
const browser = await chromium.launch({ channel: 'msedge', headless: true })
try {
  for (const width of [320, 768, 1920]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, javaScriptEnabled: false })
    const page = await context.newPage()
    for (const route of ['/', ...cases.map(name => `/cases/${name}/`)]) {
      await page.goto(base + route, { waitUntil: 'networkidle' })
      const selectors = route === '/' ? '.showcase-card' : 'section[data-scene-state]'
      const result = await page.locator(selectors).evaluateAll(nodes => nodes.map(node => {
        const fallback = node.querySelector('.layered-scene-fallback--default img')
        const box = node.getBoundingClientRect()
        return { state: node.dataset.sceneState, width: box.width, height: box.height,
          fallback: fallback?.naturalWidth, display: getComputedStyle(fallback).visibility }
      }))
      if (result.length !== (route === '/' ? 6 : 1) || result.some(item =>
        item.state !== 'loading' || !item.fallback || item.display !== 'visible' || !item.width || !item.height)) {
        throw new Error(`No-JS fallback failed at ${width} ${route}: ${JSON.stringify(result)}`)
      }
    }
    await context.close()
    console.log(`No-JS fallback: ${width}px passed`)
  }

  const page = await browser.newPage({ viewport: { width: 320, height: 900 }, reducedMotion: 'reduce' })
  await page.route('**/phone-profile@2x.png', async route => {
    await new Promise(resolve => setTimeout(resolve, 1800))
    await route.continue()
  })
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => document.querySelector('.chirp-health')?.dataset.sceneState === 'loading')
  await page.locator('.chirp-health .layered-scene-fallback--default img').evaluate(async image => image.decode())
  const loading = await page.locator('.chirp-health').evaluate(node => ({
    fallback: getComputedStyle(node.querySelector('.layered-scene-fallback--default')).visibility,
    picture: getComputedStyle(node.querySelector('.chirp-health__pict')).visibility,
    copy: getComputedStyle(node.querySelector('.chirp-health__copy')).visibility,
  }))
  if (loading.fallback !== 'visible' || loading.picture !== 'hidden' || loading.copy !== 'visible') {
    throw new Error(`Delayed card scene: ${JSON.stringify(loading)}`)
  }
  await page.waitForFunction(() => document.querySelector('.chirp-health')?.dataset.sceneState === 'ready')
  await page.setViewportSize({ width: 768, height: 900 })
  await page.waitForFunction(() => document.querySelector('.chirp-health')?.dataset.sceneState === 'ready')
  console.log('Delayed artwork and viewport change: passed')
  await page.close()

  const errorPage = await browser.newPage({ viewport: { width: 320, height: 900 } })
  await errorPage.route('**/phone-profile@2x.png', route => route.abort())
  await errorPage.goto(base + '/', { waitUntil: 'networkidle' })
  await errorPage.waitForFunction(() => document.querySelector('.chirp-health')?.dataset.sceneState === 'error')
  const failure = await errorPage.locator('.chirp-health').evaluate(node => ({
    fallback: getComputedStyle(node.querySelector('.layered-scene-fallback--default')).visibility,
    picture: getComputedStyle(node.querySelector('.chirp-health__pict')).visibility,
    link: node.getAttribute('href'),
  }))
  if (failure.fallback !== 'visible' || failure.picture !== 'hidden' || !failure.link) throw new Error(`Error fallback: ${JSON.stringify(failure)}`)
  console.log('Failed layer retains fallback and link: passed')
  await errorPage.close()

  const heroPage = await browser.newPage({ viewport: { width: 320, height: 900 }, reducedMotion: 'reduce' })
  await heroPage.route('**/cases/dc-vendor-app-pr/hero-layers/base/02-cloud.png', async route => {
    await new Promise(resolve => setTimeout(resolve, 1800))
    await route.continue()
  })
  await heroPage.goto(base + '/cases/dc-vendor-app-pr/', { waitUntil: 'domcontentloaded' })
  await heroPage.locator('.dc-vendor-app-pr-hero .layered-scene-fallback--default img').evaluate(async image => image.decode())
  await heroPage.waitForFunction(() => document.querySelector('.dc-vendor-app-pr-hero [data-layer="Title"]')?.dataset.mediaState === 'ready')
  const heroLoading = await heroPage.locator('.dc-vendor-app-pr-hero').evaluate(node => ({
    state: node.dataset.sceneState,
    fallback: getComputedStyle(node.querySelector('.layered-scene-fallback--default')).visibility,
    title: getComputedStyle(node.querySelector('[data-layer="Title"]')).visibility,
    cloud: getComputedStyle(node.querySelector('[data-layer="02-cloud"]')).visibility,
  }))
  if (heroLoading.state !== 'loading' || heroLoading.fallback !== 'visible' || heroLoading.title !== 'visible') {
    throw new Error(`Delayed hero scene: ${JSON.stringify(heroLoading)}`)
  }
  await heroPage.waitForFunction(() => document.querySelector('.dc-vendor-app-pr-hero')?.dataset.sceneState === 'ready')
  console.log('Hero Title independent of delayed artwork: passed')
  await heroPage.close()
} finally { await browser.close() }
