import assert from 'node:assert/strict'
import {writeFileSync} from 'node:fs'
import {chromium} from 'playwright'
const browser=await chromium.launch({headless:true})
const evidence='E:/GitHub/PDPortfolio-DS/ds/evidence/'
const results=[]
const rect=locator=>locator.evaluate(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}})
async function heldPage(path,asset,reducedMotion='no-preference'){
 const page=await browser.newPage({viewport:{width:1440,height:1080},reducedMotion})
 let release;const gate=new Promise(r=>release=r)
 await page.route('**/*',async route=>{if(new URL(route.request().url()).pathname===asset)await gate;await route.continue().catch(()=>{})})
 await page.goto('http://127.0.0.1:3000'+path,{waitUntil:'domcontentloaded'})
 return {page,release}
}
try{
 for(const reduced of ['no-preference','reduce']){
  const {page,release}=await heldPage('/','/cases/chirp-ai-health-assistant/layers/phone-treatment@2x.png',reduced)
  const card=page.locator('.chirp-health')
  await page.waitForFunction(()=>document.querySelector('.chirp-health')?.dataset.ready==='true')
  await page.waitForFunction(()=>[...document.querySelectorAll('.chirp-card:not(.chirp-health)')].every(el=>el.dataset.mediaState==='ready'))
  assert.equal(await card.getAttribute('data-media-state'),'loading')
  assert.equal(await card.locator('h2').isVisible(),true)
  assert.equal(await card.locator('[class$="__phone"]').first().isVisible(),false)
  const animation=await card.evaluate(el=>getComputedStyle(el,'::after').animationName)
  assert.equal(animation,reduced==='reduce'?'none':'media-shimmer')
  const before=await rect(card)
  if(reduced==='no-preference')await page.screenshot({path:evidence+'showcase-local-skeleton.png'})
  release()
  await page.waitForFunction(()=>document.querySelector('.chirp-health')?.dataset.mediaState==='ready')
  assert.deepEqual(await rect(card),before)
  assert.equal(await card.locator('[class$="__phone"]').first().isVisible(),true)
  results.push({test:'independent card load',reduced,before,animation})
  await page.close()
 }
 {
  // Match the real source recorded in the generated content.
  const page=await browser.newPage({viewport:{width:1440,height:1080}})
  const mediaPath=await import('../content/cases/chirp-ux.json',{with:{type:'json'}}).then(m=>m.default.page.media[0].src)
  let release;const gate=new Promise(r=>release=r)
  await page.route('**/*',async r=>{if(new URL(r.request().url()).pathname===mediaPath)await gate;await r.continue().catch(()=>{})})
  await page.goto('http://127.0.0.1:3000/cases/chirp-ux',{waitUntil:'domcontentloaded'})
  const media=page.locator('.ds-case-image-preview__media').filter({has:page.locator('img[src="'+mediaPath+'"]')})
  await page.waitForFunction(()=>!!document.querySelector('.ds-case-image-preview__media[data-media-state="ready"]'))
  assert.equal(await media.getAttribute('data-media-state'),'loading')
  await media.scrollIntoViewIfNeeded()
  const before=await rect(media);assert.ok(before.height>0)
  assert.equal(await media.locator('img').isVisible(),false)
  await page.screenshot({path:evidence+'case-local-skeleton.png'})
  release()
  await media.evaluate(el=>new Promise(resolve=>{const observer=new MutationObserver(()=>{if(el.dataset.mediaState==='ready'){observer.disconnect();resolve(null)}});observer.observe(el,{attributes:true});if(el.dataset.mediaState==='ready'){observer.disconnect();resolve(null)}}))
  assert.deepEqual(await rect(media),before)
  results.push({test:'case image reserved geometry',mediaPath,before})
  await page.close()
 }
 {
  const {page,release}=await heldPage('/cases/chirp-design-system','/cases/chirp-design-system/overview/button.svg')
  const figure=page.locator('[data-asset="Asset/Button"]')
  await page.waitForFunction(()=>document.querySelector('[data-asset="Asset/ColorBrand"]')?.dataset.mediaState==='ready')
  assert.equal(await figure.getAttribute('data-media-state'),'loading')
  const before=await rect(figure);assert.ok(before.height>0)
  release()
  await page.waitForFunction(()=>document.querySelector('[data-asset="Asset/Button"]')?.dataset.mediaState==='ready')
  assert.deepEqual(await rect(figure),before)
  results.push({test:'independent gallery asset',before});await page.close()
 }
 {
  const {page,release}=await heldPage('/cases/chirp-design-system','/cases/chirp-design-system/hero-layers/b05-metaphor-songbird-v1-1.png')
  const hero=page.locator('.chirp-ds-hero')
  await page.waitForFunction(()=>document.querySelector('.chirp-ds-hero')?.dataset.ready==='true')
  assert.equal(await hero.getAttribute('data-media-state'),'loading')
  assert.equal(await hero.locator('.ds-role-focus').isVisible(),true)
  const before=await rect(hero);release()
  await page.waitForFunction(()=>document.querySelector('.chirp-ds-hero')?.dataset.mediaState==='ready')
  assert.deepEqual(await rect(hero),before)
  results.push({test:'hero composition readiness',before});await page.close()
 }
 {
  const page=await browser.newPage({viewport:{width:1440,height:1080}})
  await page.route('**/phone-treatment@2x.png',r=>r.abort())
  await page.goto('http://127.0.0.1:3000/',{waitUntil:'networkidle'})
  const card=page.locator('.chirp-health')
  await page.waitForFunction(()=>document.querySelector('.chirp-health')?.dataset.mediaState==='error')
  assert.equal(await card.evaluate(el=>getComputedStyle(el,'::after').content),'none')
  assert.equal(await card.locator('h2').isVisible(),true)
  results.push({test:'image error ends skeleton'});await page.close()
 }
 {
  const page=await browser.newPage({viewport:{width:1440,height:1080}})
  await page.addInitScript(()=>{
   const decode=HTMLImageElement.prototype.decode
   HTMLImageElement.prototype.decode=async function(){
    if(this.src.includes('phone-treatment@2x.png'))await new Promise(resolve=>{(window.mediaDecodes??=[]).push(resolve)})
    return decode.call(this)
   }
  })
  await page.goto('http://127.0.0.1:3000/',{waitUntil:'networkidle'})
  await page.waitForFunction(()=>window.mediaDecodes?.length>0)
  assert.equal(await page.locator('.chirp-health').getAttribute('data-media-state'),'loading')
  await page.evaluate(()=>window.mediaDecodes.splice(0).forEach(resolve=>resolve()))
  await page.waitForFunction(()=>document.querySelector('.chirp-health')?.dataset.mediaState==='ready')
  results.push({test:'waits for image decode'});await page.close()
 }
 writeFileSync(evidence+'local-media-loading-verification.json',JSON.stringify(results,null,2))
 console.log('PASS '+results.length+' local media loading scenarios')
}finally{await browser.close()}
