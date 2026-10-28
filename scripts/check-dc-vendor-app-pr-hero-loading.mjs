import assert from 'node:assert/strict'
import fs from 'node:fs'
import {chromium} from 'playwright'
import {getHeroBreakpoint,heroReferences} from '../app/components/dc-vendor-app-pr-hero.scene-context.ts'
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
  await page.route('**/dc-vendor-app-pr/hero-layers/'+bp+'/title.svg',async route=>{await gate;await route.continue()})
  await page.goto('http://127.0.0.1:3000/cases/dc-vendor-app-pr/',{waitUntil:'domcontentloaded'})
  const hero=page.locator('.dc-vendor-app-pr-hero')
  await page.waitForFunction(()=>document.querySelector('.dc-vendor-app-pr-hero')?.dataset.ready==='true')
  await page.waitForFunction(()=>[...document.querySelectorAll('.dc-vendor-app-pr-hero img')].filter(i=>i.closest('[data-layer]').dataset.layer!=='Title').every(i=>i.complete&&i.naturalWidth>0))
  const before=await hero.boundingBox()
  assert.equal(await hero.getAttribute('data-media-state'),'loading')
  assert.equal(await hero.locator('img').filter({visible:true}).count(),0)
  assert.equal(await hero.evaluate(el=>getComputedStyle(el,'::after').animationName),'media-shimmer')
  assert.ok(Math.abs(before.height-width*heroReferences[bp].height/heroReferences[bp].width)<.2)
  if([320,768,1920].includes(width))await hero.screenshot({path:evidence+'dc-pr-hero-skeleton-'+width+'.png'})
  release()
  await page.waitForFunction(()=>document.querySelector('.dc-vendor-app-pr-hero')?.dataset.mediaState==='ready')
  assert.equal(await hero.locator('img').filter({visible:true}).count(),8)
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
  await page.route('**/dc-vendor-app-pr/hero-layers/'+bp+'/05-landform-city-1st.png',async route=>{await gate;await route.continue()})
  await page.goto('http://127.0.0.1:3000/cases/dc-vendor-app-pr/',{waitUntil:'domcontentloaded'})
  const hero=page.locator('.dc-vendor-app-pr-hero'),title=hero.locator('[data-layer="Title"]')
  await page.waitForFunction(()=>document.querySelector('.dc-vendor-app-pr-hero [data-layer="Title"]')?.dataset.mediaState==='ready')
  assert.equal(await hero.getAttribute('data-media-state'),'loading')
  assert.equal(await title.locator('img').isVisible(),true)
  assert.equal(await title.locator('img').getAttribute('fetchpriority'),'high')
  assert.equal(await hero.locator('img').filter({visible:true}).count(),1)
  assert.equal(await hero.evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(195, 217, 234)')
  assert.equal(await hero.evaluate(el=>getComputedStyle(el,'::after').animationName),'media-shimmer')
  const before=await hero.boundingBox()
  if([320,768,1920].includes(width))await hero.screenshot({path:evidence+'dc-pr-hero-title-skeleton-'+width+'.png'})
  release()
  await page.waitForFunction(()=>document.querySelector('.dc-vendor-app-pr-hero')?.dataset.mediaState==='ready')
  assert.equal(await hero.locator('img').filter({visible:true}).count(),8)
  assert.deepEqual(await hero.boundingBox(),before)
  records.push({width,titleFirst:true,priority:'high',surface:'#C3D9EA',landscapeHiddenUntilReady:true,geometryStable:true})
  await page.close()
 }
 // Network completion alone must not reveal a partially decoded composition.
 const page=await browser.newPage({viewport:{width:768,height:1100}})
 await page.addInitScript(()=>{
  const original=HTMLImageElement.prototype.decode
  window.releaseHeroDecode=undefined
  const gate=new Promise(resolve=>{window.releaseHeroDecode=resolve})
  HTMLImageElement.prototype.decode=async function(){await original.call(this);if(this.closest('.dc-vendor-app-pr-hero'))await gate}
 })
 await page.goto('http://127.0.0.1:3000/cases/dc-vendor-app-pr/',{waitUntil:'networkidle'})
 const hero=page.locator('.dc-vendor-app-pr-hero')
 assert.equal(await hero.locator('img').evaluateAll(es=>es.every(e=>e.complete&&e.naturalWidth>0)),true)
 assert.equal(await hero.getAttribute('data-media-state'),'loading')
 assert.equal(await hero.locator('img').filter({visible:true}).count(),0)
 await page.evaluate(()=>window.releaseHeroDecode())
 await page.waitForFunction(()=>document.querySelector('.dc-vendor-app-pr-hero')?.dataset.mediaState==='ready')
 records.push({width:768,decodeGate:true,hiddenUntilDecoded:true})
 await page.close()
 for(const width of [320,768,1920]){
  const p=await browser.newPage({viewport:{width,height:1100},javaScriptEnabled:false})
  await p.goto('http://127.0.0.1:3000/cases/dc-vendor-app-pr/',{waitUntil:'networkidle'})
  const root=p.locator('.dc-vendor-app-pr-hero')
  assert.equal(await root.getAttribute('data-media-state'),'loading')
  assert.equal(await root.locator('img').filter({visible:true}).count(),0)
  const box=await root.boundingBox(),ref=heroReferences[getHeroBreakpoint(width)]
  assert.ok(Math.abs(box.height-width*ref.height/ref.width)<.2)
  records.push({width,ssrSkeleton:true,geometryStable:true})
  await p.close()
 }
 fs.writeFileSync(evidence+'dc-vendor-app-pr-hero-loading.json',JSON.stringify(records,null,2)+'\n')
 console.log('Passed: six delayed-title and six title-first profiles, #C3D9EA, decode gate, three SSR profiles; stable geometry.')
}finally{await browser.close()}
