import assert from 'node:assert/strict'
import {writeFileSync} from 'node:fs'
import {chromium} from 'playwright'
const browser=await chromium.launch({headless:true})
const evidence='E:/GitHub/PDPortfolio-DS/ds/evidence/'
const results=[]
const profile=w=>w>=1920?'min-1920':w>=1440?'min-1440':w>=1280?'min-1280':w>=1024?'min-1024':w>=768?'min-768':'base'
async function geometry(page){
 return page.locator('.chirp-br-hero').evaluate(root=>{
 const rect=el=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height}}
 const visible=el=>el.getClientRects().length>0
 return {root:rect(root),layers:[...root.querySelectorAll('[data-layer]')].filter(visible).map(el=>({name:el.dataset.layer,rect:rect(el)})),
 images:[...root.querySelectorAll('img')].filter(visible).map(img=>({src:new URL(img.currentSrc).pathname,rect:rect(img)})),
 roles:[...root.querySelectorAll('.ds-role-focus')].filter(visible).map(rect),
 headings:[...root.querySelectorAll('h1')].filter(visible).length,
 overflow:document.documentElement.scrollWidth>innerWidth}
 })
}
try{
 for(const width of [320,534,767,768,1023,1024,1280,1440,1920]){
  const page=await browser.newPage({viewport:{width,height:1400},reducedMotion:'reduce'})
  let release;const gate=new Promise(r=>release=r),requested=[],errors=[]
  page.on('request',r=>{if(r.url().includes('/chirp-brand/hero-layers/'))requested.push(new URL(r.url()).pathname)})
  page.on('pageerror',e=>errors.push(e.message))
  page.on('console',m=>{if(/hydration.*mismatch/i.test(m.text()))errors.push(m.text())})
  await page.route('**/*',async r=>{if(r.request().resourceType()==='script')await gate;await r.continue().catch(()=>{})})
  await page.goto('http://127.0.0.1:3000/cases/chirp-brand/',{waitUntil:'commit'})
  await page.locator('.chirp-br-hero').waitFor()
  await page.evaluate(()=>document.fonts.ready)
  await page.waitForFunction(()=>[...document.querySelectorAll('.chirp-br-hero img')].filter(i=>i.getClientRects().length).every(i=>i.complete&&i.naturalWidth>0))
  const before=await geometry(page)
  assert.equal(before.roles.length,1);assert.equal(before.headings,1);assert.equal(before.overflow,false)
  assert.ok(requested.every(src=>before.images.some(image=>image.src===src)),'inactive profile image requested at '+width+': '+requested.join(','))
  assert.equal(await page.locator('.chirp-br-hero').getAttribute('data-media-state'),'loading')
  assert.equal(await page.locator('.chirp-br-hero img').filter({visible:true}).count(),0)
  if([320,768,1440].includes(width)){
   await page.locator('.chirp-br-hero').evaluate(el=>el.dataset.mediaState='ready')
   await page.screenshot({path:evidence+'chirp-br-first-paint-'+width+'.png'})
   await page.locator('.chirp-br-hero').evaluate(el=>el.dataset.mediaState='loading')
  }
  release()
  await page.waitForFunction(()=>document.querySelector('.chirp-br-hero')?.dataset.ready==='true'&&document.querySelector('.chirp-br-hero')?.dataset.mediaState==='ready')
  await page.waitForLoadState('networkidle')
  const after=await geometry(page)
  assert.equal(await page.locator('.chirp-br-hero__initial').count(),0)
  assert.equal(after.roles.length,1);assert.equal(after.headings,1);assert.equal(after.overflow,false)
  for(const axis of ['x','y','width','height'])assert.ok(Math.abs(before.root[axis]-after.root[axis])<.2,width+' root '+axis)
  for(const group of ['layers','images','roles']){
   assert.equal(before[group].length,after[group].length,width+' '+group+' count')
   before[group].forEach((item,i)=>{
    const a=group==='roles'?item:item.rect,b=group==='roles'?after[group][i]:after[group][i].rect
    if(group==='images')assert.equal(item.src,after[group][i].src)
    for(const axis of ['x','y','width','height'])assert.ok(Math.abs(a[axis]-b[axis])<.2,width+' '+group+' '+i+' '+axis+': '+a[axis]+' -> '+b[axis])
   })
  }
  assert.deepEqual(errors,[])
  results.push({width,before,after,requested});console.log('PASS Brand initial / hydrated '+width);await page.close()
 }
 // Delay an actual selected hero asset while all other blocks load.
 const page=await browser.newPage({viewport:{width:1440,height:1100}})
 let release;const gate=new Promise(r=>release=r)
 await page.route('**/chirp-brand/hero-layers/min-1440/**/title.svg',async r=>{await gate;await r.continue()})
 await page.goto('http://127.0.0.1:3000/cases/chirp-brand/',{waitUntil:'domcontentloaded'})
 await page.waitForFunction(()=>document.querySelector('.chirp-br-hero')?.dataset.ready==='true')
 const hero=page.locator('.chirp-br-hero'),before=await hero.boundingBox()
 assert.equal(await hero.getAttribute('data-media-state'),'loading')
 assert.equal(await hero.locator('.ds-role-focus').isVisible(),true)
 assert.equal(await hero.evaluate(el=>getComputedStyle(el,'::after').animationName),'media-shimmer')
 await page.screenshot({path:evidence+'chirp-br-loading-skeleton.png'})
 release();await page.waitForFunction(()=>document.querySelector('.chirp-br-hero')?.dataset.mediaState==='ready')
 assert.deepEqual(await hero.boundingBox(),before)
 await page.close()
 writeFileSync(evidence+'chirp-br-loading-verification.json',JSON.stringify(results,null,2))
 console.log('PASS Brand local skeleton and reserved geometry')
}finally{await browser.close()}
