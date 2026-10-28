import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'
const evidence = 'E:/GitHub/PDPortfolio-DS/ds/evidence'
const content = JSON.parse(await readFile('content/about.json','utf8'))
const normalize = text => text.replace(/\s+/gu,' ').trim()
const browser = await chromium.launch({ headless: true })
const results = []
try {
  for (const width of [320, 370, 410, 534, 570, 767, 768, 1024, 1280, 1440, 1464, 1920]) {
    const context = await browser.newContext({ viewport: { width, height: 1080 }, reducedMotion: 'reduce' })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', e => errors.push(e.message))
    const response = await page.goto('http://127.0.0.1:3000/resume', { waitUntil: 'networkidle' })
    assert.equal(response.status(),200)
    await page.evaluate(() => document.fonts.ready)
    await page.waitForFunction(() => [...document.querySelectorAll('img')].every(img => img.complete && img.naturalWidth > 0))
    const geometry = await page.locator('.about-page').evaluate(root => {
      const r = selector => { const n=root.querySelector(selector),b=n.getBoundingClientRect(); return {x:b.x,y:b.y,width:b.width,height:b.height} }
      return { width:innerWidth,overflow:document.documentElement.scrollWidth-innerWidth,body:r('.about-page__body'),summary:r('.about-page__summary'),experience:r('.about-page__experience'),sidebar:r('.about-page__sidebar'),quoteOpenVisible:getComputedStyle(root.querySelector('.about-page__quote-open')).display!=='none' }
    })
    assert.equal(geometry.overflow,0)
    assert.equal(await page.locator('h1').count(),1)
    assert.equal(await page.locator('h2').count(),15)
    for (const element of await page.locator('[data-figma-node]').all()) {
      const id=await element.getAttribute('data-figma-node')
      const text=await element.locator('.about-copy').innerText()
      assert.equal(normalize(text),normalize(content.nodes[id].text),`Figma text mismatch ${id}/${width}`)
    }
    assert.equal(normalize(await page.locator('.about-page__summary-copy').innerText()),normalize(content.nodes['1588:8431'].text))
    if (width >=1464) {
      assert.equal(geometry.body.width,1400)
      assert.equal(geometry.experience.width,734)
      assert.equal(geometry.sidebar.width,594)
      assert.equal(geometry.summary.height,638)
      assert.equal(geometry.quoteOpenVisible,true)
    } else if (width >= 768) {
      assert.equal(geometry.sidebar.y,geometry.experience.y)
      assert.ok(geometry.sidebar.x > geometry.experience.x)
      assert.ok(Math.abs(geometry.experience.width / geometry.sidebar.width - 734 / 594) < 0.01)
      assert.equal(geometry.quoteOpenVisible,false)
    } else {
      assert.ok(geometry.sidebar.y < geometry.experience.y)
      assert.equal(geometry.quoteOpenVisible,false)
    }
    if ([320,768,1920].includes(width)) await page.screenshot({path:`${evidence}/about-${width}.png`,fullPage:true})
    assert.equal(await page.locator('.about-page__compact').count(),0)
    await page.evaluate(() => window.scrollTo(0,document.querySelector('.about-page__header').getBoundingClientRect().bottom+1))
    await page.waitForFunction(() => document.querySelector('.about-page').dataset.compact==='true')
    const nav=await page.locator('.ds-top-nav-scroll-resume').boundingBox()
    assert.equal(nav.width,Math.min(width,534))
    await page.locator('.ds-avatar-sm').click()
    await page.waitForFunction(() => scrollY===0 && document.querySelector('.about-page').dataset.compact==='false')
    const download=page.waitForEvent('download')
    await page.locator('.ds-top-nav').getByRole('button',{name:/PDF/}).click()
    const file=await download
    assert.equal(file.suggestedFilename(),'Bazarov-Product-Designer-Resume.pdf')
    await page.evaluate(() => { window.__printCalls=0; window.print=()=>{window.__printCalls++} })
    await page.locator('.ds-top-nav button').last().click()
    assert.equal(await page.evaluate(()=>window.__printCalls),1)
    assert.deepEqual(errors,[])
    results.push({...geometry,content:'all generated nodes match',controls:'avatar/compact/download/print passed'})
    await context.close()
  }
  const context=await browser.newContext({viewport:{width:1920,height:1080}})
  const page=await context.newPage()
  await page.goto('http://127.0.0.1:3000/resume',{waitUntil:'networkidle'})
  await page.evaluate(() => document.fonts.ready)
  const motion=await page.locator('.about-page__quote-open').evaluate(e=>{const s=getComputedStyle(e);return {duration:s.animationDuration,delay:s.animationDelay,easing:s.animationTimingFunction}})
  assert.equal(motion.duration,'0.65s');assert.equal(motion.delay,'0.2s')
  await page.locator('.ds-top-nav button').first().click()
  await page.waitForURL('http://127.0.0.1:3000/')
  await context.close()
  await writeFile(`${evidence}/about-verification.json`,JSON.stringify({results,motion,projectsRoute:'passed'},null,2))
  console.log(`About: ${results.length} viewports, exact generated text, assets, compact/header, download/print, quote motion and projects route passed`)
} finally { await browser.close() }
