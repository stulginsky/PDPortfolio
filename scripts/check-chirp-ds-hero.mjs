import {chromium} from 'playwright'
import assert from 'node:assert/strict'
import {writeFile} from 'node:fs/promises'
const url='http://127.0.0.1:6006/iframe.html?id=compositions-case-heroes-chirp-ds-hero--sandbox&viewMode=story&embed=true'
const browser=await chromium.launch({headless:true})
const context=await browser.newContext({reducedMotion:'reduce'})
const page=await context.newPage(),records=[],errors=[]
page.on('pageerror',e=>errors.push(e.message))
page.on('response',r=>{if(r.status()>=400&&/chirp-design-system/.test(r.url()))errors.push(r.status()+' '+r.url())})
try{
 for(const width of [320,370,410,425,534,720,767,768,1023,1024,1279,1280,1439,1440,1919,1920]){
  await page.setViewportSize({width,height:2600});await page.goto(url,{waitUntil:'networkidle'})
  await page.waitForFunction(()=>[...document.querySelectorAll('.chirp-ds-hero img')].length===2&&[...document.querySelectorAll('.chirp-ds-hero img')].every(i=>i.complete&&i.naturalWidth>0))
  await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(100)
  const record=await page.locator('.chirp-ds-hero').evaluate(root=>{
   const box=root.getBoundingClientRect(),panel=root.querySelector('.chirp-ds-hero__panel').getBoundingClientRect(),role=root.querySelector('[data-layer="Role-Focus"]').getBoundingClientRect(),bird=root.querySelector('.chirp-ds-hero__bird img'),title=root.querySelector('.chirp-ds-hero__title img')
   return {bp:root.dataset.breakpoint,height:box.height,panelBottom:panel.bottom-box.top,copyBottom:role.bottom-box.top,overflow:document.documentElement.scrollWidth-innerWidth,headingCount:root.querySelectorAll('h1').length,title:{width:title.naturalWidth,height:title.naturalHeight},mirror:getComputedStyle(bird).transform,motion:getComputedStyle(bird.parentElement).transform}
  })
  assert.equal(record.bp,width>=1920?'min-1920':width>=1440?'min-1440':width>=1280?'min-1280':width>=1024?'min-1024':width>=768?'min-768':'base')
  assert.equal(record.overflow,0);assert.equal(record.headingCount,1);assert.ok(Math.abs(record.height-record.panelBottom)<.1);assert.ok(record.copyBottom<record.height)
  assert.ok(record.mirror.startsWith('matrix(-1,'),'original horizontal reflection')
  if([320,768,1024,1280,1440,1920].includes(width))await page.locator('.chirp-ds-hero').screenshot({path:`E:/GitHub/PDPortfolio-DS/ds/evidence/chirp-ds-hero-${width}.png`})
  records.push({width,...record})
 }
 await context.close()
 await browser.close()
 const {spawnSync}=await import('node:child_process')
 const result=spawnSync(process.execPath,['scripts/check-hero-motion.mjs','--hero','ds'],{stdio:'inherit'})
 assert.equal(result.status,0,'shared motion regression ds')
 console.log('PASS ds: original layout/assets and shared hero motion')
}finally{await browser.close()}
