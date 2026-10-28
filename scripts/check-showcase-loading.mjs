import assert from 'node:assert/strict'
import {writeFileSync} from 'node:fs'
import {chromium} from 'playwright'
const browser=await chromium.launch({headless:true})
const evidence='E:/GitHub/PDPortfolio-DS/ds/evidence/'
const results=[]
async function geometry(page){
 return page.locator('.chirp-card').evaluateAll(roots=>roots.map(root=>{
 const rect=el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}}
 const visible=el=>!!el.getClientRects().length
 return {ready:root.dataset.ready,rect:rect(root),
 pict:rect(root.querySelector('[class$="__pict"]')),cred:rect(root.querySelector('[class$="__cred"]')),
 blur:rect(root.querySelector('[class$="__blur-scene"]')),copy:rect(root.querySelector('[class$="__copy"]')),
 layers:[...root.querySelector('[class$="__pict"]').querySelectorAll('[data-layer],[class$="__phone"]')].filter(visible).map(el=>({name:el.dataset.layer||'phone',rect:rect(el)})),
 badges:[...root.querySelectorAll('.ds-badge')].filter(visible).map(rect)}
 }))
}
try{
 for(const width of [320,410,425,426,461,462,767,768,1024,1440,1920]){
  const page=await browser.newPage({viewport:{width,height:1080},reducedMotion:'reduce'})
  let release;const gate=new Promise(r=>release=r);const errors=[]
  page.on('pageerror',e=>errors.push(e.message))
  page.on('console',m=>{if(/hydration.*mismatch/i.test(m.text()))errors.push(m.text())})
  await page.route('**/*',async r=>{if(r.request().resourceType()==='script')await gate;await r.continue().catch(()=>{})})
  await page.goto('http://127.0.0.1:3000/',{waitUntil:'commit'})
  await page.locator('.chirp-card').first().waitFor()
  await page.evaluate(()=>document.fonts.ready)
  await page.waitForFunction(()=>[...document.querySelectorAll('.chirp-card img')].every(i=>i.complete&&i.naturalWidth>0))
  const before=await geometry(page)
  if([320,768,1440].includes(width))await page.screenshot({path:evidence+'showcase-first-paint-'+width+'.png',fullPage:true})
  release()
  await page.waitForFunction(()=>[...document.querySelectorAll('.chirp-card')].every(r=>r.dataset.ready==='true'))
  await page.waitForLoadState('networkidle')
  await page.evaluate(()=>document.fonts.ready)
  const after=await geometry(page)
  assert.equal(before.length,4);assert.equal(after.length,4)
  before.forEach((card,i)=>{
   for(const key of ['rect','pict','cred','blur','copy'])for(const axis of ['x','y','width','height'])assert.ok(Math.abs(card[key][axis]-after[i][key][axis])<.25,width+' card'+i+' '+key+'.'+axis+': '+card[key][axis]+' -> '+after[i][key][axis])
   assert.equal(card.layers.length,after[i].layers.length)
   card.layers.forEach((l,j)=>{assert.equal(l.name,after[i].layers[j].name);for(const axis of ['x','y','width','height'])assert.ok(Math.abs(l.rect[axis]-after[i].layers[j].rect[axis])<.25,width+' card'+i+' '+l.name+'.'+axis+': '+l.rect[axis]+' -> '+after[i].layers[j].rect[axis])})
   assert.equal(card.badges.length,after[i].badges.length)
   card.badges.forEach((b,j)=>{for(const axis of ['x','y','width','height'])assert.ok(Math.abs(b[axis]-after[i].badges[j][axis])<.25,width+' card'+i+' badge'+j+'.'+axis)})
  })
  assert.deepEqual(errors,[])
  results.push({width,before,after});console.log('PASS initial / hydrated cards '+width)
  await page.close()
 }
 writeFileSync(evidence+'showcase-first-paint-verification.json',JSON.stringify(results,null,2))
}finally{await browser.close()}
