import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'
const url='http://127.0.0.1:6006/iframe.html?id=compositions-case-heroes-chirp-br-hero--sandbox&viewMode=story&embed=true'
const widths=[320,370,410,425,534,720,767,768,1023,1024,1279,1280,1439,1440,1919,1920]
const refs={base:[320,907],'min-768':[768,1362],'min-1024':[1024,561.6],'min-1280':[1280,702],'min-1440':[1440,789.75],'min-1920':[1918,1053]}
const bp=w=>w>=1920?'min-1920':w>=1440?'min-1440':w>=1280?'min-1280':w>=1024?'min-1024':w>=768?'min-768':'base'
const browser=await chromium.launch({headless:true})
const errors=[],records=[]
const context=await browser.newContext({reducedMotion:'reduce'})
const page=await context.newPage()
page.on('pageerror',e=>errors.push(e.message))
page.on('response',r=>{if(r.status()>=400&&/chirp-brand|fonts/.test(r.url()))errors.push(r.status()+' '+r.url())})
try {
 for(const width of widths){
  await page.setViewportSize({width,height:Math.max(1100,Math.ceil(refs[bp(width)][1]*width/refs[bp(width)][0]+350))})
  await page.goto(url)
  await page.locator('.chirp-br-hero').waitFor()
  await page.waitForFunction(()=>[...document.querySelectorAll('.chirp-br-hero img')].every(i=>i.complete&&i.naturalWidth>0))
  await page.evaluate(()=>document.fonts.ready)
  const state=await page.evaluate(()=>{
   const root=document.querySelector('.chirp-br-hero'),h=root.querySelector('h1'),r=root.getBoundingClientRect()
   return {bp:root.dataset.breakpoint,width:r.width,height:r.height,headings:root.querySelectorAll('h1').length,font:getComputedStyle(h).fontFamily,text:h.textContent,images:root.querySelectorAll('img').length,scroll:document.documentElement.scrollWidth,layers:[...root.querySelectorAll('[data-layer]')].map(e=>({name:e.dataset.layer,offset:e.style.getPropertyValue('--hero-motion'),enabled:e.dataset.animationEnabled})),svg:[...root.querySelectorAll('img[src$=".svg"]')].map(i=>({src:i.getAttribute('src'),naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,width:i.getBoundingClientRect().width,height:i.getBoundingClientRect().height}))}
  })
  assert.equal(state.bp,bp(width));assert.equal(state.headings,1)
  assert.ok(state.svg.some(image=>image.src.endsWith('/title.svg')), 'original full title SVG')
  assert.ok(Math.abs(state.height-refs[state.bp][1]*width/refs[state.bp][0])<.1)
  assert.ok(state.images>10);assert.ok(state.scroll<=width);assert.ok(state.layers.every(l=>parseFloat(l.offset||'0')===0))
  assert.ok(state.svg.every(i=>i.naturalWidth>0&&i.width>0&&i.height>0))
  for(const i of state.svg){const path='public'+i.src;const root=readFileSync(path,'utf8').match(/<svg\b[^>]*>/)[0];assert.ok(root.includes('width=')&&root.includes('height='))}
  if([320,768,1024,1280,1440,1920].includes(width))await page.locator('.chirp-br-hero').screenshot({path:'E:/GitHub/PDPortfolio-DS/ds/evidence/chirp-br-hero-'+width+'.png'})
  records.push(state)
 }
 await context.close()
 await browser.close()
 const {spawnSync}=await import('node:child_process')
 const result=spawnSync(process.execPath,['scripts/check-hero-motion.mjs','--hero','br'],{stdio:'inherit'})
 assert.equal(result.status,0,'shared motion regression br')
 console.log('PASS br: original layout/assets and shared hero motion')
} finally {await browser.close()}
