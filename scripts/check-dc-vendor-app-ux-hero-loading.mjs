import assert from 'node:assert/strict'
import fs from 'node:fs'
import {chromium} from 'playwright'
import {getHeroBreakpoint,heroReferences} from '../app/components/dc-vendor-app-ux-hero.scene-context.ts'
import {heroAssets} from '../app/components/dc-vendor-app-ux-hero.assets.ts'
const browser=await chromium.launch()
const evidence='E:/GitHub/PDPortfolio-DS/ds/evidence/'
const records=[]
try{
 for(const width of [320,768,1024,1280,1440,1920]){
  const page=await browser.newPage({viewport:{width,height:1100}})
  let release
  const gate=new Promise(resolve=>release=resolve)
  const errors=[]
  page.on('pageerror',e=>errors.push(e.message))
  const bp=getHeroBreakpoint(width)
  await page.route('**/dc-vendor-app-ux/hero-layers/'+heroAssets[bp].at(-1).file,async route=>{await gate;await route.continue()})
  await page.goto('http://127.0.0.1:3000/cases/dc-vendor-app-ux/',{waitUntil:'domcontentloaded'})
  const hero=page.locator('.dc-vendor-app-ux-hero')
  await page.waitForFunction(()=>document.querySelector('.dc-vendor-app-ux-hero')?.dataset.ready==='true')
  await page.waitForFunction(()=>[...document.querySelectorAll('.dc-vendor-app-ux-hero img')].filter(i=>!i.closest('.dc-vendor-app-ux-hero__media--title')).every(i=>i.complete&&i.naturalWidth>0))
  const before=await hero.boundingBox()
  assert.equal(await hero.getAttribute('data-media-state'),'loading')
  assert.equal(await hero.locator('img').filter({visible:true}).count(),0)
  assert.equal(await hero.evaluate(el=>getComputedStyle(el,'::after').animationName),'media-shimmer')
  assert.ok(Math.abs(before.height-width*heroReferences[bp].height/heroReferences[bp].width)<.2)
  if([320,768,1920].includes(width))await hero.screenshot({path:evidence+'dc-ux-hero-skeleton-'+width+'.png'})
  release()
  await page.waitForFunction(()=>document.querySelector('.dc-vendor-app-ux-hero')?.dataset.mediaState==='ready')
  assert.equal(await hero.locator('img').filter({visible:true}).count(),10)
  assert.equal(await hero.evaluate(el=>getComputedStyle(el,'::after').content),'none')
  assert.deepEqual(await hero.boundingBox(),before)
  assert.deepEqual(errors,[])
  records.push({width,lastAssetGate:true,shimmer:true,hiddenUntilReady:true,geometryStable:true,errors})
  await page.close()
 }
 // Title is its own decoded boundary while the landscape remains atomic.
 for(const width of [320,768,1024,1280,1440,1920]){
  const page=await browser.newPage({viewport:{width,height:1100}})
  let release
  const gate=new Promise(resolve=>release=resolve),bp=getHeroBreakpoint(width)
  await page.route('**/dc-vendor-app-ux/hero-layers/'+heroAssets[bp][0].file,async route=>{await gate;await route.continue()})
  await page.goto('http://127.0.0.1:3000/cases/dc-vendor-app-ux/',{waitUntil:'domcontentloaded'})
  const hero=page.locator('.dc-vendor-app-ux-hero'),title=hero.locator('.dc-vendor-app-ux-hero__layer:has(.dc-vendor-app-ux-hero__media--title)')
  await page.waitForFunction(()=>document.querySelector('.dc-vendor-app-ux-hero .dc-vendor-app-ux-hero__layer:has(.dc-vendor-app-ux-hero__media--title)')?.dataset.mediaState==='ready')
  assert.equal(await hero.getAttribute('data-media-state'),'loading')
  assert.equal(await title.locator('img').isVisible(),true)
  assert.equal(await title.locator('img').getAttribute('fetchpriority'),'high')
  assert.equal(await hero.locator('img').filter({visible:true}).count(),1)
  assert.equal(await hero.evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(211, 206, 197)')
  assert.equal(await hero.evaluate(el=>getComputedStyle(el,'::after').animationName),'media-shimmer')
  const before=await hero.boundingBox()
  if([320,768,1920].includes(width))await hero.screenshot({path:evidence+'dc-ux-hero-title-skeleton-'+width+'.png'})
  release()
  await page.waitForFunction(()=>document.querySelector('.dc-vendor-app-ux-hero')?.dataset.mediaState==='ready')
  assert.equal(await hero.locator('img').filter({visible:true}).count(),10)
  assert.deepEqual(await hero.boundingBox(),before)
  records.push({width,titleFirst:true,priority:'high',surface:'hsl(39.55 13.59% 80%)',landscapeHiddenUntilReady:true,geometryStable:true})
  await page.close()
 }
 // Network completion alone must not reveal a partially decoded composition.
 const page=await browser.newPage({viewport:{width:768,height:1100}})
 await page.addInitScript(()=>{
  const original=HTMLImageElement.prototype.decode
  window.releaseHeroDecode=undefined
  const gate=new Promise(resolve=>{window.releaseHeroDecode=resolve})
  HTMLImageElement.prototype.decode=async function(){await original.call(this);if(this.closest('.dc-vendor-app-ux-hero'))await gate}
 })
 await page.goto('http://127.0.0.1:3000/cases/dc-vendor-app-ux/',{waitUntil:'networkidle'})
 const hero=page.locator('.dc-vendor-app-ux-hero')
 assert.equal(await hero.locator('img').evaluateAll(es=>es.every(e=>e.complete&&e.naturalWidth>0)),true)
 assert.equal(await hero.getAttribute('data-media-state'),'loading')
 assert.equal(await hero.locator('img').filter({visible:true}).count(),0)
 await page.evaluate(()=>window.releaseHeroDecode())
 await page.waitForFunction(()=>document.querySelector('.dc-vendor-app-ux-hero')?.dataset.mediaState==='ready')
 records.push({width:768,decodeGate:true,hiddenUntilDecoded:true})
 await page.close()
 for(const width of [320,768,1920]){
  const p=await browser.newPage({viewport:{width,height:1100},javaScriptEnabled:false})
  await p.goto('http://127.0.0.1:3000/cases/dc-vendor-app-ux/',{waitUntil:'networkidle'})
  const root=p.locator('.dc-vendor-app-ux-hero')
  assert.equal(await root.getAttribute('data-media-state'),'loading')
  assert.equal(await root.locator('img').filter({visible:true}).count(),0)
  const box=await root.boundingBox(),ref=heroReferences[getHeroBreakpoint(width)]
  assert.ok(Math.abs(box.height-width*ref.height/ref.width)<.2)
  records.push({width,ssrSkeleton:true,geometryStable:true})
  await p.close()
 }
 for(const mode of ['error','reduced-motion','resize']){
  const p=await browser.newPage({viewport:{width:320,height:1100},reducedMotion:mode==='reduced-motion'?'reduce':'no-preference'})
  let release;const gate=new Promise(resolve=>release=resolve)
  await p.route('**/dc-vendor-app-ux/hero-layers/'+heroAssets.base[0].file,async route=>{if(mode==='error')await route.abort();else{await gate;await route.continue()}})
  await p.goto('http://127.0.0.1:3000/cases/dc-vendor-app-ux/',{waitUntil:'domcontentloaded'})
  const root=p.locator('.dc-vendor-app-ux-hero')
  if(mode==='error'){
   await p.waitForFunction(()=>document.querySelector('.dc-vendor-app-ux-hero')?.dataset.mediaState==='error')
   assert.equal(await root.evaluate(el=>getComputedStyle(el,'::after').content),'none')
  }else{
   await p.waitForFunction(()=>document.querySelector('.dc-vendor-app-ux-hero .dc-vendor-app-ux-hero__layer:has(.dc-vendor-app-ux-hero__media--title)')?.dataset.mediaState==='ready')
   assert.equal(await root.getAttribute('data-media-state'),'loading')
   if(mode==='resize'){
    await p.setViewportSize({width:1920,height:1100})
    await p.waitForFunction(()=>document.querySelector('.dc-vendor-app-ux-hero .dc-vendor-app-ux-hero__layer:has(.dc-vendor-app-ux-hero__media--title) img')?.currentSrc.includes('min-1920/title.svg'))
    await p.waitForFunction(()=>document.querySelector('.dc-vendor-app-ux-hero .dc-vendor-app-ux-hero__layer:has(.dc-vendor-app-ux-hero__media--title)')?.dataset.mediaState==='ready')
    assert.equal(await root.getAttribute('data-media-state'),'loading')
    assert.equal(await root.locator('img').filter({visible:true}).count(),1)
   }else assert.equal(await root.evaluate(el=>getComputedStyle(el,'::after').animationName),'none')
   release()
   await p.waitForFunction(()=>document.querySelector('.dc-vendor-app-ux-hero')?.dataset.mediaState==='ready')
  }
  records.push({mode,passed:true});await p.close()
 }
 fs.writeFileSync(evidence+'dc-vendor-app-ux-hero-loading.json',JSON.stringify(records,null,2)+'\n')
 console.log('Passed: six delayed-title and six title-first profiles, hsl(39.55 13.59% 80%), decode gate, three SSR profiles; stable geometry.')
}finally{await browser.close()}
