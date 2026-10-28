import { chromium } from 'playwright'
import fs from 'node:fs'
import assert from 'node:assert/strict'
const root='E:/GitHub/PDPortfolio-DS/ds/evidence/dc-product-revision-2026-10-24/'
const browser=await chromium.launch({headless:true})
const report=[]
try {
 for(const width of [1920,1440,1280,1024,1023,768,425,370,320]) {
  const page=await browser.newPage({viewport:{width,height:1080},reducedMotion:'reduce'})
  const errors=[]
  page.on('pageerror',e=>errors.push(e.message))
  await page.goto('http://127.0.0.1:3000/cases/dc-vendor-app-pr',{waitUntil:'networkidle'})
  await page.evaluate(()=>document.fonts.ready)
  const sections=page.locator('.dc-product__flow > [data-figma-frame]')
  assert.equal(await sections.count(),8)
  for(const section of await sections.all()) {
   await section.scrollIntoViewIfNeeded()
   await section.locator('img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())))
  }
  assert.equal(await page.locator('.dc-product__back a').getAttribute('href'),'/')
  assert.equal(await page.locator('.dc-product__related-cards a').count(),0)
  assert.equal(await page.locator('.dc-product__discovery-grid > .case-content-card').count(),4)
  assert.equal(await page.locator('.dc-product__contribution-card').count(),3)
  const geometry=await page.evaluate(()=>({
   viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,
   sections:[...document.querySelectorAll('.dc-product__flow > [data-figma-frame]')].map(e=>({id:e.dataset.figmaFrame,y:e.getBoundingClientRect().top+scrollY,height:e.getBoundingClientRect().height})),
   cards:[...document.querySelectorAll('.dc-product__discovery-grid > .case-content-card')].map(e=>({top:e.getBoundingClientRect().top+scrollY,left:e.getBoundingClientRect().left})),
  }))
  assert.equal(geometry.viewport,geometry.scrollWidth,'page overflow '+width)
  if(width<1024) for(let i=1;i<geometry.cards.length;i++)assert.ok(geometry.cards[i].top>geometry.cards[i-1].top,'source stacking')
  const media=await page.locator('.dc-product__flow img[src*="/media/"]').evaluateAll(es=>es.map(e=>({src:e.getAttribute('src'),ready:e.complete&&e.naturalWidth>0})))
  assert.equal(new Set(media.map(e=>e.src)).size,10)
  assert.ok(media.every(e=>e.ready),'all original highres media decode')
  const table=await page.locator('.dc-product__table').evaluate(e=>({width:e.getBoundingClientRect().width,grid:getComputedStyle(e).gridTemplateColumns,participants:[...e.querySelectorAll('tbody td:last-child')].map(c=>getComputedStyle(c).gridColumn)}))
  if(width<1024)assert.ok(table.participants.every(c=>c==='1 / -1'),'participants span mobile table')
  if(width===1920){
   const expected=[[902,90],[1064,396],[1532,785],[2389,1070],[3531,857],[4460,1766],[6298,904],[7274,1280]]
   geometry.sections.forEach((s,i)=>{assert.ok(Math.abs(s.y-expected[i][0])<1,'desktop source Y '+s.id);assert.ok(Math.abs(s.height-expected[i][1])<1,'desktop source height '+s.id)})
  }
  if(width===768)assert.equal(await page.locator('.dc-product__influence-image').isVisible(),true)
  if(width===320)assert.equal(await page.locator('.dc-product__influence-image').isVisible(),true)
  report.push({width,media,table})
  await page.getByRole('button',{name:'К началу страницы'}).click()
  await page.waitForFunction(()=>scrollY===0)
  await page.waitForFunction(()=>[...document.querySelectorAll('.dc-product__hero img')].filter(e=>e.getClientRects().length).every(e=>e.complete&&e.naturalWidth))
  if([1920,768,320].includes(width))await page.screenshot({path:root+'dc-product-page-'+width+'.png',fullPage:true})
  assert.deepEqual(errors,[])
  report.push({width,...geometry,errors})
  await page.close()
 }
 const page=await browser.newPage({viewport:{width:1920,height:1080},javaScriptEnabled:false})
 await page.goto('http://127.0.0.1:3000/cases/dc-vendor-app-pr',{waitUntil:'domcontentloaded'})
 await page.waitForLoadState('load')
 assert.equal(await page.locator('.dc-product__intro').count(),1)
 assert.ok(await page.locator('.dc-product__hero [data-media-state="loading"]').count()>=1)
 assert.ok((await page.locator('.dc-product__hero').boundingBox()).height>=829)
 report.push({ssr:true,width:1920,initialGeometry:true})
 fs.writeFileSync(root+'dc-product-page-check.json',JSON.stringify(report,null,2)+'\n')
 console.log('Passed: 9 responsive widths, source order, 10 shared highres images, back/top, inert related placeholders, SSR geometry; no page errors.')
} finally {await browser.close()}
